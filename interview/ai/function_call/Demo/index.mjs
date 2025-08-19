import OpenAI from 'openai'; // es6 module

const client = new OpenAI({
    apiKey: 'sk-h91KBBHUC30pbiviNhD9I5YnyC7gcdd4CzPCKJcMhnkm7IT9', // 302 平台的 API 密钥
    baseURL: 'https://api.302.ai/v1', // 302 平台的 API 地址
})
const getWeather = async (city) => {
    return `城市${city}的天气是：晴`;
}


async function main() {
    const resp = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: "今天抚州天气怎么样?"
            }
        ],
        // LLM 使用的工具 可以调用的tool 配置
        tools: [
            {
                type: 'function',
                function: {
                    name: "getWeather",
                    description: "获取某个城市的天气",
                    parameters: {
                        type: "object",
                        properties: {
                            city: {
                                type: "string"
                            }
                        },
                        required: ["city"]
                    }
                }
            }
        ]
    });

     const toolCall=resp.choices[0].message.tool_calls?.[0];
     console.log('大模型调用toolCall:',toolCall);
}

main();