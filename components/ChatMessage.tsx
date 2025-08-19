import React from 'https://esm.sh/react@^19.1.1';
import ReactMarkdown from 'https://esm.sh/react-markdown@9.0.1';
import remarkGfm from 'https://esm.sh/remark-gfm@4.0.0';
import { type Message } from '../types';
import { UserIcon, ModelIcon } from './IconComponents';
import LoadingBar from './LoadingBar';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatMessageProps {
  message: Message;
  isLoading: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isUser = message.role === 'user';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser
    ? 'bg-gray-800/50 text-gray-200 rounded-br-none'
    : 'bg-black/30 border border-red-500/20 text-gray-200 rounded-bl-none';

  const Avatar = isUser ? UserIcon : ModelIcon;

  return (
    <div className={`flex items-start gap-2 md:gap-4 my-4 animate-fade-in ${containerClasses}`}>
      {!isUser && (
        <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center animate-pop-in">
          <Avatar className="w-full h-full" />
        </div>
      )}
      <div className={`flex flex-col max-w-[85%] md:max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-xl transition-all duration-300 ${bubbleClasses}`}
        >
          <div className="leading-relaxed">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <>
                {isLoading && message.content === '' && (
                  <ThinkingIndicator />
                )}
                {message.content && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({node, ...props}) => <a className="text-orange-400 hover:text-orange-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        code({ node, inline, className, children, ...props }) {
                            return !inline ? (
                                <pre className="bg-red-900/20 p-3 rounded-md my-2 overflow-x-auto">
                                    <code className={`text-orange-200 ${className || ''}`} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            ) : (
                                <code className="bg-red-900/40 text-orange-200 px-1.5 py-0.5 rounded-md" {...props}>
                                    {children}
                                </code>
                            );
                        },
                        ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                        li: ({node, ...props}) => <li className="my-1" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-red-700/50 pl-4 my-2 italic text-gray-400" {...props} />,
                    }}
                  >
                      {message.content}
                  </ReactMarkdown>
                )}
                {isLoading && message.content !== '' && <LoadingBar />}
              </>
            )}
          </div>
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center animate-pop-in">
          <Avatar className="w-5 h-5 text-red-900" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
