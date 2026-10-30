import type { ChatMessage, Correction } from '../types';
import { generateSmartLocalReply } from './conversationEngine';

export interface ChatResponsePayload {
  reply: string;
  correction: Correction | null;
  new_words: string[];
}

const STORAGE_KEY_GEMINI = 'bolenglish_gemini_key';

export function getSavedGeminiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_GEMINI) || '';
  } catch {
    return '';
  }
}

export function saveGeminiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_GEMINI);
    }
  } catch {
    // ignore
  }
}

/**
 * Calls Google Gemini directly from client side if API key is provided
 */
async function callDirectGemini(
  apiKey: string,
  message: string,
  history: ChatMessage[],
  ageCategory: string,
  difficulty: string,
  mode: string,
  scenarioTitle?: string
): Promise<ChatResponsePayload | null> {
  try {
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

    const recentHistory = history.slice(-6).map((item) => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }],
    }));

    recentHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

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
      console.warn('Direct Gemini call failed with status:', response.status);
      return null;
    }

    const data = (await response.json()) as any;
    const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawOutput) {
      return JSON.parse(rawOutput) as ChatResponsePayload;
    }
  } catch (err) {
    console.warn('Direct Gemini exception:', err);
  }
  return null;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  ageCategory: string,
  difficulty: string,
  mode: string,
  scenarioTitle?: string
): Promise<ChatResponsePayload> {
  // 1. If user has saved a Gemini API key locally, use direct Gemini
  const directKey = getSavedGeminiKey();
  if (directKey) {
    const directResult = await callDirectGemini(
      directKey,
      message,
      history,
      ageCategory,
      difficulty,
      mode,
      scenarioTitle
    );
    if (directResult) {
      return directResult;
    }
  }

  // 2. Try Cloudflare Pages Function proxy (/api/chat)
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory: history.map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        ageCategory,
        difficulty,
        mode,
        scenarioTitle,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data as ChatResponsePayload;
    }
  } catch (err) {
    // ignore
  }

  // 3. Robust In-Browser Engine with 35+ Grammar Rules and Dynamic Conversation
  return generateSmartLocalReply(message, history, ageCategory, mode, scenarioTitle);
}
