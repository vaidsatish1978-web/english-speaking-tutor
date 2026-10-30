import type { DailyTopic, RepeatSentence } from '../types';

export const DAILY_TOPICS: DailyTopic[] = [
  {
    id: 'topic-pets-animals',
    date: new Date().toISOString().split('T')[0],
    title: 'Favorite Animal or Pet',
    title_hi: 'मनपसंद जानवर या पालतू पशु',
    prompt: 'If you could have any pet in the world, which animal would you choose and why?',
    prompt_hi: 'यदि आप दुनिया में कोई भी पालतू जानवर रख सकते, तो कौन सा चुनते और क्यों?',
    starterSuggestions: [
      'I would love to have a little puppy because dogs are loyal and playful.',
      'My favorite animal is an elephant because they are gentle giants.',
      'I like cats because they are quiet and fluffy.'
    ]
  },
  {
    id: 'topic-festivals',
    date: '2026-10-31',
    title: 'Celebrations & Festivals',
    title_hi: 'त्योहार और खुशियाँ',
    prompt: 'Which festival do you celebrate with your family, and what special food do you eat?',
    prompt_hi: 'आप अपने परिवार के साथ कौन सा त्योहार मनाते हैं, और क्या खास खाना खाते हैं?',
    starterSuggestions: [
      'My favorite festival is Diwali because the whole house shines with lights.',
      'We eat delicious sweets and homemade snacks with our relatives.',
      'I love wearing new clothes and meeting my grandparents.'
    ]
  },
  {
    id: 'topic-superpowers',
    date: '2026-11-01',
    title: 'If You Had a Superpower',
    title_hi: 'अगर आपके पास कोई सुपरपावर होती',
    prompt: 'If you could fly in the sky or turn invisible, which superpower would you choose?',
    prompt_hi: 'अगर आप आसमान में उड़ सकते या गायब हो सकते, तो आप कौन सी जादुई शक्ति चुनते?',
    starterSuggestions: [
      'I would choose the power to fly so I could travel anywhere in minutes.',
      'I want the power to heal people and help everyone stay healthy.',
      'I would love to understand what animals are saying.'
    ]
  }
];

export const REPEAT_SENTENCES: RepeatSentence[] = [
  // Beginner (Little Learner)
  {
    id: 'rep-b1',
    level: 'beginner',
    sentence: 'The sky is blue and the sun is bright.',
    sentence_hi: 'आसमान नीला है और सूरज चमकदार है।',
    phoneticHint: 'The sk-eye is bloo and the sun is bryt.'
  },
  {
    id: 'rep-b2',
    level: 'beginner',
    sentence: 'I love to read colorful story books.',
    sentence_hi: 'मुझे रंग-बिरंगी कहानियों की किताबें पढ़ना पसंद है।',
    phoneticHint: 'Eye luv to reed kuh-ler-ful store-ee buks.'
  },
  {
    id: 'rep-b3',
    level: 'beginner',
    sentence: 'An apple a day keeps the doctor away.',
    sentence_hi: 'रोज़ एक सेब खाने से डॉक्टर के पास नहीं जाना पड़ता।',
    phoneticHint: 'An ap-puhl a day keeps the dahk-ter a-way.'
  },
  // Intermediate (Student)
  {
    id: 'rep-i1',
    level: 'intermediate',
    sentence: 'Practice makes a person confident and fluent.',
    sentence_hi: 'अभ्यास से इंसान आत्मविश्वासी और धाराप्रवाह बनता है।',
    phoneticHint: 'Prak-tis mayks a per-sun kahn-fi-dent and floo-ent.'
  },
  {
    id: 'rep-i2',
    level: 'intermediate',
    sentence: 'Could you please explain that to me once more?',
    sentence_hi: 'क्या आप कृपया मुझे यह बात एक बार और समझा सकते हैं?',
    phoneticHint: 'Kood yoo pleez ex-playn that to mee wuns mor?'
  },
  {
    id: 'rep-i3',
    level: 'intermediate',
    sentence: 'Learning English opens the door to the whole world.',
    sentence_hi: 'अंग्रेज़ी सीखना पूरी दुनिया के दरवाज़े खोल देता है।',
    phoneticHint: 'Ler-ning Ing-glish oh-penz the door to the hohl werld.'
  },
  // Advanced (Adult)
  {
    id: 'rep-a1',
    level: 'advanced',
    sentence: 'Effective communication requires both clear speech and active listening.',
    sentence_hi: 'सार्थक बातचीत के लिए स्पष्ट बोलने और ध्यान से सुनने, दोनों की ज़रूरत होती है।',
    phoneticHint: 'Ee-fek-tiv kuh-myoo-ni-kay-shun ree-kwyers kler speech and ak-tiv lis-ning.'
  },
  {
    id: 'rep-a2',
    level: 'advanced',
    sentence: 'I appreciate your constructive feedback on my presentation today.',
    sentence_hi: 'आज मेरी प्रस्तुति पर आपके सकारात्मक सुझावों के लिए मैं आभारी हूँ।',
    phoneticHint: 'Eye ah-pree-shee-ayt yor kuhn-struk-tiv feed-bak.'
  }
];
