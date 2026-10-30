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
  _ageCategory: string,
  _mode: string,
  _scenarioTitle?: string
): ConversationResult {
  turnCounter++;
  const raw = message.trim();
  const lower = raw.toLowerCase();

  // 1. Run comprehensive grammar check
  const correction = checkGrammar(raw);

  // 2. Determine contextual conversational response
  let coreReply = '';
  let newWords: string[] = [];

  // A. Questions asked by user to the tutor
  if (/how\s+are\s+you/i.test(lower)) {
    coreReply = "I am doing wonderfully! Thank you so much for asking. How are you feeling today?";
    newWords = ['Wonderfully', 'Feeling'];
  } else if (/what\s+(?:is\s+)?your\s+name/i.test(lower) || /who\s+are\s+you/i.test(lower)) {
    coreReply = "I am BolBuddy, your friendly English speaking tutor! What is your name?";
    newWords = ['Tutor', 'Friendly'];
  } else if (/what\s+are\s+you\s+doing/i.test(lower)) {
    coreReply = "I am listening to your beautiful English and practicing with you! What are you doing right now?";
    newWords = ['Practicing', 'Listening'];
  } else if (/can\s+you\s+teach\s+me/i.test(lower) || /teach\s+me\s+english/i.test(lower)) {
    coreReply = "Yes, absolutely! I would love to teach you. Let's start right now! What is your favorite thing to do?";
    newWords = ['Absolutely', 'Practice'];
  }

  // B. User introduces themselves ("My name is...", "I am [Name]")
  else if (/(?:my\s+name\s+is|i\s+am)\s+([A-Za-z]+)/i.test(lower) && !/\b(fine|good|happy|sad|tired|hungry|eating|playing|going)\b/i.test(lower)) {
    const match = lower.match(/(?:my\s+name\s+is|i\s+am)\s+([A-Za-z]+)/i);
    const name = match ? match[1].charAt(0).toUpperCase() + match[1].slice(1) : 'friend';
    coreReply = `Hello ${name}! It is so nice to meet you. Are you excited to practice English with me today?`;
    newWords = ['Excited', 'Pleasure'];
  }

  // C. User states their feeling/condition ("I am fine", "I am good", "I am happy")
  else if (/\b(fine|good|great|happy|super|well)\b/i.test(lower) && !/\b(not|bad)\b/i.test(lower)) {
    const feelingReplies = [
      "I am so glad to hear that! What fun activity did you do today?",
      "That is wonderful! Did you play any games or read a nice storybook today?",
      "Awesome! Tell me, what was the best part of your day?"
    ];
    coreReply = feelingReplies[turnCounter % feelingReplies.length];
    newWords = ['Activity', 'Storybook'];
  }

  // D. User mentions dolls, toys, games, playing
  else if (/\b(doll|toy|game|play|cricket|football|car|blocks|drawing|ball)\b/i.test(lower)) {
    const toyMatch = lower.match(/\b(doll|toy|game|cricket|football|car|blocks|drawing|ball)\b/i);
    const item = toyMatch ? toyMatch[0] : 'game';
    const toyReplies = [
      `Playing with your ${item} sounds so much fun! Who do you like playing with the most?`,
      `I love ${item}s too! What is your favorite color for it?`,
      `That sounds super exciting! How long did you play today?`
    ];
    coreReply = toyReplies[turnCounter % toyReplies.length];
    newWords = ['Exciting', 'Favorite'];
  }

  // E. User mentions Animals & Pets
  else if (/\b(dog|cat|puppy|kitten|lion|tiger|elephant|rabbit|monkey|bird|parrot|cow|horse)\b/i.test(lower)) {
    const animMatch = lower.match(/\b(dog|cat|puppy|kitten|lion|tiger|elephant|rabbit|monkey|bird|parrot|cow|horse)\b/i);
    const animal = animMatch ? animMatch[0] : 'animal';
    const animalReplies = [
      `A ${animal} is such a wonderful creature! 🐾 Does it make a loud sound or a quiet sound?`,
      `I really love ${animal}s! If you could have one as a pet, what name would you give it?`,
      `That is so interesting! Where did you see the ${animal}? In a park, zoo, or a picture book?`
    ];
    coreReply = animalReplies[turnCounter % animalReplies.length];
    newWords = ['Creature', 'Interesting'];
  }

  // F. User mentions School, Class, Teacher, Homework
  else if (/\b(school|class|teacher|homework|study|books|pencil|math|science|english)\b/i.test(lower)) {
    const schoolReplies = [
      "School days are full of adventure! What is your favorite subject to study?",
      "Learning new things every day is wonderful. Who is your best friend at school?",
      "That is great! What games do you play during lunch break with your friends?"
    ];
    coreReply = schoolReplies[turnCounter % schoolReplies.length];
    newWords = ['Adventure', 'Subject'];
  }

  // G. User mentions Food, Fruit, Eating
  else if (/\b(food|eat|ate|eating|pizza|burger|ice cream|chocolate|apple|mango|banana|cake|roti|rice|milk)\b/i.test(lower)) {
    const foodMatch = lower.match(/\b(pizza|burger|ice cream|chocolate|apple|mango|banana|cake|roti|rice|milk)\b/i);
    const item = foodMatch ? foodMatch[0] : 'food';
    const foodReplies = [
      `Mmm, ${item} sounds delicious! 🍎 Did you eat it with your family or friends?`,
      `That is so tasty! What is your number one favorite food in the whole world?`,
      `Yummy! Did you help make it, or did someone special cook it for you?`
    ];
    coreReply = foodReplies[turnCounter % foodReplies.length];
    newWords = ['Delicious', 'Special'];
  }

  // H. User mentions Family (Mummy, Papa, Brother, Sister)
  else if (/\b(mother|father|mummy|papa|mom|dad|brother|sister|grandma|grandpa|family)\b/i.test(lower)) {
    const familyReplies = [
      "Spending time with family is the best! What is your favorite game to play together?",
      "Family is so special. Did you help them with anything today?",
      "That is lovely! What sweet memory did you share with them recently?"
    ];
    coreReply = familyReplies[turnCounter % familyReplies.length];
    newWords = ['Special', 'Recently'];
  }

  // I. User says "Yes" / "No" / "Okay"
  else if (/^(yes|yeah|yep|sure|ok|okay)\b/i.test(lower)) {
    const yesReplies = [
      "Great! Tell me more about what you like the most!",
      "I love your enthusiasm! What should we talk about next: animals or your hobbies?",
      "Wonderful! Can you say a full sentence about your day?"
    ];
    coreReply = yesReplies[turnCounter % yesReplies.length];
    newWords = ['Enthusiasm', 'Wonderful'];
  } else if (/^(no|nope|not really)\b/i.test(lower)) {
    const noReplies = [
      "That's totally fine! What would you like to talk about instead?",
      "No problem at all! Would you like to tell me about your favorite cartoon or movie?",
      "Got it! What is one thing that made you smile today?"
    ];
    coreReply = noReplies[turnCounter % noReplies.length];
    newWords = ['Instead', 'Smile'];
  }

  // J. General rotating contextual questions
  else {
    const genericKidReplies = [
      "I loved hearing that! 🌟 Can you tell me what games make you happiest?",
      "That is so interesting! What is your favorite color in the whole rainbow?",
      "Awesome! If you could have any magical superpower, what would you choose?",
      "You are speaking so nicely! Tell me, what did you do this morning?",
      "That sounds great! Do you like sunny days or playing outside in the evening?"
    ];
    coreReply = genericKidReplies[turnCounter % genericKidReplies.length];
    newWords = ['Interesting', 'Bright'];
  }

  // 3. IF THERE WAS A GRAMMAR MISTAKE:
  // Prepend the spoken correction clearly so the daughter immediately HEARS it!
  let fullSpokenReply = coreReply;
  if (correction) {
    fullSpokenReply = `Good try! A better way to say it is: "${correction.corrected}". ${coreReply}`;
  }

  return {
    reply: fullSpokenReply,
    correction,
    new_words: newWords
  };
}
