import { chatSession } from '../../../utils/GeminiAIModal';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    const result = await chatSession.sendMessage(prompt);
    const text = await result.response.text();
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}