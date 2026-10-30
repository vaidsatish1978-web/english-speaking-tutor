export type Language = 'en' | 'hi';
export type AgeCategory = 'little-learner' | 'student' | 'adult';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PracticeMode = 'freetalk' | 'roleplay' | 'daily' | 'repeat';
export type VoiceSpeed = 'slow' | 'normal';
export type VoiceGender = 'female' | 'male';

export interface Correction {
  original: string;
  corrected: string;
  explanation_en: string;
  explanation_hi: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: number;
  correction?: Correction | null;
  newWords?: string[];
  audioUrl?: string;
  isSpoken?: boolean;
}

export interface LearnerProfile {
  id: string;
  name: string;
  ageCategory: AgeCategory;
  age: number;
  difficulty: DifficultyLevel;
  avatar: string;
  streakDays: number;
  lastPracticedDate: string; // YYYY-MM-DD
  totalMinutesSpoken: number;
  totalSentencesSpoken: number;
  starsCount: number;
  badges: string[];
  commonMistakes: Array<{
    id: string;
    original: string;
    corrected: string;
    explanation_en: string;
    explanation_hi: string;
    date: string;
  }>;
  vocabulary: Array<{
    word: string;
    meaning_en: string;
    meaning_hi: string;
    example: string;
    date: string;
  }>;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  title_hi: string;
  emoji: string;
  description: string;
  description_hi: string;
  tutorRole: string;
  userRole: string;
  initialMessage: string;
  suggestedPrompts: string[];
}

export interface DailyTopic {
  id: string;
  date: string;
  title: string;
  title_hi: string;
  prompt: string;
  prompt_hi: string;
  starterSuggestions: string[];
}

export interface RepeatSentence {
  id: string;
  level: DifficultyLevel;
  sentence: string;
  sentence_hi: string;
  phoneticHint?: string;
}
