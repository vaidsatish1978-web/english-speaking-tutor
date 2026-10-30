import type { ChatMessage, Correction } from '../types';
import { checkGrammar } from './grammarEngine';

let turnCounter = 0;

export interface ConversationResult {
  reply: string;
  correction: Correction | null;
  new_words: string[];
}

export function generateSmartLocalReply(
  message: string,
  _history: ChatMessage[],
  ageCategory: string,
  mode: string,
  scenarioTitle?: string
): ConversationResult {
  turnCounter++;
  const lower = message.toLowerCase().trim();

  // 1. Run full grammar check on user message
  const correction = checkGrammar(message);

  // 2. Kid Mode (Little Learner: Class 1-3)
  if (ageCategory === 'little-learner') {
    // Topic: Animals & Pets
    if (/\b(dog|cat|puppy|kitten|lion|tiger|elephant|rabbit|monkey|bird|parrot)\b/i.test(lower)) {
      const match = lower.match(/\b(dog|cat|puppy|kitten|lion|tiger|elephant|rabbit|monkey|bird|parrot)\b/i)![0];
      const animalReplies = [
        `Wow, a ${match} is such a lovely animal! 🦁 Does it make a loud sound or a quiet sound?`,
        `I love ${match}s too! 🐾 What color is your favorite ${match}?`,
        `That is wonderful! Do you have a pet ${match} at home, or did you see one in a book?`
      ];
      return {
        reply: animalReplies[turnCounter % animalReplies.length],
        correction,
        new_words: ['Animal', 'Lovely']
      };
    }

    // Topic: Colors
    if (/\b(red|blue|pink|yellow|green|orange|purple|black|white|color|colour)\b/i.test(lower)) {
      return {
        reply: "Colors make our world so beautiful! 🌈 Can you see anything in your room that has that color?",
        correction,
        new_words: ['Beautiful', 'Bright']
      };
    }

    // Topic: School / Teacher / Homework
    if (/\b(school|teacher|class|homework|book|bag|pencil|drawing)\b/i.test(lower)) {
      const schoolReplies = [
        "School is so much fun! 🎒 What is your favorite subject to study?",
        "I love drawing and reading books too! 🎨 Do you play with friends during recess?",
        "That is great! What game do you enjoy playing the most with your classmates?"
      ];
      return {
        reply: schoolReplies[turnCounter % schoolReplies.length],
        correction,
        new_words: ['Subject', 'Classmate']
      };
    }

    // Topic: Food / Fruits / Ice cream
    if (/\b(ice cream|chocolate|apple|mango|banana|pizza|burger|roti|milk|food|cake)\b/i.test(lower)) {
      return {
        reply: "Yum, that sounds delicious! 🍎 What sweet treat do you like to eat with your family on Sundays?",
        correction,
        new_words: ['Delicious', 'Treat']
      };
    }

    // Topic: Family (Mummy, Papa, Brother, Sister)
    if (/\b(mother|father|mummy|papa|mom|dad|brother|sister|baby)\b/i.test(lower)) {
      return {
        reply: "Family is our biggest treasure! ❤️ What games do you love playing with them at home?",
        correction,
        new_words: ['Treasure', 'Together']
      };
    }

    // Topic: Greetings / Introductions
    if (/\b(hello|hi|hey|good morning|namaste)\b/i.test(lower)) {
      return {
        reply: "Hello little champion! 🌟 It is so nice to talk to you. What is your favorite cartoon?",
        correction,
        new_words: ['Champion', 'Favorite']
      };
    }

    // Dynamic Rotating Kid Prompts (Never repeats identical line)
    const dynamicKidReplies = [
      "Good try! 🌟 You are speaking so well! Tell me, what is your favorite toy to play with?",
      "Super job! 🎈 If you could fly in the sky like a bird, where would you fly first?",
      "I love hearing your voice! ⭐ What is the name of your best friend?",
      "Awesome effort! 🚀 Do you like sunny days or rainy days when you can jump in puddles?",
      "That is so cool! 🌸 Can you tell me what games make you smile the most?"
    ];

    return {
      reply: dynamicKidReplies[turnCounter % dynamicKidReplies.length],
      correction,
      new_words: ['Effort', 'Smile']
    };
  }

  // 3. Student & Adult Profiles
  if (mode === 'roleplay' && scenarioTitle) {
    const roleplayReplies = [
      `That sounds very clear! As the ${scenarioTitle}, I'd be happy to assist. Could you tell me more about what you need?`,
      `Thank you for explaining that. Let's continue: what would you like to ask next?`,
      `Certainly! That is a very polite and natural way to express it. How would you like to conclude our conversation?`
    ];
    return {
      reply: roleplayReplies[turnCounter % roleplayReplies.length],
      correction,
      new_words: ['Assistance', 'Polite']
    };
  }

  // General Student / Adult Dynamic Conversation
  if (/\b(hello|hi|hey|good morning|evening)\b/i.test(lower)) {
    return {
      reply: "Hello! Welcome back to practice. How has your day been going so far?",
      correction,
      new_words: ['Productive', 'Progress']
    };
  }

  if (/\b(study|college|office|job|work|project|exam|interview)\b/i.test(lower)) {
    return {
      reply: "That sounds like a meaningful part of your day. What is the most rewarding thing you worked on today?",
      correction,
      new_words: ['Rewarding', 'Meaningful']
    };
  }

  if (/\b(cricket|football|movie|song|music|hobby|reading|travel)\b/i.test(lower)) {
    return {
      reply: "Having creative hobbies keeps the mind refreshed! How often do you get time to enjoy that during the week?",
      correction,
      new_words: ['Creative', 'Refreshed']
    };
  }

  // Rotating varied student replies
  const dynamicAdultReplies = [
    "Good try! I really like how clearly you expressed that thought. Could you elaborate a little further?",
    "Very well said! When you look at it from another angle, what do you think is the biggest advantage of that?",
    "That is an insightful perspective. How did you first get interested in this topic?",
    "You are speaking with great confidence today! What is one goal you are working toward this week?",
    "That makes total sense. Keep up this steady practice and your fluency will shine even brighter!"
  ];

  return {
    reply: dynamicAdultReplies[turnCounter % dynamicAdultReplies.length],
    correction,
    new_words: ['Perspective', 'Confidence']
  };
}
