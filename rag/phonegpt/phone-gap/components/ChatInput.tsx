"use client";
import {
     Input 
    } from "@/components/ui/input";
import { 
    Button 
} from "@/components/ui/button";
import {
    ArrowUp
} from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e:any)=>void;
  handleSubmit: (e: any)=>void;
}
// const ChatInput: React.FC<ChatInputProps> = ({
export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit
}:ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="请问我手机相关问题..."
      />
      <Button type="submit">
         <ArrowUp/>
         <span className="sr-only">发送</span>
      </Button>
    </form>
  )
}