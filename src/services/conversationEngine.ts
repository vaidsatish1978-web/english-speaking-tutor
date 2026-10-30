import type { ChatMessage, Correction } from '../types';
import { checkGrammar } from './grammarEngine';

export type Topic =
  | 'sports_games'
  | 'toys_dolls'
  | 'school_studies'
  | 'school_subjects'
  | 'family'
  | 'friends'
  | 'food_drinks'
  | 'animals_pets'
  | 'drawing_hobbies'
  | 'feelings_daily'
  | 'general';

interface ConversationState {
  studentName: string | null;
  activeTopic: Topic | null;
  currentSubjectOrItem: string | null;
  topicTurn: number;
  lastQuestionAsked: string | null;
  turnCount: number;
}

const state: ConversationState = {
  studentName: null,
  activeTopic: null,
  currentSubjectOrItem: null,
  topicTurn: 0,
  lastQuestionAsked: null,
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
  const explicit = raw.match(/(?:my name is|mera naam|call me)\s+([A-Za-z\u0900-\u097F]+)/i);
  if (explicit) {
    const candidate = explicit[1].trim();
    if (!NON_NAME_WORDS.has(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  const iAmMatch = raw.match(/^(?:i am|i'm)\s+([A-Za-z]+)$/i);
  if (iAmMatch) {
    const candidate = iAmMatch[1].trim();
    if (!NON_NAME_WORDS.has(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  return null;
}

function detectDomain(lower: string): Topic | null {
  if (/\b(cricket|football|soccer|badminton|tennis|chess|carrom|ludo|hide\s+and\s+seek|cycling|cycle|batting|bowling|runs?|wicket|sixer|boundary)\b/i.test(lower)) {
    return 'sports_games';
  }
  if (/\b(doll|barbie|teddy|teddy\s*bear|toy|toys|robot|car\s+toy)\b/i.test(lower)) {
    return 'toys_dolls';
  }
  if (/\b(math|maths|mathematics|science|english|hindi|art|social|history|geography)\b/i.test(lower)) {
    return 'school_subjects';
  }
  if (/\b(school|class|grade|standard|homework|exam|test|teacher|sir|madam|study|studying|books?)\b/i.test(lower)) {
    return 'school_studies';
  }
  if (/\b(eat|ate|eating|food|pizza|burger|ice\s*cream|chocolate|mango|apple|banana|orange|cake|maggi|noodles|rice|roti|dal|paneer|sweet|sweets|milk|dinner|lunch|breakfast|tasty|delicious|spicy|dessert)\b/i.test(lower)) {
    return 'food_drinks';
  }
  if (/\b(dog|puppy|cat|kitten|rabbit|parrot|bird|fish|lion|tiger|elephant|cow|horse|monkey|peacock|animal|pet|zoo)\b/i.test(lower)) {
    return 'animals_pets';
  }
  if (/\b(draw|drawing|paint|painting|color|coloring|sketch|sketching|dance|dancing|sing|singing|song|cartoon|cartoons|tv|movie|doraemon|shinchan|chhota\s+bheem)\b/i.test(lower)) {
    return 'drawing_hobbies';
  }
  if (/\b(mother|mom|mummy|father|dad|papa|brother|sister|grandfather|grandmother|dada|dadi|nana|nani|parents|family|sibling)\b/i.test(lower)) {
    return 'family';
  }
  if (/\b(friend|friends|best\s+friend|classmate)\b/i.test(lower)) {
    return 'friends';
  }
  if (/\b(happy|sad|tired|hungry|sleepy|bored|sick|wake\s+up|woke\s+up|brush|bath)\b/i.test(lower)) {
    return 'feelings_daily';
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

  // 1. Check for grammatical mistakes
  const correction = checkGrammar(raw);

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

  // 2. Extract Name if introduced
  const newName = extractNameIntro(raw);
  if (newName) {
    state.studentName = newName;
  }
  const namePrefix = state.studentName ? `${state.studentName}` : 'friend';

  // 3. Detect Hindi / Hinglish (pure Hindi script or Indian phrases)
  const hasHindiScript = /[\u0900-\u097F]/.test(raw);
  const isHinglish = /\b(mera|meri|mujhe|hum|kya|kaise|kaha|kahan|kyun|sikhao|sikhna|padhna|khelna|accha|bahut|theek|nahi|hai|ho|hu|aaj|kal|pani|didi|bhaiya|sath|pasand)\b/i.test(lower);

  if (hasHindiScript || isHinglish) {
    if (/\b(naam|name)\b/i.test(lower) && state.studentName) {
      return {
        reply: `बहुत बढ़िया ${state.studentName}! इसे इंग्लिश में ऐसे बोलिए: "Hello! My name is ${state.studentName}." अब माइक दबाकर बोलिए!`,
        correction: null,
        new_words: ['Name', 'Introduction'],
      };
    }
    if (/\b(bhai|brother|sister|behan|dost|friend)\b/i.test(lower) && /\b(sath|khel|khelta)\b/i.test(lower)) {
      return {
        reply: `अरे वाह! इसे इंग्लिश में ऐसे कहिए: "I play with my brother." अब आप माइक दबाकर यही वाक्य बोलिए!`,
        correction: null,
        new_words: ['Play', 'Brother'],
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
    if (/\b(khelna|khelte|khel|pasand)\b/i.test(lower)) {
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
    return {
      reply: `अरे वाह! कोशिश कीजिए कि जो बात आपने अभी कही, उसे थोड़े से आसान इंग्लिश शब्दों में बोलें। जैसे माइक दबाकर बोलिए: "I am ready to speak!" अब बोलिए!`,
      correction: null,
      new_words: ['Ready', 'Speak'],
    };
  }

  // 4. Handle Direct Questions to Tutor
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
      `I am listening to your English and chatting with you! What are you doing right now, ${namePrefix}?`,
      ['Listening', 'Chatting']
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

  // 5. Name Introduction
  if (newName) {
    state.activeTopic = 'school_studies';
    state.topicTurn = 1;
    state.lastQuestionAsked = 'which_class';
    return formatReply(
      `Hello ${newName}! It is so wonderful to meet you. Tell me, which class do you study in, or what is your favorite game to play?`,
      ['Wonderful', 'Introduce']
    );
  }

  // 6. Handle Standalone Greetings
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

  // -------------------------------------------------------------
  // TOPIC CONTINUITY & SHIFT MANAGEMENT
  // -------------------------------------------------------------
  const shiftMatch = lower.match(/(?:let'?s\s+talk\s+about|talk\s+about|tell\s+me\s+about|ask\s+me\s+about|change\s+topic|shift\s+to|what\s+about)\s+([a-z\s]+)/i);
  let explicitShiftTarget: Topic | null = null;
  if (shiftMatch) {
    explicitShiftTarget = detectDomain(shiftMatch[1]);
  }

  const detectedTopic = detectDomain(lower);

  // Protected context: If the current topic is active, answers related to the topic must NOT cause an accidental shift!
  const isFoodContext =
    state.activeTopic === 'food_drinks' &&
    /\b(mother|mom|mummy|father|dad|she|he|made|cooked|cook|cooks|kitchen|outside|hotel|restaurant|sweet|spicy|taste|tasty|cheese|pizza|burger|eat|ate|eating|maggi|noodles|dessert)\b/i.test(lower);

  const isSportsContext =
    state.activeTopic === 'sports_games' &&
    /\b(brother|sister|friend|friends|father|dad|mom|park|ground|street|bat|batting|batter|bowl|bowling|ball|run|runs|six|four|wicket|match|play|playing|game)\b/i.test(lower);

  const isToyContext =
    state.activeTopic === 'toys_dolls' &&
    /\b(doll|teddy|toy|toys|pink|red|blue|dress|clothes|hair|bed|room|play|tea|party|corner)\b/i.test(lower);

  const isSchoolContext =
    (state.activeTopic === 'school_studies' || state.activeTopic === 'school_subjects') &&
    /\b(math|science|english|hindi|teacher|sir|madam|book|books|homework|friend|friends|class|grade|study|tiffin)\b/i.test(lower);

  const isDrawingContext =
    state.activeTopic === 'drawing_hobbies' &&
    /\b(draw|drawing|paint|color|colors|crayons|pens|sketch|mother|father|teacher|picture)\b/i.test(lower);

  const isProtectedContext =
    isFoodContext || isSportsContext || isToyContext || isSchoolContext || isDrawingContext;

  let isTopicShift = false;
  if (explicitShiftTarget && explicitShiftTarget !== state.activeTopic) {
    state.activeTopic = explicitShiftTarget;
    state.currentSubjectOrItem = null;
    state.topicTurn = 1;
    state.lastQuestionAsked = null;
    isTopicShift = true;
  } else if (detectedTopic && detectedTopic !== state.activeTopic && !isProtectedContext) {
    state.activeTopic = detectedTopic;
    state.currentSubjectOrItem = null;
    state.topicTurn = 1;
    state.lastQuestionAsked = null;
    isTopicShift = true;
  }

  // -------------------------------------------------------------
  // CONTINUOUS MULTI-TURN TOPIC STATE MACHINE
  // -------------------------------------------------------------

  // TOPIC A: SPORTS & CRICKET
  if (state.activeTopic === 'sports_games') {
    state.topicTurn++;

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'who_plays';
      const intro = isTopicShift ? "Ooh, sports and games! Let's talk about that. " : "";
      return formatReply(
        `${intro}Cricket and outdoor games are so exciting! Who do you usually play with, ${namePrefix}: your brother, sister, or friends?`,
        ['Exciting', 'Outdoor']
      );
    }

    if (state.lastQuestionAsked === 'who_plays') {
      const partnerMatch = lower.match(/\b(brother|sister|friend|friends|father|dad|cousin|alone|bhai|dost)\b/i);
      const partner = partnerMatch ? partnerMatch[0] : 'them';
      state.lastQuestionAsked = 'bat_or_bowl';
      return formatReply(
        `Playing with your ${partner} is so much fun! Do you like batting or bowling more when you play together?`,
        ['Batting', 'Bowling']
      );
    }

    if (state.lastQuestionAsked === 'bat_or_bowl') {
      const isBat = /\b(bat|batting|batter)\b/i.test(lower);
      state.lastQuestionAsked = 'hit_boundary';
      if (isBat) {
        return formatReply(
          `A true batter! Have you ever hit a big six or a four with your bat?`,
          ['Batter', 'Boundary']
        );
      }
      return formatReply(
        `Bowling fast is super thrilling! Have you ever bowled someone out and taken a wicket?`,
        ['Thrilling', 'Wicket']
      );
    }

    if (state.lastQuestionAsked === 'hit_boundary') {
      state.lastQuestionAsked = 'where_play';
      return formatReply(
        `That is awesome! What a great player you are! Where do you both usually play: in the park, street, or school ground?`,
        ['Player', 'Ground']
      );
    }

    if (state.lastQuestionAsked === 'where_play') {
      state.lastQuestionAsked = 'sports_wrap';
      return formatReply(
        `The ground and park are wonderful places for fresh air and sports! You are a sports champion, ${namePrefix}. Would you like to keep talking about games, or tell me about your school or favorite food?`,
        ['Champion', 'Fresh']
      );
    }
  }

  // TOPIC B: TOYS & DOLLS
  if (state.activeTopic === 'toys_dolls') {
    state.topicTurn++;

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'doll_name_dress';
      const intro = isTopicShift ? "Yay, dolls and toys! " : "";
      return formatReply(
        `${intro}Dolls and teddies are so sweet! What is your doll's name, and what color dress does she wear?`,
        ['Sweet', 'Dress']
      );
    }

    if (state.lastQuestionAsked === 'doll_name_dress') {
      const colorMatch = lower.match(/\b(pink|red|blue|yellow|white|green|purple)\b/i);
      const color = colorMatch ? `${colorMatch[0]} dress` : 'pretty outfit';
      state.lastQuestionAsked = 'doll_tea_party';
      return formatReply(
        `A ${color} looks so lovely on her! Does your doll have long hair, or do you have tea parties with her in your room?`,
        ['Lovely', 'Tea Party']
      );
    }

    if (state.lastQuestionAsked === 'doll_tea_party') {
      state.lastQuestionAsked = 'doll_sleep';
      return formatReply(
        `That sounds so charming! Where does your doll stay at night: on your bed or in a special toy corner?`,
        ['Charming', 'Corner']
      );
    }

    if (state.lastQuestionAsked === 'doll_sleep') {
      state.lastQuestionAsked = 'toy_wrap';
      return formatReply(
        `She must be your favorite companion! What other toys do you enjoy playing with, ${namePrefix}?`,
        ['Companion', 'Enjoy']
      );
    }
  }

  // TOPIC C: FOOD & DRINKS
  if (state.activeTopic === 'food_drinks') {
    state.topicTurn++;

    const foodMatch = lower.match(/\b(pizza|burger|ice\s*cream|chocolate|mango|apple|banana|orange|cake|maggi|noodles|rice|roti|dal|paneer|sweets?|milk)\b/i);
    if (foodMatch) {
      state.currentSubjectOrItem = foodMatch[0];
    }

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'who_made_food';
      const intro = isTopicShift ? "Ooh, food! Let's talk about delicious treats. " : "";
      const phrase = state.currentSubjectOrItem ? `${state.currentSubjectOrItem} is so tasty!` : "delicious food is wonderful!";
      return formatReply(
        `${intro}Mmm, ${phrase} Did your mother cook it for you today, or did you eat it outside?`,
        ['Delicious', 'Treats']
      );
    }

    // If student just named the specific food item now (e.g., "I love pizza")
    if (foodMatch && state.lastQuestionAsked === 'who_made_food' && !/\b(mother|mom|mummy|father|she|he|made|outside|hotel)\b/i.test(lower)) {
      state.lastQuestionAsked = 'who_made_food_item';
      return formatReply(
        `Yum, ${foodMatch[0]} is one of the tastiest foods ever! Did your mother make it at home, or did you eat it outside?`,
        ['Tastiest', 'Homemade']
      );
    }

    if (state.lastQuestionAsked === 'who_made_food' || state.lastQuestionAsked === 'who_made_food_item') {
      state.lastQuestionAsked = 'sweet_or_spicy';
      const foodRef = state.currentSubjectOrItem ? `${state.currentSubjectOrItem}` : 'meals';
      return formatReply(
        `Homemade ${foodRef} made by mother is always the tastiest and healthiest! Do you like sweet food or spicy food more, ${namePrefix}?`,
        ['Healthiest', 'Spicy']
      );
    }

    if (state.lastQuestionAsked === 'sweet_or_spicy') {
      state.lastQuestionAsked = 'favorite_dessert';
      return formatReply(
        `Spicy food is so flavorful! What is your absolute favorite dessert to have after food: ice cream, chocolate, or kheer?`,
        ['Dessert', 'Flavorful']
      );
    }

    if (state.lastQuestionAsked === 'favorite_dessert') {
      state.lastQuestionAsked = 'food_wrap';
      return formatReply(
        `Sweet desserts make everyone smile! What do you like to do after eating: relax, study, or play games?`,
        ['Smile', 'Relax']
      );
    }
  }

  // TOPIC D: SCHOOL & STUDIES & SUBJECTS
  if (state.activeTopic === 'school_studies' || state.activeTopic === 'school_subjects') {
    state.topicTurn++;

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'favorite_subject';
      const clsMatch = lower.match(/(?:class|standard|grade)\s+([0-9a-z]+)/i);
      const cls = clsMatch ? `Class ${clsMatch[1]}` : 'School';
      const intro = isTopicShift ? "Let's talk about school and learning! " : "";
      return formatReply(
        `${intro}${cls} is wonderful! What is your favorite subject in school, ${namePrefix}?`,
        ['Subject', 'Learning']
      );
    }

    if (state.lastQuestionAsked === 'favorite_subject') {
      const subjMatch = lower.match(/\b(math|maths|mathematics|science|english|hindi|drawing|art|social)\b/i);
      const subj = subjMatch ? subjMatch[0].charAt(0).toUpperCase() + subjMatch[0].slice(1) : 'that subject';
      state.currentSubjectOrItem = subj;
      state.lastQuestionAsked = 'subject_fun';
      return formatReply(
        `${subj} is such a great subject! What do you enjoy doing the most in ${subj}: solving problems, reading, or drawing?`,
        ['Problems', 'Enjoy']
      );
    }

    if (state.lastQuestionAsked === 'subject_fun') {
      state.lastQuestionAsked = 'school_friend';
      return formatReply(
        `That is so interesting! Having fun while studying makes you very smart. Who sits next to you in class, or who is your best school friend?`,
        ['Smart', 'Classmate']
      );
    }

    if (state.lastQuestionAsked === 'school_friend') {
      state.lastQuestionAsked = 'school_wrap';
      return formatReply(
        `Friends make school days unforgettable! What do you pack in your tiffin box to share with your friends?`,
        ['Unforgettable', 'Share']
      );
    }
  }

  // TOPIC E: ANIMALS & PETS
  if (state.activeTopic === 'animals_pets') {
    state.topicTurn++;

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'pet_name_tricks';
      const animalMatch = lower.match(/\b(dog|puppy|cat|kitten|rabbit|parrot|bird|fish|lion|tiger|elephant|animal|pet)\b/i);
      const animal = animalMatch ? animalMatch[0] : 'animals';
      const intro = isTopicShift ? "Animals are so fascinating! " : "";
      return formatReply(
        `${intro}Having love for ${animal} is so special! Do you have a pet at home, or what is your favorite animal?`,
        ['Fascinating', 'Special']
      );
    }

    if (state.lastQuestionAsked === 'pet_name_tricks') {
      state.lastQuestionAsked = 'animal_fun';
      return formatReply(
        `Animals are such loyal and fun companions! What playful things does your favorite animal do?`,
        ['Loyal', 'Companions']
      );
    }

    if (state.lastQuestionAsked === 'animal_fun') {
      state.lastQuestionAsked = 'zoo_visit';
      return formatReply(
        `That sounds so cute! Have you ever seen animals up close at a zoo or bird park?`,
        ['Close', 'Park']
      );
    }
  }

  // TOPIC F: DRAWING & HOBBIES
  if (state.activeTopic === 'drawing_hobbies') {
    state.topicTurn++;

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'drawing_details';
      const intro = isTopicShift ? "Creative hobbies are awesome! " : "";
      return formatReply(
        `${intro}Drawing and music bring so much happiness! What picture did you draw, and what colors did you use?`,
        ['Creative', 'Colors']
      );
    }

    if (state.lastQuestionAsked === 'drawing_details') {
      state.lastQuestionAsked = 'color_tools';
      return formatReply(
        `That sounds like a beautiful picture! Do you like coloring with crayons, sketch pens, or water colors?`,
        ['Beautiful', 'Crayons']
      );
    }

    if (state.lastQuestionAsked === 'color_tools') {
      state.lastQuestionAsked = 'show_drawing';
      return formatReply(
        `Crayons and colors make your art shine! Who did you show your drawing to: your mother, father, or teacher?`,
        ['Shine', 'Art']
      );
    }
  }

  // TOPIC G: FAMILY
  if (state.activeTopic === 'family') {
    state.topicTurn++;

    if (state.topicTurn === 1 || !state.lastQuestionAsked) {
      state.lastQuestionAsked = 'family_activity';
      return formatReply(
        `Family is our greatest treasure! What is your favorite thing to do with your family: go on picnics, watch movies, or eat dinner together?`,
        ['Treasure', 'Picnic']
      );
    }

    if (state.lastQuestionAsked === 'family_activity') {
      state.lastQuestionAsked = 'family_place';
      return formatReply(
        `Doing fun activities with family creates the best memories! What is your favorite place to visit together, ${namePrefix}?`,
        ['Memories', 'Visit']
      );
    }
  }

  // TOPIC H: FEELINGS & DAILY STATE
  if (state.activeTopic === 'feelings_daily') {
    const feelMatch = lower.match(/\b(fine|good|great|happy|sad|tired|hungry|sleepy|bored|sick)\b/i);
    const feel = feelMatch ? feelMatch[0] : 'good';
    if (feel === 'fine' || feel === 'good' || feel === 'great' || feel === 'happy') {
      return formatReply(
        `I am so glad you are feeling ${feel}, ${namePrefix}! What was the most fun thing that happened today?`,
        ['Glad', 'Cheerful']
      );
    }
    return formatReply(
      `Take good care of yourself! BolBuddy is here with you. Would you like to talk about cartoons, your favorite sports, or toys to cheer up?`,
      ['Care', 'Cheer']
    );
  }

  // Handle Yes / No / Okay
  if (/^(yes|yeah|yep|sure|ok|okay)\b/i.test(lower)) {
    return formatReply(
      `Great! Tell me one more detail in a complete sentence: what are you thinking right now, ${namePrefix}?`,
      ['Complete', 'Sentence']
    );
  }

  if (/^(no|nope|not)\b/i.test(lower)) {
    return formatReply(
      `That's totally fine! What would you like to talk about instead: sports, delicious food, school, or animals?`,
      ['Instead', 'Choice']
    );
  }

  // Fallback for ANY General Sentence
  const words = raw.split(/\s+/).filter(w => w.length >= 3 && !/^(the|and|for|are|but|not|you|all|any|can|had|her|was|one|our|out|day|get|has|him|his|how|man|new|now|old|see|two|way|who|boy|did|its|let|put|say|she|too|use)\b/i.test(w));
  const focus = words.length > 0 ? words[words.length - 1].replace(/[^a-zA-Z]/g, '') : '';

  if (focus && focus.length >= 3) {
    return formatReply(
      `I heard you say: "${raw}". It's so nice that you spoke about ${focus}! Can you tell me one more sentence about it?`,
      ['Sentence', 'Effort']
    );
  }

  return formatReply(
    `I heard you clearly: "${raw}". Very good effort! Tell me ${namePrefix}, what else would you like to practice today?`,
    ['Effort', 'Practice']
  );
}
