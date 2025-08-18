// This config is important for Vercel to correctly handle streaming responses
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // We only want to handle POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // Get the message history from the request body
    const { messages: messagesForApi, systemPrompt } = await req.json();

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      // This error will be logged on the Vercel server, not sent to the client
      console.error("API_KEY environment variable not set on the server");
      return new Response("Server configuration error: API key not found.", { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        // Vercel's deployment URL can be used as a referer
        "HTTP-Referer": req.headers.get('host') || "monochrome-ai-chat.app",
        "X-Title": "Monochrome AI Chat",
      },
      body: JSON.stringify({
        "model": "z-ai/glm-4.5-air:free",
        "messages": [systemPrompt, ...messagesForApi],
        "stream": true
      })
    });

    // Check for API errors before returning the stream
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API Error:", errorBody);
        // Don't expose the full error to the client for security
        return new Response(`Error from AI service: ${response.status}`, { status: response.status });
    }

    // Return the streaming response directly to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response('An internal error occurred on the server.', { status: 500 });
  }
}
