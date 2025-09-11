// ChatOutput.jsx
"use client";
import type {
  Message
} from 'ai';
import ReactMarkdown from 'react-markdown'

interface ChatOutputProps {
  messages: Message[];
  status: string
}

export default function ChatOutput({
  messages,
  status
}:ChatOutputProps) {
    return (
        <>
          {messages?.length > 0 && (
            <div>
              {messages.map((m, idx) => (
                <div key={idx}>
                  {m.role === 'user' ? (
                    <UserChat content={typeof m.content === 'string' ? m.content : ''} />
                  ) : (
                    <AssistantChat content={typeof m.content === 'string' ? m.content : ''} />
                  )}
                </div>
              ))}
            </div>
          )}
          {
            status === 'submitted' && (
                <div className='text-muted-foreground'>Generating response...</div>
            )
          }
          {
            status === 'error' && (
                <div className='text-red-500'>An error occurred.</div>
            )
          }
        </>
    )
}

const UserChat = ({content}: {content: string}) => {
    return (
        <div className='bg-muted rouned-2xl ml-auto max-w-[80%] w-fit px-3 py-2 mb-6'>
            {content}
        </div>
    )
}

const AssistantChat = ({content}:{content: string}) => {
    return (
        <div className='pr-8 w-full mb-6'>
            <ReactMarkdown
              components={{
                a: ({href, children}) => (
                    <a target="_blank" href={href} className='text-blue-500'>{children}</a >
                )
              }}
            >{content}</ReactMarkdown>
        </div>
    )
}