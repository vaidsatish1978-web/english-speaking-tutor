import type { ChatMessage, Correction } from '../types';
import { checkGrammar } from './grammarEngine';

interface ConversationState {
  studentName: string | null;
  lastTopic: string | null;
  turnCount: number;
}

const state: ConversationState = {
  studentName: null,
  lastTopic: null,
  turnCount: 0,
};

export interface ConversationResult {
  reply: string;
  correction: Correction | null;
  new_words: string[];
}

const NON_NAME_WORDS = new Set([
  'fine', 'good', 'great', 'happy', 'sad', 'tired', 'hungry', 'sleepy', 'bored', 'sick',
  'playing', 'eating', 'going', 'studying', 'reading', 'drawing', 'sleeping', 'running',
  'student', 'boy', 'girl', 'a', 'an', 'the', 'here', 'there', 'ready', 'okay', 'ok',
  'not', 'doing', 'watching', 'listening', 'learning', 'speaking', 'talking', 'cooking',
  'seven', 'eight', 'nine', 'ten', 'years', 'old', 'class'
]);

function extractNameIntro(raw: string): string | null {
  // Explicit: "my name is Priya", "mera naam Priya hai", "call me Priya"
  const explicit = raw.match(/(?:my name is|mera naam|call me)\s+([A-Za-z\u0900-\u097F]+)/i);
  if (explicit) {
    const candidate = explicit[1].trim();
    if (!NON_NAME_WORDS.has(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  // Exact intro: "I am Priya" or "I'm Priya" (only single name after I am)
  const iAmMatch = raw.match(/^(?:i am|i'm)\s+([A-Za-z]+)$/i);
  if (iAmMatch) {
    const candidate = iAmMatch[1].trim();
    if (!NON_NAME_WORDS.has(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  return null;
}

export function generateSmartLocalReply(
  message: string,
  _history: ChatMessage[],
  _ageCategory: string,
  _mode: string,
  _scenarioTitle?: string
): ConversationResult {
  state.turnCount++;
  const raw = message.trim();
  const lower = raw.toLowerCase();

  // 1. Check for grammatical mistakes using 35+ Indian English and learner rules
  const correction = checkGrammar(raw);

  // Helper to attach correction speech to reply
  const formatReply = (coreReply: string, newWords: string[]): ConversationResult => {
    let reply = coreReply;
    if (correction) {
      reply = `Good try! A better way to say it is: "${correction.corrected}". ${coreReply}`;
    }
    return {
      reply,
      correction,
      new_words: newWords,
    };
  };

  // 2. Check if student is introducing their name
  const newName = extractNameIntro(raw);
  if (newName) {
    state.studentName = newName;
  }

  const namePrefix = state.studentName ? `${state.studentName}` : 'friend';

  // 3. Detect Hindi / Hinglish and teach the English translation directly!
  const hasHindiScript = /[\u0900-\u097F]/.test(raw);
  const isHinglish = /\b(mera|meri|mujhe|hum|kya|kaise|kaha|kahan|kyun|sikhao|sikhna|padhna|khelna|accha|bahut|theek|nahi|hai|ho|hu|tha|the|aaj|kal|khana|pani|didi|bhaiya)\b/i.test(lower);

  if (hasHindiScript || isHinglish) {
    if (/\b(naam|name)\b/i.test(lower) && state.studentName) {
      return {
        reply: `बहुत बढ़िया ${state.studentName}! इसे इंग्लिश में ऐसे बोलिए: "Hello! My name is ${state.studentName}." अब माइक दबाकर बोलिए!`,
        correction: null,
        new_words: ['Name', 'Introduction'],
      };
    }
    if (/\b(sikhna|sikhao|sikha\s+do|learn)\b/i.test(lower)) {
      return {
        reply: `हाँ बिल्कुल! इसे इंग्लिश में ऐसे बोलिए: "I want to learn English." अब आप माइक दबाकर यही वाक्य बोलिए!`,
        correction: null,
        new_words: ['Learn', 'Practice'],
      };
    }
    if (/\b(kaise\s+ho|kaisa\s+hai)\b/i.test(lower)) {
      return {
        reply: `मैं बहुत अच्छा हूँ! इसे इंग्लिश में ऐसे पूछिए: "How are you BolBuddy?" अब आप बोलकर कोशिश कीजिए!`,
        correction: null,
        new_words: ['How', 'Fine'],
      };
    }
    if (/\b(kaun\s+ho|kon\s+ho)\b/i.test(lower)) {
      return {
        reply: `मैं BolBuddy हूँ! इसे इंग्लिश में ऐसे पूछिए: "Who are you?" अब आप माइक दबाकर पूछिए!`,
        correction: null,
        new_words: ['Who', 'Friend'],
      };
    }
    if (/\b(khelna|khelte|khel)\b/i.test(lower)) {
      return {
        reply: `अरे वाह! इसे इंग्लिश में ऐसे कहिए: "I like playing games." अब माइक दबाकर यही बोलिए!`,
        correction: null,
        new_words: ['Like', 'Playing'],
      };
    }
    if (/\b(khana|kha\s+liya|khaa)\b/i.test(lower)) {
      return {
        reply: `बहुत अच्छे! इसे इंग्लिश में ऐसे कहिए: "I ate delicious food." अब आप माइक दबाकर बोलिए!`,
        correction: null,
        new_words: ['Delicious', 'Food'],
      };
    }
    if (/\b(samajh\s+nahi|samjha\s+nahi)\b/i.test(lower)) {
      return {
        reply: `कोई बात नहीं! इसे इंग्लिश में ऐसे कहिए: "I did not understand. Please explain." अब बोलिए!`,
        correction: null,
        new_words: ['Understand', 'Explain'],
      };
    }
    return {
      reply: `अरे वाह! कोशिश कीजिए कि जो बात आपने अभी कही, उसे थोड़े से आसान इंग्लिश शब्दों में बोलें। जैसे माइक दबाकर बोलिए: "I am ready to speak!" अब बोलिए!`,
      correction: null,
      new_words: ['Ready', 'Speak'],
    };
  }

  // 4. Handle Direct Questions from the Student
  if (/^how\s+(are|is)\s+you/i.test(lower)) {
    return formatReply(
      `I am doing wonderfully, thank you ${namePrefix}! How are you feeling today?`,
      ['Wonderfully', 'Feeling']
    );
  }

  if (/^(what\s+is\s+your\s+name|who\s+are\s+you)/i.test(lower)) {
    return formatReply(
      "My name is BolBuddy! I am your personal English conversation tutor. What is your name?",
      ['Personal', 'Tutor']
    );
  }

  if (/where\s+do\s+you\s+(live|stay)/i.test(lower) || /where\s+are\s+you\s+from/i.test(lower)) {
    return formatReply(
      `I live right inside your app to help you practice speaking English anytime! Where do you live, ${namePrefix}?`,
      ['Practice', 'Anytime']
    );
  }

  if (/what\s+are\s+you\s+doing/i.test(lower)) {
    return formatReply(
      `I am listening to your English and enjoying our conversation! What are you doing right now, ${namePrefix}?`,
      ['Listening', 'Enjoying']
    );
  }

  if (/can\s+you\s+teach\s+me/i.test(lower) || /teach\s+me\s+english/i.test(lower)) {
    return formatReply(
      `Yes, absolutely! I would love to teach you English. Let's start with your day. What did you do today?`,
      ['Absolutely', 'Start']
    );
  }

  if (/what\s+is\s+this/i.test(lower)) {
    return formatReply(
      "This is BolEnglish! A cheerful practice app to help you speak English fluently with confidence. Are you ready to speak?",
      ['Fluently', 'Confidence']
    );
  }

  if (/(can\s+you|do\s+you)\s+speak\s+hindi/i.test(lower)) {
    return formatReply(
      "Yes, I understand Hindi, but our goal is to practice English together! Can you tell me your favorite English word?",
      ['Goal', 'Together']
    );
  }

  // 5. Handle Greetings
  if (/^(hello|hi|hey|good\s+morning|good\s+afternoon|good\s+evening|namaste)\b/i.test(lower)) {
    return formatReply(
      `Hello ${namePrefix}! It is so wonderful to talk with you. How are you doing today?`,
      ['Wonderful', 'Greet']
    );
  }

  if (/^(bye|goodbye|see\s+you|good\s+night)\b/i.test(lower)) {
    return formatReply(
      `Goodbye ${namePrefix}! You spoke so well today. Have a lovely time and practice again tomorrow!`,
      ['Lovely', 'Tomorrow']
    );
  }

  if (/^(thank\s+you|thanks)\b/i.test(lower)) {
    return formatReply(
      `You are most welcome, ${namePrefix}! Speaking English with you is a joy. What would you like to talk about next?`,
      ['Welcome', 'Joy']
    );
  }

  // 6. Handle Student Self-Introduction ("My name is...", "I am [Name]") ONLY when introducing!
  if (newName) {
    return formatReply(
      `Hello ${newName}! It is so wonderful to meet you. Tell me, which class do you study in, or what is your favorite game to play?`,
      ['Wonderful', 'Introduce']
    );
  }

  // If user enters just a single capitalized word when asked for name
  if (/^[A-Z][a-z]{2,15}$/.test(raw) && !state.studentName && !NON_NAME_WORDS.has(raw.toLowerCase())) {
    state.studentName = raw;
    return formatReply(
      `Hello ${raw}! Nice to meet you. Which class do you study in, ${raw}?`,
      ['Introduce', 'Class']
    );
  }

  // 7. Handle Class / Grade / Age
  const classMatch = lower.match(/(?:class|standard|grade)\s+([0-9a-z]+)/i);
  if (classMatch) {
    const cls = classMatch[1];
    return formatReply(
      `Class ${cls} is awesome, ${namePrefix}! What is your favorite subject in class ${cls}?`,
      ['Subject', 'Awesome']
    );
  }

  const ageMatch = lower.match(/([0-9]+)\s+years?\s+old/i);
  if (ageMatch) {
    const age = ageMatch[1];
    return formatReply(
      `${age} years old is a great age to practice English! What games do you enjoy playing the most?`,
      ['Enjoy', 'Practice']
    );
  }

  // 8. Handle School, Teachers & Studies
  if (/\b(school|teacher|sir|madam|homework|study|studying|exam|test|book|books)\b/i.test(lower)) {
    if (/\b(homework)\b/i.test(lower)) {
      return formatReply(
        `Great job focusing on your homework! Which subject are you studying right now, ${namePrefix}?`,
        ['Focusing', 'Subject']
      );
    }
    if (/\b(teacher|sir|madam)\b/i.test(lower)) {
      return formatReply(
        `Teachers are wonderful mentors! What is your favorite teacher's name, and what subject do they teach?`,
        ['Mentors', 'Favorite']
      );
    }
    if (/\b(exam|test)\b/i.test(lower)) {
      return formatReply(
        `All the best for your exams, ${namePrefix}! Keep practicing and you will do wonderfully. Are you prepared?`,
        ['Prepared', 'Wonderfully']
      );
    }
    return formatReply(
      `School is a great place to learn and make friends! What is the name of your school?`,
      ['School', 'Friends']
    );
  }

  // 9. Handle School Subjects
  if (/\b(math|maths|mathematics|science|english|hindi|drawing|art|social|history|geography)\b/i.test(lower)) {
    const subjMatch = lower.match(/\b(math|maths|mathematics|science|english|hindi|drawing|art|social|history|geography)\b/i)![0];
    const subj = subjMatch.charAt(0).toUpperCase() + subjMatch.slice(1);
    return formatReply(
      `${subj} is such an interesting subject! What do you like most about ${subj}, ${namePrefix}?`,
      ['Interesting', 'Subject']
    );
  }

  // 10. Handle Family Members
  if (/\b(mother|mom|mummy|father|dad|papa|brother|sister|grandfather|grandmother|dada|dadi|nana|nani|parents|family)\b/i.test(lower)) {
    if (/\b(mother|mom|mummy)\b/i.test(lower)) {
      return formatReply(
        `Mothers are so loving and kind! What delicious food does your mother cook for you?`,
        ['Loving', 'Delicious']
      );
    }
    if (/\b(father|dad|papa)\b/i.test(lower)) {
      return formatReply(
        `Fathers are our biggest heroes! What fun games or activities do you enjoy doing with your father?`,
        ['Heroes', 'Activities']
      );
    }
    if (/\b(brother|sister|siblings)\b/i.test(lower)) {
      return formatReply(
        `Having a sibling is so much fun! What is your brother or sister's name, and do you play together?`,
        ['Sibling', 'Together']
      );
    }
    if (/\b(grandfather|grandmother|dada|dadi|nana|nani)\b/i.test(lower)) {
      return formatReply(
        `Grandparents tell the sweetest stories! What bedtime story do you love listening to from them?`,
        ['Sweetest', 'Listening']
      );
    }
    return formatReply(
      `Family is the greatest treasure! How many members are there in your family, ${namePrefix}?`,
      ['Treasure', 'Members']
    );
  }

  // 11. Handle Friends
  if (/\b(friend|friends|best\s+friend)\b/i.test(lower)) {
    return formatReply(
      `Friends make life so cheerful! What is your best friend's name, and what games do you play together?`,
      ['Cheerful', 'Together']
    );
  }

  // 12. Handle Toys, Dolls & Sports
  if (/\b(doll|barbie|teddy|bear)\b/i.test(lower)) {
    return formatReply(
      `Dolls and teddies are so sweet! What is your doll's name, and what color dress does she wear?`,
      ['Sweet', 'Color']
    );
  }

  if (/\b(cricket|football|soccer|badminton|tennis|chess|carrom|ludo|hide\s+and\s+seek|cycling|cycle)\b/i.test(lower)) {
    const sportMatch = lower.match(/\b(cricket|football|soccer|badminton|tennis|chess|carrom|ludo|hide\s+and\s+seek|cycling|cycle)\b/i)![0];
    const sport = sportMatch.charAt(0).toUpperCase() + sportMatch.slice(1);
    return formatReply(
      `${sport} is such an exciting sport! Who do you usually play ${sport} with, ${namePrefix}?`,
      ['Exciting', 'Usually']
    );
  }

  // 13. Handle Hobbies (Drawing, Singing, Dancing, Reading, Cartoons)
  if (/\b(draw|drawing|paint|painting|color|coloring|sketch)\b/i.test(lower)) {
    return formatReply(
      `Drawing and painting are so creative! What picture did you draw, and what colors did you use?`,
      ['Creative', 'Colors']
    );
  }

  if (/\b(dance|dancing|sing|singing|song|music)\b/i.test(lower)) {
    return formatReply(
      `Music and dancing bring so much joy! What is your favorite song to dance or sing along to?`,
      ['Joy', 'Favorite']
    );
  }

  if (/\b(cartoon|cartoons|tv|movie|doraemon|shinchan|chhota\s+bheem|anime)\b/i.test(lower)) {
    return formatReply(
      `Cartoons are so much fun to watch! Who is your absolute favorite cartoon character?`,
      ['Absolute', 'Character']
    );
  }

  // 14. Handle Food & Drinks
  if (/\b(eat|ate|eating|food|pizza|burger|ice\s*cream|chocolate|mango|apple|banana|orange|cake|maggi|noodles|rice|roti|dal|paneer|sweet|sweets|milk)\b/i.test(lower)) {
    const foodMatch = lower.match(/\b(pizza|burger|ice\s*cream|chocolate|mango|apple|banana|orange|cake|maggi|noodles|rice|roti|dal|paneer|sweet|sweets|milk|food)\b/i);
    const food = foodMatch ? foodMatch[0] : 'food';
    return formatReply(
      `Mmm, ${food} is so delicious! Did you enjoy eating it today, ${namePrefix}?`,
      ['Delicious', 'Enjoy']
    );
  }

  // 15. Handle Animals & Pets
  if (/\b(dog|puppy|cat|kitten|rabbit|parrot|bird|fish|lion|tiger|elephant|cow|horse|monkey|peacock|animal|pet)\b/i.test(lower)) {
    const animalMatch = lower.match(/\b(dog|puppy|cat|kitten|rabbit|parrot|bird|fish|lion|tiger|elephant|cow|horse|monkey|peacock|animal|pet)\b/i)![0];
    const animal = animalMatch.charAt(0).toUpperCase() + animalMatch.slice(1);
    return formatReply(
      `${animal} is such a wonderful creature! Do you have a pet at home, or do you like visiting the zoo?`,
      ['Creature', 'Visiting']
    );
  }

  // 16. Handle Colors
  if (/\b(red|blue|green|yellow|pink|purple|orange|black|white|color|colors)\b/i.test(lower)) {
    const colorMatch = lower.match(/\b(red|blue|green|yellow|pink|purple|orange|black|white)\b/i);
    if (colorMatch) {
      const color = colorMatch[0].charAt(0).toUpperCase() + colorMatch[0].slice(1);
      return formatReply(
        `${color} is a bright and beautiful color! What things around you are ${color}?`,
        ['Bright', 'Beautiful']
      );
    }
  }

  // 17. Handle Places (Park, Market, Mall, Garden, Zoo)
  if (/\b(went|go|going|visited|visit|market|park|zoo|garden|mall|playground)\b/i.test(lower)) {
    const placeMatch = lower.match(/\b(market|park|zoo|garden|mall|playground)\b/i);
    const place = placeMatch ? placeMatch[0] : 'there';
    return formatReply(
      `Going to the ${place} is always exciting! What was the most interesting thing you saw there, ${namePrefix}?`,
      ['Exciting', 'Interesting']
    );
  }

  // 18. Handle Feelings & State of Being
  if (/\b(fine|good|great|happy|sad|tired|hungry|sleepy|bored|sick)\b/i.test(lower)) {
    const feelMatch = lower.match(/\b(fine|good|great|happy|sad|tired|hungry|sleepy|bored|sick)\b/i)![0];
    if (feelMatch === 'fine' || feelMatch === 'good' || feelMatch === 'great' || feelMatch === 'happy') {
      return formatReply(
        `I am glad to hear you are feeling ${feelMatch}, ${namePrefix}! What made you feel so cheerful today?`,
        ['Cheerful', 'Glad']
      );
    }
    return formatReply(
      `I understand you are feeling ${feelMatch}. Take a deep breath and relax! Would you like to chat about something fun?`,
      ['Understand', 'Relax']
    );
  }

  // 19. Handle Student's Favorites ("I like / I love / My favorite ...")
  if (/\b(like|love|enjoy|favorite|favourite)\b/i.test(lower)) {
    const likedMatch = lower.match(/(?:like|love|enjoy|favorite\s+is|favourite\s+is)\s+([a-z\s]+)/i);
    const item = likedMatch ? likedMatch[1].replace(/to\s+/, '').trim().split(/\s+/).slice(0, 3).join(' ') : 'that';
    return formatReply(
      `That is wonderful! Why do you like ${item} so much, ${namePrefix}?`,
      ['Wonderful', 'Reason']
    );
  }

  // 20. Handle Yes / No / Okay
  if (/^(yes|yeah|yep|sure|ok|okay)\b/i.test(lower)) {
    return formatReply(
      `Great! Tell me in a complete sentence: what is one thing you love doing every day?`,
      ['Complete', 'Sentence']
    );
  }

  if (/^(no|nope|not)\b/i.test(lower)) {
    return formatReply(
      `That's completely fine! What would you prefer to practice instead: your school, your family, or your favorite toys?`,
      ['Prefer', 'Instead']
    );
  }

  // 21. Contextual Echo for ANY general sentence spoken by the student!
  // Find key action or topic words from their exact sentence
  const words = raw.split(/\s+/).filter(w => w.length >= 3 && !/^(the|and|for|are|but|not|you|all|any|can|had|her|was|one|our|out|day|get|has|him|his|how|man|new|now|old|see|two|way|who|boy|did|its|let|put|say|she|too|use)\b/i.test(w));
  const focus = words.length > 0 ? words[words.length - 1].replace(/[^a-zA-Z]/g, '') : '';

  if (focus && focus.length >= 3) {
    return formatReply(
      `I heard you say: "${raw}". It's so nice that you spoke about ${focus}! Can you tell me one more sentence about it?`,
      ['Sentence', 'Effort']
    );
  }

  return formatReply(
    `I heard you say: "${raw}". Very good effort! Tell me ${namePrefix}, what else would you like to practice today?`,
    ['Effort', 'Practice']
  );
}
