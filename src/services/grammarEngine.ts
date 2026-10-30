import type { Correction } from '../types';

interface GrammarRule {
  pattern: RegExp;
  fix: (match: RegExpExecArray, fullText: string) => { original: string; corrected: string };
  explanation_en: string | ((match: RegExpExecArray) => string);
  explanation_hi: string | ((match: RegExpExecArray) => string);
}

export const GRAMMAR_RULES: GrammarRule[] = [
  // 1. Myself [Name] intro
  {
    pattern: /\bmyself\s+([A-Za-z]+)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `My name is ${m[1]} / I am ${m[1]}`,
    }),
    explanation_en: "Do not use 'Myself' for introductions. Say 'My name is...' or 'I am...'.",
    explanation_hi: "अपना परिचय देते समय 'Myself' नहीं, 'My name is...' या 'I am...' बोलना चाहिए।",
  },

  // 2. I has -> I have
  {
    pattern: /\bi\s+has\b/i,
    fix: () => ({
      original: 'I has',
      corrected: 'I have',
    }),
    explanation_en: "Always use 'have' with 'I'. Use 'has' with he/she/it.",
    explanation_hi: "'I' के साथ हमेशा 'have' लगता है, 'has' केवल he/she/it के साथ लगता है।",
  },

  // 3. He/She/It have -> He/She/It has
  {
    pattern: /\b(he|she|it)\s+have\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} has`,
    }),
    explanation_en: (m) => `Use 'has' with singular subjects like '${m[1]}'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'has' का प्रयोग होता है, 'have' का नहीं।`,
  },

  // 4. We/They/You has -> have
  {
    pattern: /\b(we|they|you)\s+has\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} have`,
    }),
    explanation_en: "Use 'have' with plural subjects and 'you'.",
    explanation_hi: "'we', 'they', और 'you' के साथ 'have' का प्रयोग होता है।",
  },

  // 5. I is -> I am
  {
    pattern: /\bi\s+is\b/i,
    fix: () => ({
      original: 'I is',
      corrected: 'I am',
    }),
    explanation_en: "Always say 'I am', never 'I is'.",
    explanation_hi: "'I' के साथ हमेशा 'am' का प्रयोग होता है, 'is' का नहीं।",
  },

  // 6. You is -> You are
  {
    pattern: /\byou\s+is\b/i,
    fix: () => ({
      original: 'you is',
      corrected: 'you are',
    }),
    explanation_en: "Always use 'are' with 'you'.",
    explanation_hi: "'You' के साथ हमेशा 'are' लगता है।",
  },

  // 7. We/They is -> We/They are
  {
    pattern: /\b(we|they)\s+is\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} are`,
    }),
    explanation_en: (m) => `Use 'are' with plural subjects like '${m[1]}'.`,
    explanation_hi: (m) => `'${m[1]}' बहुवचन है, इसलिए इसके साथ 'are' का प्रयोग करें।`,
  },

  // 8. He/She are -> He/She is
  {
    pattern: /\b(he|she)\s+are\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} is`,
    }),
    explanation_en: (m) => `Use 'is' with singular subjects like '${m[1]}'.`,
    explanation_hi: (m) => `'${m[1]}' एकवचन है, इसलिए इसके साथ 'is' लगता है।`,
  },

  // 9. He go / She go -> He goes / She goes
  {
    pattern: /\b(he|she)\s+go\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} goes`,
    }),
    explanation_en: (m) => `Add '-es' to the verb with '${m[1]}' in simple present: '${m[1]} goes'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ क्रिया में 's/es' जुड़ता है: '${m[1]} goes'।`,
  },

  // 10. He play / She play -> plays
  {
    pattern: /\b(he|she)\s+play\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} plays`,
    }),
    explanation_en: (m) => `Add '-s' to verbs for singular subjects: '${m[1]} plays'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ क्रिया में 's' जोड़ें: '${m[1]} plays'।`,
  },

  // 11. He eat / She eat -> eats
  {
    pattern: /\b(he|she)\s+eat\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} eats`,
    }),
    explanation_en: (m) => `Say '${m[1]} eats' instead of '${m[1]} eat'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'eats' बोलना चाहिए।`,
  },

  // 12. He like / She like -> likes
  {
    pattern: /\b(he|she)\s+like\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} likes`,
    }),
    explanation_en: (m) => `Say '${m[1]} likes' with an 's'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'likes' बोलें।`,
  },

  // 13. He want / She want -> wants
  {
    pattern: /\b(he|she)\s+want\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} wants`,
    }),
    explanation_en: (m) => `Say '${m[1]} wants'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'wants' बोलें।`,
  },

  // 14. Did went -> did go
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+went\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} go`,
    }),
    explanation_en: "Always use the first form of the verb (go) after 'did'.",
    explanation_hi: "'Did' के साथ हमेशा क्रिया की पहली फॉर्म (go) आती है, went नहीं।",
  },

  // 15. Did saw -> did see
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+saw\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} see`,
    }),
    explanation_en: "Use 'see' after 'did', not 'saw'.",
    explanation_hi: "'Did' के साथ 'saw' नहीं, पहली फॉर्म 'see' आती है।",
  },

  // 16. Did came -> did come
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+came\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} come`,
    }),
    explanation_en: "Use 'come' after 'did'.",
    explanation_hi: "'Did' के बाद हमेशा पहली फॉर्म 'come' आती है।",
  },

  // 17. Did ate -> did eat
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+ate\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} eat`,
    }),
    explanation_en: "Use 'eat' after 'did', not 'ate'.",
    explanation_hi: "'Did' के साथ 'eat' बोला जाता है।",
  },

  // 18. Yesterday I go -> Yesterday I went
  {
    pattern: /\byesterday\s+i\s+go\b/i,
    fix: () => ({
      original: 'yesterday I go',
      corrected: 'yesterday I went',
    }),
    explanation_en: "When talking about the past ('yesterday'), use past tense 'went'.",
    explanation_hi: "बीते कल (yesterday) की बात बताने के लिए 'went' का प्रयोग करें।",
  },

  // 19. Yesterday I eat -> Yesterday I ate
  {
    pattern: /\byesterday\s+i\s+eat\b/i,
    fix: () => ({
      original: 'yesterday I eat',
      corrected: 'yesterday I ate',
    }),
    explanation_en: "For past actions, use 'ate' instead of 'eat'.",
    explanation_hi: "बीते कल के लिए 'ate' का प्रयोग करें।",
  },

  // 20. Yesterday I play -> Yesterday I played
  {
    pattern: /\byesterday\s+i\s+play\b/i,
    fix: () => ({
      original: 'yesterday I play',
      corrected: 'yesterday I played',
    }),
    explanation_en: "Say 'yesterday I played'.",
    explanation_hi: "बीते कल के लिए 'played' बोलें।",
  },

  // 21. I am agree -> I agree
  {
    pattern: /\bi\s+am\s+agree\b/i,
    fix: () => ({
      original: 'I am agree',
      corrected: 'I agree',
    }),
    explanation_en: "'Agree' is already a verb, do not say 'am agree'.",
    explanation_hi: "'Agree' खुद एक क्रिया है, इसके आगे 'am' मत लगाइए।",
  },

  // 22. I am disagree -> I disagree
  {
    pattern: /\bi\s+am\s+disagree\b/i,
    fix: () => ({
      original: 'I am disagree',
      corrected: 'I disagree',
    }),
    explanation_en: "Say 'I disagree' instead of 'I am disagree'.",
    explanation_hi: "'I am disagree' नहीं, सीधा 'I disagree' बोलें।",
  },

  // 23. Cousin brother / sister -> cousin
  {
    pattern: /\bcousin\s+(brother|sister)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: 'cousin',
    }),
    explanation_en: "In English, simply say 'cousin' without brother/sister.",
    explanation_hi: "अंग्रेज़ी में सिर्फ 'cousin' बोला जाता है, brother या sister नहीं जोड़ते।",
  },

  // 24. Open the light / fan -> turn on
  {
    pattern: /\bopen\s+the\s+(light|fan|ac|tv|computer)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `turn on the ${m[1]}`,
    }),
    explanation_en: (m) => `For electronic appliances, say 'turn on the ${m[1]}'.`,
    explanation_hi: (m) => `बिजली के उपकरण चालू करने के लिए 'turn on the ${m[1]}' कहते हैं।`,
  },

  // 25. Close the light / fan -> turn off
  {
    pattern: /\bclose\s+the\s+(light|fan|ac|tv|computer)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `turn off the ${m[1]}`,
    }),
    explanation_en: (m) => `For appliances, say 'turn off the ${m[1]}'.`,
    explanation_hi: (m) => `बिजली के उपकरण बंद करने के लिए 'turn off the ${m[1]}' कहते हैं।`,
  },

  // 26. Good in English / Maths -> good at
  {
    pattern: /\bgood\s+in\s+([A-Za-z]+)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `good at ${m[1]}`,
    }),
    explanation_en: "Use 'good at' for skills and subjects, not 'good in'.",
    explanation_hi: "किसी विषय या हुनर में अच्छे होने के लिए 'good at' बोला जाता है।",
  },

  // 27. Married with -> married to
  {
    pattern: /\bmarried\s+with\b/i,
    fix: () => ({
      original: 'married with',
      corrected: 'married to',
    }),
    explanation_en: "Say 'married to', not 'married with'.",
    explanation_hi: "विवाहित होने के संदर्भ में 'married to' बोला जाता है।",
  },

  // 28. One of my friend -> one of my friends
  {
    pattern: /\bone\s+of\s+my\s+friend\b/i,
    fix: () => ({
      original: 'one of my friend',
      corrected: 'one of my friends',
    }),
    explanation_en: "Say 'one of my friends' (plural) because you are choosing from many.",
    explanation_hi: "कई दोस्तों में से एक की बात हो रही है, इसलिए 'friends' (बहुवचन) आएगा।",
  },

  // 29. Two years back -> two years ago
  {
    pattern: /\b([0-9]+|two|three|four|five)\s+years\s+back\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} years ago`,
    }),
    explanation_en: "Say 'years ago' instead of 'years back'.",
    explanation_hi: "समय बीतने की बात में 'years back' की जगह 'years ago' कहें।",
  },

  // 30. Revert back -> revert / reply
  {
    pattern: /\brevert\s+back\b/i,
    fix: () => ({
      original: 'revert back',
      corrected: 'revert / reply',
    }),
    explanation_en: "'Revert' already means reply, so do not add 'back'.",
    explanation_hi: "'Revert' का अर्थ ही जवाब देना होता है, इसके साथ 'back' न लगाएं।",
  },

  // 31. I am knowing -> I know
  {
    pattern: /\bi\s+am\s+knowing\b/i,
    fix: () => ({
      original: 'I am knowing',
      corrected: 'I know',
    }),
    explanation_en: "'Know' is a state verb, say 'I know' instead of 'I am knowing'.",
    explanation_hi: "'Know' के साथ '-ing' नहीं लगता, सीधा 'I know' बोलें।",
  },

  // 32. I am eat -> I am eating
  {
    pattern: /\bi\s+am\s+(eat|play|read|sleep|walk|run)\b/i,
    fix: (m) => {
      const verb = m[1].toLowerCase();
      const ing = verb === 'run' ? 'running' : `${verb}ing`;
      return {
        original: m[0],
        corrected: `I am ${ing} / I ${verb}`,
      };
    },
    explanation_en: "After 'am', use '-ing' form (I am eating) or say simple present (I eat).",
    explanation_hi: "'am' के बाद क्रिया में '-ing' लगाएं (जैसे: I am eating)।",
  },

  // 33. He do not / She do not -> does not
  {
    pattern: /\b(he|she|it)\s+do\s+not\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} does not`,
    }),
    explanation_en: (m) => `Use 'does not' with singular subjects like '${m[1]}'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'do not' नहीं, 'does not' का प्रयोग होता है।`,
  },

  // 34. Me and my friend went -> My friend and I went
  {
    pattern: /\bme\s+and\s+(my\s+friend|him|her)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} and I`,
    }),
    explanation_en: "Put the other person first and use 'I' as subject: 'My friend and I'.",
    explanation_hi: "सब्जेक्ट के रूप में दूसरे व्यक्ति को पहले रखें और 'I' का प्रयोग करें।",
  },

  // 35. What is your good name -> What is your name
  {
    pattern: /\bwhat\s+is\s+your\s+good\s+name\b/i,
    fix: () => ({
      original: 'what is your good name',
      corrected: 'what is your name',
    }),
    explanation_en: "In English, simply say 'What is your name?'.",
    explanation_hi: "अंग्रेज़ी में 'शुभ नाम' के लिए 'good name' नहीं, सिर्फ 'What is your name?' कहते हैं।",
  },
];

/**
 * Checks text against all grammar rules and returns the first clear correction.
 */
export function checkGrammar(text: string): Correction | null {
  for (const rule of GRAMMAR_RULES) {
    const match = rule.pattern.exec(text);
    if (match) {
      const { original, corrected } = rule.fix(match, text);
      const explanation_en =
        typeof rule.explanation_en === 'function'
          ? rule.explanation_en(match)
          : rule.explanation_en;
      const explanation_hi =
        typeof rule.explanation_hi === 'function'
          ? rule.explanation_hi(match)
          : rule.explanation_hi;

      return {
        original,
        corrected,
        explanation_en,
        explanation_hi,
      };
    }
  }
  return null;
}
