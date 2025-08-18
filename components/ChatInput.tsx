import React, { useState, useRef, useEffect } from 'https://esm.sh/react@^19.1.1';
import { SendIcon } from './IconComponents';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center bg-gray-900 border border-gray-700 rounded-xl shadow-lg transition-all duration-300 focus-within:border-gray-500"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Message Monochrome AI..."
        rows={1}
        className="w-full bg-transparent p-4 pr-16 text-gray-300 placeholder-gray-500 resize-none focus:outline-none max-h-40"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <SendIcon className={`w-6 h-6 ${isLoading || !input.trim() ? 'text-gray-600' : 'text-gray-400 group-hover:text-white transition-colors duration-300'}`} />
      </button>
    </form>
  );
};

export default ChatInput;