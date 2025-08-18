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
      content: "Since you came to CAARG (me), something is REALLY DARK !",
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
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let incompleteChunk = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        
        // Prepend any incomplete chunk from the previous read
        const lines = (incompleteChunk + chunk).split('\n');

        // The last line might be incomplete, so we save it for the next chunk
        incompleteChunk = lines.pop() || '';

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const data = line.substring(6).trim();
            if (data === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const textChunk = parsed.choices?.[0]?.delta?.content || '';
              if (textChunk) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        lastMessage.content += textChunk;
                    }
                    return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing stream data chunk:", e, "Data:", data);
            }
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
    <div className="relative h-screen text-white antialiased">
      <LiveBackground />
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <div className="flex-1 overflow-hidden">
          <ChatHistory messages={messages} isLoading={isLoading} />
        </div>
        <div className="w-full max-w-3xl mx-auto p-4 md:pb-8">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <p className="text-center text-xs text-gray-500 mt-4">
            Caarg. Generated content may not be accurate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
