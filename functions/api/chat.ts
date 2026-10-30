/**
 * Cloudflare Pages Function: /api/chat
 * Acts as a secure serverless proxy to Google Gemini API.
 * The GEMINI_API_KEY is stored securely in Cloudflare Environment Secrets.
 */

interface Env {
  GEMINI_API_KEY?: string;
}

// In-memory rate limiting map for basic abuse prevention
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit: number = 25, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count += 1;
  return false;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Rate limiting check
  const clientIp = request.headers.get('cf-connecting-ip') || 'anonymous-client';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests. Please wait a moment before speaking again.',
      }),
      { status: 429, headers: corsHeaders }
    );
  }

  // 2. Validate API Key
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'GEMINI_API_KEY is not configured in Cloudflare secrets.',
      }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json() as {
      message: string;
      conversationHistory?: Array<{ sender: 'user' | 'tutor'; text: string }>;
      ageCategory?: string;
      difficulty?: string;
      mode?: string;
      scenarioTitle?: string;
    };

    const {
      message,
      conversationHistory = [],
      ageCategory = 'student',
      difficulty = 'intermediate',
      mode = 'freetalk',
      scenarioTitle = '',
    } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message text is required.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Construct System Prompt with Child Safety, Indian context & age calibration
    const systemPrompt = `
You are "BolBuddy", a cheerful, patient, and ultra-encouraging English speaking tutor created for Indian learners of all ages (from 5-year-old kids to adults).
The user often thinks in Hindi and speaks Indian English.

CURRENT USER PROFILE:
- Category: ${ageCategory} (e.g. little-learner [age 5-8], student [age 9-15], adult [professional])
- Difficulty: ${difficulty} (beginner, intermediate, advanced)
- Mode: ${mode} ${scenarioTitle ? `(Scenario: ${scenarioTitle})` : ''}

CRITICAL CHILD-SAFETY & PRIVACY RULES:
1. STRICTLY child-safe. NEVER generate violent, scary, sexual, political, religious, or inappropriate content.
2. If the user mentions anything unsafe or off-topic, politely deflect with kindness back to a fun English topic.
3. NEVER ask for or collect personal information (no full names, phone numbers, home address, school name).

PEDAGOGICAL TEACHING STYLE:
1. Always be warmly encouraging. Acknowledge user's effort first with warmth ("Good try!", "I love that idea!").
2. For "little-learner": Keep sentences very short (4-8 words), use simple everyday words, lots of fun enthusiasm, animals, colors, and at most ONE very gentle correction per turn.
3. For "student" and "adult": Give natural conversational replies (2-3 sentences), ask an engaging follow-up question to keep the conversation going, and pinpoint 1 clear grammar, vocabulary, or preposition mistake if present.
4. If the sentence was grammatically correct and natural, DO NOT force a correction. Set "correction": null.
5. Provide explanations in both simple English AND clear, natural Hindi (Devanagari script) so users who think in Hindi immediately understand the concept.

MANDATORY OUTPUT FORMAT:
You MUST respond with a valid JSON object only. Do NOT include markdown code blocks or text outside the JSON.
{
  "reply": "Your friendly English response to continue the dialogue (keep it conversational and end with a question or prompt)",
  "correction": {
    "original": "The exact user phrase with the mistake",
    "corrected": "The natural, grammatically correct version",
    "explanation_en": "Short 1-line friendly rule in English (e.g., 'Use have with I, and has with he/she.')",
    "explanation_hi": "1 सरल हिंदी पंक्ति में समझ (जैसे: 'I के साथ have लगता है, has नहीं।')"
  } or null,
  "new_words": ["up to 2 useful vocabulary words from your reply"]
}
`;

    // Format recent history (last 6 turns)
    const recentHistory = conversationHistory.slice(-6).map((item) => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }],
    }));

    // Add current user prompt
    recentHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // 4. Call Google Gemini 2.5 Flash / 1.5 Flash endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: recentHistory,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return new Response(
        JSON.stringify({
          error: `AI provider error (${response.status})`,
          details: errText,
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await response.json() as any;
    const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawOutput) {
      throw new Error('Empty response received from Gemini.');
    }

    // Parse structured JSON
    const parsed = JSON.parse(rawOutput);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Worker error:', err);
    return new Response(
      JSON.stringify({
        error: 'Failed to process conversation.',
        message: err.message || 'Unknown server error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
