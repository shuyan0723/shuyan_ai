import {
  embed,
  streamText
} from 'ai';
import {
  createOpenAI
} from '@ai-sdk/openai';
import {
  createClient
} from '@supabase/supabase-js';
// import "dotenv/config";

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
  console.log('=== 开始调用 RPC 函数 ===');
  console.log('Embedding 长度:', embedding.length);
  console.log('Embedding 前5个值:', embedding.slice(0, 5));
  
  const { data, error } = await supabase.rpc("get_relevant_chunks", {
    query_vector: embedding,
    match_threshold: 0.2,
    match_count: 3
  });
  
  console.log('=== RPC 调用结果 ===');
  console.log('Error:', error);
  console.log('Data:', data);
  console.log('Data type:', typeof data);
  console.log('Data length:', data?.length);
  
  if (error) {
    console.error('Supabase RPC 错误详情:', JSON.stringify(error, null, 2));
    throw error;
  }
  
  console.log(data, '////////////////');
  return JSON.stringify(
    data.map((item:any) => `
      Source: ${item.url},
      Date Updated: ${item.date_updated}
      Content: ${item.content}  
    `)
  )
}

// async function fetchRelevantContext(embedding: number[]) {
//   const {
//     data, 
//     error
//   } = await supabase.rpc("get_relevant_chunks", {
//     query_vector: embedding,
//     match_threshold: 0.7,
//     match_count: 3
//   })

//   if (error) throw error;
//   console.log(data, '////////////////')
//   return JSON.stringify(
//     data.map((item:any) => `
//       Source: ${item.url},
//       Date Updated: ${item.date_updated}
//       Content: ${item.content}  
//     `)
//   ) 
// }

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
    const latestMessage = messages.at(-1).content;
    // embedding
    const { embedding } = await generateEmbedding(latestMessage);
    // console.log(embedding);
    // 相似度计算
    const context = await fetchRelevantContext(embedding);
    const prompt = createPrompt(context, latestMessage);
    console.log(prompt);
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [prompt, ...messages]
    })

     // 关键：必须返回 Response
    return result.toDataStreamResponse();
  } catch(err) {
  console.error('POST 处理错误:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}