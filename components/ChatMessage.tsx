import React from 'https://esm.sh/react@^19.1.1';
import ReactMarkdown from 'https://esm.sh/react-markdown@9.0.1';
import remarkGfm from 'https://esm.sh/remark-gfm@4.0.0';
import { type Message } from '../types';
import { UserIcon, ModelIcon } from './IconComponents';

interface ChatMessageProps {
  message: Message;
}

const TypingCursor: React.FC = () => (
  <span className="animate-pulse inline-block w-2 h-4 bg-gray-400 ml-1" />
);

// 🔧 Clean markdown & sanitize weird artifacts
function cleanMarkdown(text: string) {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove empty bold/italic markers like **** or ____
  cleaned = cleaned.replace(/(\*\*|\_\_)(\s*)(\*\*|\_\_)/g, '');

  // 2. Remove stray bold/italic markers at start or end
  cleaned = cleaned.replace(/^(\*\*|\*|\_)+/, '').replace(/(\*\*|\*|\_)+$/, '');

  // 3. Normalize & strip combining chars (̶, ̃, etc.)
  cleaned = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 4. Remove stray symbols ▢ ▲ ⃘ and odd unicode boxes
  cleaned = cleaned.replace(/[▢▲⃘■□▪▫◆◇◉◎◌●○]/g, '');

  // 5. Fix malformed table separators (keep only valid rows with 2+ pipes)
  cleaned = cleaned
    .split('\n')
    .filter(line => {
      const pipeCount = (line.match(/\|/g) || []).length;
      return pipeCount === 0 || pipeCount >= 2; // drop garbage rows
    })
    .join('\n');

  return cleaned.trim();
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isEmptyModelMessage = message.role === 'model' && message.content === '';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser
    ? 'bg-gray-200 text-black rounded-br-none'
    : 'bg-gray-900 text-gray-200 rounded-bl-none';

  const Avatar = isUser ? UserIcon : ModelIcon;

  return (
    <div className={`flex items-start gap-4 my-4 animate-fade-in ${containerClasses}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center animate-pop-in">
          <Avatar className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div className={`flex flex-col max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-xl transition-all duration-300 ${bubbleClasses}`}
        >
          <div className="leading-relaxed">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  a: ({node, ...props}) => (
                    <a
                      className="text-gray-400 hover:text-white underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <pre className="bg-black/25 p-3 rounded-md my-2 overflow-x-auto">
                        <code className={`text-gray-300 ${className || ''}`} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-black/50 text-gray-300 px-1.5 py-0.5 rounded-md" {...props}>
                        {children}
                      </code>
                    );
                  },
                  ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                  li: ({node, ...props}) => <li className="my-1" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-gray-700 pl-4 my-2 italic text-gray-400" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-3">
                      <table className="table-auto border-collapse border border-gray-700 w-full text-sm" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-gray-700 px-3 py-1 bg-gray-800 font-semibold" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-gray-700 px-3 py-1" {...props} />
                  ),
                }}
              >
                {cleanMarkdown(message.content)}
              </ReactMarkdown>
            )}
            {isEmptyModelMessage && <TypingCursor />}
          </div>
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center animate-pop-in">
          <Avatar className="w-5 h-5 text-gray-800" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
