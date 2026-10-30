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
    explanation_hi: "परिचय देते समय 'Myself' नहीं, 'My name is...' या 'I am...' बोलें।",
  },

  // 2. I has -> I have
  {
    pattern: /\bi\s+has\b/i,
    fix: () => ({
      original: 'I has',
      corrected: 'I have',
    }),
    explanation_en: "Always use 'have' with 'I'. Use 'has' with he/she/it.",
    explanation_hi: "'I' के साथ हमेशा 'have' लगता है, 'has' नहीं।",
  },

  // 3. He/She/It have -> He/She/It has
  {
    pattern: /\b(he|she|it|my\s+friend|my\s+brother|my\s+sister|my\s+mother|my\s+father|the\s+teacher|the\s+boy|the\s+girl)\s+have\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} has`,
    }),
    explanation_en: (m) => `Use 'has' with singular subjects like '${m[1]}'.`,
    explanation_hi: (m) => `'${m[1]}' एकवचन है, इसलिए 'has' लगेगा, 'have' नहीं।`,
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
    explanation_hi: "'I' के साथ हमेशा 'am' आता है, 'is' नहीं।",
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
    explanation_hi: (m) => `'${m[1]}' बहुवचन है, इसलिए 'are' का प्रयोग करें।`,
  },

  // 8. He/She are -> He/She is
  {
    pattern: /\b(he|she)\s+are\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} is`,
    }),
    explanation_en: (m) => `Use 'is' with singular subjects like '${m[1]}'.`,
    explanation_hi: (m) => `'${m[1]}' एकवचन है, इसलिए 'is' लगता है।`,
  },

  // 9. He/She don't -> doesn't
  {
    pattern: /\b(he|she|it|my\s+brother|my\s+sister)\s+(?:don't|do\s+not)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} doesn't`,
    }),
    explanation_en: (m) => `Say '${m[1]} doesn't' (does not) instead of don't.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'doesn't' (does not) आता है, 'don't' नहीं।`,
  },

  // 10. He go / She go -> He goes / She goes
  {
    pattern: /\b(he|she|my\s+father|my\s+mother|my\s+brother|my\s+sister)\s+go\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} goes`,
    }),
    explanation_en: (m) => `Add '-es' to the verb: '${m[1]} goes'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ क्रिया में 'es' जुड़ेगा: '${m[1]} goes'।`,
  },

  // 11. He play / She play -> plays
  {
    pattern: /\b(he|she|my\s+brother|my\s+sister|the\s+boy|the\s+girl)\s+play\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} plays`,
    }),
    explanation_en: (m) => `Add '-s' for singular subjects: '${m[1]} plays'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ क्रिया में 's' जोड़ें: '${m[1]} plays'।`,
  },

  // 12. He/She eat -> eats
  {
    pattern: /\b(he|she|my\s+brother|my\s+sister)\s+eat\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} eats`,
    }),
    explanation_en: (m) => `Say '${m[1]} eats' with an 's'.`,
    explanation_hi: (m) => `'${m[1]}' के साथ 'eats' बोलें।`,
  },

  // 13. My father work / My mother cook
  {
    pattern: /\b(my\s+father|my\s+mother|my\s+brother|my\s+sister)\s+(work|cook|teach|read)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} ${m[2]}s`,
    }),
    explanation_en: (m) => `Add '-s' to '${m[2]}': '${m[1]} ${m[2]}s'.`,
    explanation_hi: (m) => `'${m[1]}' एकवचन है, इसलिए '${m[2]}s' होगा।`,
  },

  // 14. I like play -> I like to play / I like playing
  {
    pattern: /\bi\s+like\s+(play|eat|dance|sing|read|draw|cook)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `I like to ${m[1]} / I like ${m[1]}ing`,
    }),
    explanation_en: (m) => `Say 'I like to ${m[1]}' or 'I like ${m[1]}ing'.`,
    explanation_hi: (m) => `'I like' के बाद 'to ${m[1]}' या '${m[1]}ing' बोलें।`,
  },

  // 15. I want play -> I want to play
  {
    pattern: /\bi\s+want\s+(play|eat|go|sleep|read|buy|watch)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `I want to ${m[1]}`,
    }),
    explanation_en: (m) => `Add 'to' after want: 'I want to ${m[1]}'.`,
    explanation_hi: (m) => `'want' के बाद 'to' जोड़ें: 'I want to ${m[1]}'।`,
  },

  // 16. I am go / I am eat -> I am going / I am eating
  {
    pattern: /\bi\s+am\s+(go|eat|play|read|sleep|walk|run|watch|study)\b/i,
    fix: (m) => {
      const verb = m[1].toLowerCase();
      const ing = verb === 'run' ? 'running' : `${verb}ing`;
      return {
        original: m[0],
        corrected: `I am ${ing} / I ${verb}`,
      };
    },
    explanation_en: "Use '-ing' with 'am' for current actions: 'I am going'.",
    explanation_hi: "'am' के साथ क्रिया में '-ing' लगाएं (जैसे: 'I am going')।",
  },

  // 17. She is go / He is eat -> She is going
  {
    pattern: /\b(he|she)\s+is\s+(go|eat|play|read|sleep|come)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} is ${m[2]}ing`,
    }),
    explanation_en: (m) => `Use '-ing' after 'is': '${m[1]} is ${m[2]}ing'.`,
    explanation_hi: "'is' के बाद क्रिया में '-ing' जोड़ें।",
  },

  // 18. Did went -> did go
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+went\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} go`,
    }),
    explanation_en: "Always use base verb 'go' after 'did'.",
    explanation_hi: "'Did' के साथ हमेशा पहली फॉर्म 'go' आती है, 'went' नहीं।",
  },

  // 19. Did saw -> did see
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+saw\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} see`,
    }),
    explanation_en: "Use 'see' after 'did', not 'saw'.",
    explanation_hi: "'Did' के बाद पहली फॉर्म 'see' आती है।",
  },

  // 20. Did ate -> did eat
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+ate\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} eat`,
    }),
    explanation_en: "Use 'eat' after 'did', not 'ate'.",
    explanation_hi: "'Did' के साथ पहली फॉर्म 'eat' आती है।",
  },

  // 21. Did came -> did come
  {
    pattern: /\b(did(?:\s+not|\s+n't)?)\s+came\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} come`,
    }),
    explanation_en: "Use 'come' after 'did', not 'came'.",
    explanation_hi: "'Did' के बाद 'come' आता है।",
  },

  // 22. Yesterday I go -> Yesterday I went
  {
    pattern: /\byesterday\s+i\s+go\b/i,
    fix: () => ({
      original: 'yesterday I go',
      corrected: 'yesterday I went',
    }),
    explanation_en: "Use past tense 'went' with yesterday.",
    explanation_hi: "बीते कल (yesterday) के लिए 'went' का प्रयोग करें।",
  },

  // 23. Yesterday I eat -> Yesterday I ate
  {
    pattern: /\byesterday\s+i\s+eat\b/i,
    fix: () => ({
      original: 'yesterday I eat',
      corrected: 'yesterday I ate',
    }),
    explanation_en: "Say 'yesterday I ate' (past tense).",
    explanation_hi: "बीते कल के लिए 'ate' (past tense) का प्रयोग करें।",
  },

  // 24. Yesterday I play -> Yesterday I played
  {
    pattern: /\byesterday\s+i\s+play\b/i,
    fix: () => ({
      original: 'yesterday I play',
      corrected: 'yesterday I played',
    }),
    explanation_en: "Say 'yesterday I played'.",
    explanation_hi: "बीते कल के लिए 'played' बोलें।",
  },

  // 25. I am agree -> I agree
  {
    pattern: /\bi\s+am\s+agree\b/i,
    fix: () => ({
      original: 'I am agree',
      corrected: 'I agree',
    }),
    explanation_en: "'Agree' is already a verb, do not add 'am'.",
    explanation_hi: "'Agree' खुद एक क्रिया है, इसके आगे 'am' मत लगाइए।",
  },

  // 26. Cousin brother / sister -> cousin
  {
    pattern: /\bcousin\s+(brother|sister)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: 'cousin',
    }),
    explanation_en: "Simply say 'cousin' in English.",
    explanation_hi: "अंग्रेज़ी में सिर्फ 'cousin' बोला जाता है।",
  },

  // 27. Open the light/fan -> turn on
  {
    pattern: /\bopen\s+the\s+(light|fan|ac|tv|computer)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `turn on the ${m[1]}`,
    }),
    explanation_en: (m) => `For electrical items, say 'turn on the ${m[1]}'.`,
    explanation_hi: (m) => `बिजली के उपकरण चालू करने के लिए 'turn on the ${m[1]}' कहें।`,
  },

  // 28. Close the light/fan -> turn off
  {
    pattern: /\bclose\s+the\s+(light|fan|ac|tv|computer)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `turn off the ${m[1]}`,
    }),
    explanation_en: (m) => `For electrical items, say 'turn off the ${m[1]}'.`,
    explanation_hi: (m) => `उपकरण बंद करने के लिए 'turn off the ${m[1]}' कहें।`,
  },

  // 29. Two brother / two sister (missing plural 's')
  {
    pattern: /\b(two|three|four|five|six|seven|eight|nine|ten|[0-9]+)\s+(brother|sister|friend|apple|cat|dog|book|car|boy|girl)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `${m[1]} ${m[2]}s`,
    }),
    explanation_en: (m) => `Use plural '${m[2]}s' for numbers greater than one.`,
    explanation_hi: (m) => `एक से अधिक संख्या होने पर बहुवचन '${m[2]}s' का प्रयोग करें।`,
  },

  // 30. Childrens -> children
  {
    pattern: /\bchildrens\b/i,
    fix: () => ({
      original: 'childrens',
      corrected: 'children',
    }),
    explanation_en: "'Children' is already plural of child. Do not add 's'.",
    explanation_hi: "'Children' खुद बहुवचन है, इसमें 's' नहीं लगाते।",
  },

  // 31. Good in English -> good at
  {
    pattern: /\bgood\s+in\s+([A-Za-z]+)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `good at ${m[1]}`,
    }),
    explanation_en: "Use 'good at' for subjects and sports.",
    explanation_hi: "किसी विषय या खेल में अच्छे होने के लिए 'good at' बोलें।",
  },

  // 32. I am knowing -> I know
  {
    pattern: /\bi\s+am\s+knowing\b/i,
    fix: () => ({
      original: 'I am knowing',
      corrected: 'I know',
    }),
    explanation_en: "Say 'I know' instead of 'I am knowing'.",
    explanation_hi: "'Know' के साथ '-ing' नहीं लगता, सीधा 'I know' बोलें।",
  },

  // 33. One of my friend -> one of my friends
  {
    pattern: /\bone\s+of\s+my\s+friend\b/i,
    fix: () => ({
      original: 'one of my friend',
      corrected: 'one of my friends',
    }),
    explanation_en: "Say 'one of my friends' (plural).",
    explanation_hi: "कई दोस्तों में से एक, इसलिए 'one of my friends' बोलें।",
  },

  // 34. Told to me -> told me
  {
    pattern: /\btold\s+to\s+(me|him|her|us|them)\b/i,
    fix: (m) => ({
      original: m[0],
      corrected: `told ${m[1]}`,
    }),
    explanation_en: (m) => `Do not use 'to' after told: 'told ${m[1]}'.`,
    explanation_hi: (m) => `'told' के बाद 'to' नहीं लगता: सीधा 'told ${m[1]}' बोलें।`,
  },

  // 35. What is your good name -> What is your name
  {
    pattern: /\bwhat\s+is\s+your\s+good\s+name\b/i,
    fix: () => ({
      original: 'what is your good name',
      corrected: 'what is your name',
    }),
    explanation_en: "In English, simply say 'What is your name?'.",
    explanation_hi: "अंग्रेज़ी में शुभ नाम के लिए सीधा 'What is your name?' बोलें।",
  },
];

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
