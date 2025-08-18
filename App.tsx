import React, { useState, useCallback } from 'https://esm.sh/react@^19.1.1';
import { type Message } from './types';
import { getChatStream } from './services/geminiService';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import LiveBackground from './components/LiveBackground';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "SInce you came to CAARG (me), something is cooked !",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = useCallback(async (newMessageContent: string) => {
    setIsLoading(true);
    const userMessage: Message = {
      role: 'user',
      content: newMessageContent,
      timestamp: Date.now(),
    };
    
    const currentMessageHistory = [...messages, userMessage];
    
    // Add user message and a placeholder for model response
    setMessages(currentMessageHistory.concat({ role: 'model', content: '', timestamp: Date.now() + 1 }));

    try {
      const stream = await getChatStream(currentMessageHistory);
      
      if (!stream) {
        throw new Error("Failed to get stream from API");
      }
      
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

        for (const line of lines) {
            const jsonString = line.substring(6);
            if (jsonString.trim() === '[DONE]') {
                done = true;
                break;
            }
            try {
                const parsed = JSON.parse(jsonString);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'model') {
                            lastMessage.content += content;
                        }
                        return newMessages;
                    });
                }
            } catch (error) {
                // Ignore parsing errors for empty chunks etc.
            }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'model') {
          lastMessage.content = "I'm sorry, but I encountered an error. Please try again.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-black text-white antialiased">
      <Header />
      <div className="flex-1 overflow-hidden">
        <ChatHistory messages={messages} isLoading={isLoading} />
      </div>
      <div className="w-full max-w-3xl mx-auto p-4 md:pb-8">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="text-center text-xs text-gray-500 mt-4">
          Monochrome AI Chat. Powered by OpenRouter. Generated content may not be accurate.
        </p>
      </div>
    </div>
  );
};

export default App;
