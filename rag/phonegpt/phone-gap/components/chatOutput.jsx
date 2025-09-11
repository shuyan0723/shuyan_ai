"use client";
import type {
    Message
} from 'ai';

interface ChatOutput{
    messages: Message[],
    status:string
}
export default function ChatOutput({
    messages,
    status
}:ChatOutputProps){
    return (
        <div>

        </div>
    )
}