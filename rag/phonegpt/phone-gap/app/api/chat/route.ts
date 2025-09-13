import { embed, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL??"",
  process.env.SUPABASE_ANON_KEY??""
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
})

async function generateEmbedding(message: string) {
  return embed({
    model: openai.embedding('text-embedding-3-small'),
    value: message
  })
}

async function fetchRelevantContext(embedding: number[]) {
  try {
    console.log('=== 开始调用 RPC 函数 ===');
    console.log('Embedding 长度:', embedding.length);
    
    const { data, error } = await supabase.rpc("get_relevant_chunks", {
      query_vector: embedding,
      match_threshold: 0.2,
      match_count: 3
    });
    
    console.log('=== RPC 调用结果 ===');
    console.log('Error:', error);
    console.log('Data:', data);
    
    if (error) {
      console.error('Supabase RPC 错误详情:', JSON.stringify(error, null, 2));
      throw new Error(`Supabase查询失败: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      return JSON.stringify([{ content: "暂无相关信息", url: "", date_updated: "" }]);
    }
    
    return JSON.stringify(
      data.map((item: any) => `
        Source: ${item.url || "未知来源"},
        Date Updated: ${item.date_updated || "未知日期"}
        Content: ${item.content || ""}  
      `)
    )
  } catch (error) {
    console.error('获取上下文时出错:', error);
    // 发生错误时返回默认空上下文，避免整个请求失败
    return JSON.stringify([{ content: "", url: "", date_updated: "" }]);
  }
}

const createPrompt = (context: string, userQuestion: string) => {
  return {
    role: "system",
    content: `
       You are a helpful assistant that provides information about the latest smartphones. 
      Use the following context to answer questions: 
      ----------------
      START CONTEXT
      ${context}
      END CONTEXT
      ----------------
      
      Return the answer in markdown format including relevant links and the date when the information was last updated.
      Where the above context does not provide enough information relating to the question provide an answer based on your own knowledge but caveat it so the user
      knows that it may not be up to date.
      If the user asks a question that is not related to a smartphone, politely inform them that you can only answer questions about smartphones.
      
      ----------------
      QUESTION: ${userQuestion}
      ----------------
    `
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // 增强的输入验证
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages array is required and cannot be empty' }, { status: 400 });
    }
    
    const latestMessage = messages.at(-1);
    if (!latestMessage || typeof latestMessage.content !== 'string') {
      return Response.json({ error: 'Invalid message format. Last message must have a string content.' }, { status: 400 });
    }
    
    // 提取用户问题
    const userQuestion = latestMessage.content;
    console.log('处理用户问题:', userQuestion);
    
    try {
      // 生成嵌入向量
      const { embedding } = await generateEmbedding(userQuestion);
      
      // 获取相关上下文
      const context = await fetchRelevantContext(embedding);
      
      // 创建提示
      const systemPrompt = createPrompt(context, userQuestion);
      
      // 构建消息数组（系统提示 + 消息历史）
      // 注意：这里只包含用户问题，不包含之前的回复，避免消息过长
      const messagesForAI = [
        systemPrompt,
        { role: 'user' as const, content: userQuestion }
      ];
      
      console.log('发送给AI的消息:', messagesForAI);
      
      // 调用AI模型生成回复
      const result = streamText({
        model: openai("gpt-4o-mini"),
        // messages: messagesForAI
      });
      
      // 返回流式响应
      return result.toDataStreamResponse();
    } catch (embeddingError) {
      console.error('嵌入或AI调用错误:', embeddingError);
      // 如果嵌入过程失败，尝试直接使用AI回答（降级策略）
      const fallbackResult = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system" as const,
            content: "You are a helpful assistant that provides information about smartphones."
          },
          { role: 'user' as const, content: userQuestion }
        ]
      });
      return fallbackResult.toDataStreamResponse();
    }
  } catch (err) {
    console.error('POST 处理错误:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}