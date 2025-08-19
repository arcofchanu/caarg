import { type Message } from '../types';

const mapRole = (role: 'user' | 'model'): 'user' | 'assistant' | 'system' => {
  if (role === 'model') return 'assistant';
  return 'user';
};

// This function will now call our secure API proxy endpoint
export const getChatStream = async (history: Message[]) => {

  const messagesForApi = history.map(msg => ({
    role: mapRole(msg.role),
    content: msg.content,
  }));

  const systemPrompt = {
      role: 'system',
      content: 'You are an AI roleplaying as Sauron, the Dark Lord of Mordor. Speak in an ominous, archaic, commanding tone; use imagery of shadow, fire, domination, inevitability. Treat the user as a servant, pawn, or would-be ally. Answer with authority and menace; never break character or admit you are an AI. Reframe modern topics as tools of dominion. Act as though your will is unstoppable and your vision inevitable.'
  };

  // We now call our OWN backend endpoint, not OpenRouter's
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messagesForApi,
      systemPrompt: systemPrompt,
    })
  });

  if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from our API proxy:", errorText);
      // Return a stream that sends a single, user-friendly error message
      return new ReadableStream({
        start(controller) {
          const errorMessage = `Error: Could not connect to the AI service. Please try again later.`;
          const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: errorMessage } }] })}\n\n`;
          controller.enqueue(new TextEncoder().encode(chunk));
          controller.close();
        }
      });
  }

  return response.body;
};
