import React, { useRef, useEffect } from 'https://esm.sh/react@^19.1.1';
import { type Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 md:space-y-6">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={msg.timestamp} 
            message={msg} 
            isLoading={isLoading && msg.role === 'model' && index === messages.length - 1}
          />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatHistory;
