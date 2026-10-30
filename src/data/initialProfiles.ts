import type { LearnerProfile } from '../types';

export const INITIAL_PROFILES: LearnerProfile[] = [
  {
    id: 'profile-little-learner',
    name: 'Little Learner – Beginner',
    ageCategory: 'little-learner',
    age: 6,
    difficulty: 'beginner',
    avatar: '🦁',
    streakDays: 3,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    totalMinutesSpoken: 24,
    totalSentencesSpoken: 18,
    starsCount: 15,
    badges: ['First Word', 'Animal Master', 'Super Speaker ⭐'],
    commonMistakes: [
      {
        id: 'cm-1',
        original: 'I has a cat',
        corrected: 'I have a cat',
        explanation_en: 'Use "have" with "I", and "has" with he/she/it.',
        explanation_hi: '"I" के साथ हमेशा "have" लगता है, "has" नहीं।',
        date: new Date().toISOString().split('T')[0],
      }
    ],
    vocabulary: [
      {
        word: 'Colourful',
        meaning_en: 'Full of bright colours',
        meaning_hi: 'रंग-बिरंगा',
        example: 'Butterflies are colourful.',
        date: new Date().toISOString().split('T')[0],
      },
      {
        word: 'Friendly',
        meaning_en: 'Kind and pleasant',
        meaning_hi: 'मिलनसार, प्यारा',
        example: 'Dogs are very friendly animals.',
        date: new Date().toISOString().split('T')[0],
      }
    ],
  },
  {
    id: 'profile-student',
    name: 'Student – Intermediate',
    ageCategory: 'student',
    age: 13,
    difficulty: 'intermediate',
    avatar: '🚀',
    streakDays: 5,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    totalMinutesSpoken: 45,
    totalSentencesSpoken: 38,
    starsCount: 28,
    badges: ['Sentence Builder', 'Grammar Hero', 'Daily Champ 🏆'],
    commonMistakes: [
      {
        id: 'cm-2',
        original: 'Yesterday I go to market',
        corrected: 'Yesterday I went to the market',
        explanation_en: 'When talking about the past ("yesterday"), use "went" (past tense of go) and add "the".',
        explanation_hi: 'बीते कल (Yesterday) की बात करते समय "went" (past tense) का प्रयोग होता है।',
        date: new Date().toISOString().split('T')[0],
      }
    ],
    vocabulary: [
      {
        word: 'Curious',
        meaning_en: 'Eager to know or learn something',
        meaning_hi: 'जिज्ञासु, जानने को उत्सुक',
        example: 'Students are curious about space.',
        date: new Date().toISOString().split('T')[0],
      },
      {
        word: 'Accomplish',
        meaning_en: 'To succeed in doing something',
        meaning_hi: 'पूरा करना या हासिल करना',
        example: 'You can accomplish anything with practice.',
        date: new Date().toISOString().split('T')[0],
      }
    ],
  },
  {
    id: 'profile-adult',
    name: 'Adult – Everyday English',
    ageCategory: 'adult',
    age: 26,
    difficulty: 'intermediate',
    avatar: '💼',
    streakDays: 2,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    totalMinutesSpoken: 30,
    totalSentencesSpoken: 25,
    starsCount: 12,
    badges: ['Confident Speaker', 'Fluency Starter'],
    commonMistakes: [
      {
        id: 'cm-3',
        original: 'I am agree with you',
        corrected: 'I agree with you',
        explanation_en: '"Agree" is already a verb, so you do not need "am".',
        explanation_hi: '"Agree" खुद एक क्रिया (verb) है, इसलिए इसके आगे "am" नहीं लगता।',
        date: new Date().toISOString().split('T')[0],
      }
    ],
    vocabulary: [
      {
        word: 'Convenient',
        meaning_en: 'Easy and suitable for your needs',
        meaning_hi: 'सुविधाजनक',
        example: 'Online shopping is very convenient.',
        date: new Date().toISOString().split('T')[0],
      }
    ],
  }
];
