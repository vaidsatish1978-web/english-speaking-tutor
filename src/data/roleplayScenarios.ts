import type { RolePlayScenario } from '../types';

export const ROLEPLAY_SCENARIOS: RolePlayScenario[] = [
  {
    id: 'at-the-shop',
    title: 'At the Grocery Shop',
    title_hi: 'किराने की दुकान पर',
    emoji: '🛒',
    description: 'Practice buying fruits, vegetables, or snacks and asking for the price.',
    description_hi: 'फल, सब्ज़ी या नाश्ता खरीदने और कीमत पूछने का अभ्यास करें।',
    tutorRole: 'Friendly Shopkeeper (श्री राम)',
    userRole: 'Customer (ग्राहक)',
    initialMessage: 'Hello! Welcome to fresh grocery store. How may I help you today?',
    suggestedPrompts: [
      'How much do these red apples cost?',
      'Do you have fresh milk and bread?',
      'Can you please give me a kilo of potatoes?'
    ]
  },
  {
    id: 'at-school',
    title: 'At School / Classroom',
    title_hi: 'स्कूल / कक्षा में',
    emoji: '🏫',
    description: 'Talk to your teacher or classmate about homework, science, or recess games.',
    description_hi: 'टीचर या दोस्त से होमवर्क, क्लास या खेलकूद के बारे में बात करें।',
    tutorRole: 'Encouraging Teacher (Miss Anjali)',
    userRole: 'Student (छात्र)',
    initialMessage: 'Good morning! It is wonderful to see you in class today. What topic did you enjoy studying this week?',
    suggestedPrompts: [
      'Good morning teacher! I really enjoyed the science lesson about planets.',
      'May I ask a question about yesterday’s math homework?',
      'I played football with my friends during recess.'
    ]
  },
  {
    id: 'doctor-visit',
    title: 'Visiting the Doctor',
    title_hi: 'डॉक्टर के पास जाना',
    emoji: '🩺',
    description: 'Explain common health symptoms like fever, cough, or stomach ache politely.',
    description_hi: 'बुखार, खांसी या सिरदर्द के लक्षण डॉक्टर को अंग्रेज़ी में समझाएं।',
    tutorRole: 'Kind Family Doctor (Dr. Sharma)',
    userRole: 'Patient (मरीज़)',
    initialMessage: 'Hello there! Please take a seat. How are you feeling today, and what seems to be the trouble?',
    suggestedPrompts: [
      'Doctor, I have had a sore throat and fever since yesterday.',
      'My head hurts whenever I read for too long.',
      'Should I take any medicine with warm water?'
    ]
  },
  {
    id: 'ordering-food',
    title: 'Ordering Food at a Restaurant',
    title_hi: 'रेस्तरां में खाना ऑर्डर करना',
    emoji: '🍕',
    description: 'Ask for the menu, order delicious meals, and request the bill.',
    description_hi: 'मेनू मांगना, खाना ऑर्डर करना और बिल मांगना सीखें।',
    tutorRole: 'Courteous Waiter (Rajesh)',
    userRole: 'Diner (अतिथि)',
    initialMessage: 'Welcome to Royal Flavors! Here is your table and today’s special menu. Can I start you off with something cool to drink?',
    suggestedPrompts: [
      'Could you please recommend a vegetarian dish?',
      'I would like a fresh mango lassi, please.',
      'Excuse me, could we please have the bill?'
    ]
  },
  {
    id: 'introducing-yourself',
    title: 'Introducing Yourself to a New Friend',
    title_hi: 'नए दोस्त से अपना परिचय देना',
    emoji: '🤝',
    description: 'Say your name, what you like doing, your favorite hobbies, and hometown.',
    description_hi: 'अपना नाम, शौक, मनपसंद खेल और अपने शहर के बारे में बताएं।',
    tutorRole: 'Friendly New Friend (Rohan)',
    userRole: 'You (आप)',
    initialMessage: 'Hi there! Nice to meet you. My name is Rohan and I love playing cricket. What is your name?',
    suggestedPrompts: [
      'Hi Rohan! My name is Aryan and I live in Delhi.',
      'I love drawing cartoons and reading storybooks.',
      'Do you want to play a game together this evening?'
    ]
  },
  {
    id: 'job-interview',
    title: 'Job / College Interview',
    title_hi: 'नौकरी या कॉलेज का इंटरव्यू',
    emoji: '💼',
    description: 'Introduce your strengths, experience, background, and goals confidently.',
    description_hi: 'आत्मविश्वास से अपनी ताकत, अनुभव और लक्ष्यों को अंग्रेज़ी में रखें।',
    tutorRole: 'Hiring Manager (Mr. Verma)',
    userRole: 'Candidate (उम्मीदवार)',
    initialMessage: 'Good afternoon, thank you for coming in today. Could you start by telling me a little bit about yourself and your background?',
    suggestedPrompts: [
      'Good afternoon sir. I have a strong passion for technology and teamwork.',
      'My greatest strength is that I am a dedicated and fast learner.',
      'I am looking forward to contributing positively to your team.'
    ]
  }
];
