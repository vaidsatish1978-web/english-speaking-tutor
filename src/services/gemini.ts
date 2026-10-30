import type { ChatMessage, Correction } from '../types';

export interface ChatResponsePayload {
  reply: string;
  correction: Correction | null;
  new_words: string[];
}

/**
 * Intelligent local fallback tutor engine used during local development
 * or if the network proxy is unreachable.
 */
function generateLocalFallbackReply(
  message: string,
  ageCategory: string,
  mode: string
): ChatResponsePayload {
  const clean = message.toLowerCase().trim();

  let correction: Correction | null = null;
  let newWords: string[] = [];

  if (clean.includes('i has')) {
    correction = {
      original: 'I has',
      corrected: 'I have',
      explanation_en: 'Use "have" with "I", and "has" with he, she, or it.',
      explanation_hi: '"I" के साथ "have" का प्रयोग करें, "has" का नहीं।',
    };
  } else if (clean.includes('i am agree')) {
    correction = {
      original: 'I am agree',
      corrected: 'I agree',
      explanation_en: '"Agree" is already a verb, you do not need "am".',
      explanation_hi: '"Agree" खुद एक क्रिया है, इसके आगे "am" नहीं लगाते।',
    };
  } else if (clean.includes('cousin brother') || clean.includes('cousin sister')) {
    correction = {
      original: clean.includes('cousin brother') ? 'cousin brother' : 'cousin sister',
      corrected: 'cousin',
      explanation_en: 'In English, simply say "cousin" instead of "cousin brother/sister".',
      explanation_hi: 'अंग्रेज़ी में केवल "cousin" कहा जाता है, brother या sister नहीं जोड़ते।',
    };
  } else if (clean.includes('yesterday i go')) {
    correction = {
      original: 'yesterday I go',
      corrected: 'yesterday I went',
      explanation_en: 'For past actions ("yesterday"), use the past tense "went".',
      explanation_hi: 'बीते कल की बात बताने के लिए past tense "went" का प्रयोग करें।',
    };
  } else if (clean.includes('i am knowing')) {
    correction = {
      original: 'I am knowing',
      corrected: 'I know',
      explanation_en: '"Know" is a state verb, so say "I know" instead of "I am knowing".',
      explanation_hi: '"Know" के साथ -ing नहीं लगाते, सीधा "I know" बोलते हैं।',
    };
  } else if (clean.includes('open the light') || clean.includes('close the light')) {
    const isClose = clean.includes('close the light');
    correction = {
      original: isClose ? 'close the light' : 'open the light',
      corrected: isClose ? 'turn off the light' : 'turn on the light',
      explanation_en: 'For electrical appliances, say "turn on" or "turn off".',
      explanation_hi: 'बत्ती या पंखा चालू/बंद करने के लिए "turn on" या "turn off" कहते हैं।',
    };
  }

  // Kid responses
  if (ageCategory === 'little-learner') {
    newWords = ['Awesome', 'Bright'];
    if (clean.includes('hello') || clean.includes('hi')) {
      return {
        reply: "Hello little friend! 🌟 I'm BolBuddy! What is your favorite animal?",
        correction,
        new_words: ['Favorite', 'Animal']
      };
    }
    if (clean.includes('dog') || clean.includes('cat') || clean.includes('lion') || clean.includes('tiger')) {
      return {
        reply: "Wow, that animal is super cool! 🦁 What sound does it make?",
        correction,
        new_words: ['Roar', 'Gentle']
      };
    }
    return {
      reply: "Good try! 🌈 That sounds so fun. What games do you like to play outside?",
      correction,
      new_words: newWords
    };
  }

  // Student & Adult responses
  if (mode === 'roleplay') {
    return {
      reply: "Thank you for sharing! That is very clear. What would you like to ask next?",
      correction,
      new_words: ['Convenient', 'Pleasure']
    };
  }

  if (clean.includes('hello') || clean.includes('hi')) {
    return {
      reply: "Hello! It is great to practice with you today. How was your day so far?",
      correction,
      new_words: ['Pleasant', 'Productive']
    };
  }

  return {
    reply: "Good try! That is very interesting. Could you tell me more about what you think about this?",
    correction,
    new_words: ['Interesting', 'Perspective']
  };
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  ageCategory: string,
  difficulty: string,
  mode: string,
  scenarioTitle?: string
): Promise<ChatResponsePayload> {
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

    console.warn('/api/chat returned status', response.status, '- using local smart tutor engine fallback.');
  } catch (err) {
    console.warn('Network call to /api/chat failed - using local fallback engine.');
  }

  return generateLocalFallbackReply(message, ageCategory, mode);
}
