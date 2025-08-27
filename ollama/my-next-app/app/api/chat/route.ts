import type {NextRequest} from 'next/server';

import {
    Message,
    ChatRequest,
    ChatResponse,
} from '@/types/chat';

const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
const MODEL_NAME = 'deepseek-r1:1.5b';

export async function POST(req: NextRequest) {
    // const {messages} = await req.json() as ChatRequest;
    try{
        const body:{messages:Message[]} = await req.json();

        const OllamaRequest:ChatRequest = {
            model: MODEL_NAME,
            messages: body.messages,
            stream: false,
        }
        const res = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(OllamaRequest),
        })

        if(!res.ok){
            const errorData = await res.json();
            return Response.json({
                error:`Ollama API ERROR:${errorData.error}`
            })
        }
        const OllamaData:ChatResponse = await res.json();
        return Response.json(OllamaData);
    }catch(err){
        console.error('Error parsing request body:', err);
        return Response.json({
            status:500,
            error:'Invalid request body',
        })
    }
}
