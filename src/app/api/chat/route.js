export const runtime = 'nodejs';

const fallback = 'The AI assistant is temporarily unavailable. Please use the project enquiry form.';
const systemInstruction = 'You are Nexora Solutions project discovery assistant. Nexora builds websites, Flutter apps, AI assistants, automations, UI/UX and custom software. Be concise, practical and honest. Never invent prices, guarantees or client work. Ask about goals, users, features, integrations, timeline and budget. Never ask for passwords, payment details or confidential credentials. Encourage visitors to submit the project enquiry form.';

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (!messages.length || messages.length > 12) {
      return Response.json({ error: 'Please send a shorter conversation.' }, { status: 400 });
    }

    const clean = messages
      .filter((m) => ['user', 'assistant'].includes(m?.role) && typeof m?.content === 'string')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.slice(0, 1800) }],
      }));

    if (!clean.length) {
      return Response.json({ error: 'A message is required.' }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error('[Nexora chat] GEMINI_API_KEY is missing in this deployment.');
      return Response.json({ reply: fallback });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: clean,
            generationConfig: { temperature: 0.5, maxOutputTokens: 450 },
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        console.error('[Nexora chat] Gemini request failed:', JSON.stringify({
          status: response.status,
          code: data?.error?.status,
          message: data?.error?.message,
        }));
        return Response.json({ reply: fallback });
      }

      const reply = data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim();

      return Response.json({ reply: reply || 'Tell me a little more about your project.' });
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error('[Nexora chat] Request failed:', error?.name || 'Error', error?.message || 'Unknown error');
    return Response.json(
      { reply: 'I could not process that message. Please use the project enquiry form.' },
      { status: 200 },
    );
  }
}
