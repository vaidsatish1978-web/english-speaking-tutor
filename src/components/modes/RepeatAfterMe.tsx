import React, { useState } from 'react';
import { Volume2, Mic, Star, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DifficultyLevel, Language } from '../../types';
import { REPEAT_SENTENCES } from '../../data/practiceData';
import { calculatePronunciationScore } from '../../services/pronunciationScore';
import { translations } from '../../utils/i18n';

interface RepeatAfterMeProps {
  difficulty: DifficultyLevel;
  onSpeakSentence: (text: string) => void;
  isListening: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onAddStars: (count: number) => void;
  lang: Language;
}

export const RepeatAfterMe: React.FC<RepeatAfterMeProps> = ({
  difficulty,
  onSpeakSentence,
  isListening,
  transcript,
  onStartListening,
  onStopListening,
  onAddStars,
  lang,
}) => {
  const t = translations[lang];

  // Filter sentences by level or fallback
  const levelSentences = REPEAT_SENTENCES.filter((s) => s.level === difficulty);
  const sentencesList = levelSentences.length > 0 ? levelSentences : REPEAT_SENTENCES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    feedbackKey: 'excellent' | 'goodJob' | 'keepTrying';
    missingWords: string[];
  } | null>(null);

  const currentItem = sentencesList[currentIndex % sentencesList.length];

  const handleListen = () => {
    onSpeakSentence(currentItem.sentence);
  };

  const handleEvaluate = () => {
    if (!transcript.trim()) return;
    const evaluation = calculatePronunciationScore(currentItem.sentence, transcript);
    setResult(evaluation);

    // Reward stars
    if (evaluation.score >= 80) {
      onAddStars(3);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else if (evaluation.score >= 50) {
      onAddStars(1);
    }
  };

  const handleNext = () => {
    setResult(null);
    setCurrentIndex((prev) => (prev + 1) % sentencesList.length);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 text-center">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
          🗣️ {t.repeatAfterMe}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {lang === 'hi'
            ? 'बोल-बड्डी की आवाज़ सुनें और ठीक वैसे ही बोलकर अपना उच्चारण सुधारें!'
            : 'Listen to BolBuddy and repeat the sentence to perfect your pronunciation!'}
        </p>
      </div>

      {/* Target Sentence Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900 shadow-md">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
          {t[currentItem.level]} Level
        </span>

        {/* English Sentence */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-4 leading-relaxed">
          "{currentItem.sentence}"
        </h3>

        {/* Hindi Meaning */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {currentItem.sentence_hi}
        </p>

        {/* Phonetic Pronunciation Guide */}
        {currentItem.phoneticHint && (
          <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 inline-block text-[11px] font-mono text-indigo-600 dark:text-indigo-300">
            Hint: {currentItem.phoneticHint}
          </div>
        )}

        {/* Listen Button */}
        <div className="mt-5">
          <button
            onClick={handleListen}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t.listenSentence}</span>
          </button>
        </div>
      </div>

      {/* Spoken Transcript & Recording Controls */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          {t.speakSentence}
        </p>

        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`w-18 h-18 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition transform active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-rose-500 animate-pulse ring-4 ring-rose-200'
              : 'bg-emerald-500 hover:bg-emerald-600 ring-4 ring-emerald-200'
          }`}
        >
          <Mic className="w-8 h-8" />
          <span className="text-[9px] font-bold uppercase mt-0.5">
            {isListening ? 'Stop' : 'Tap'}
          </span>
        </button>

        {/* Spoken Text Display */}
        {transcript && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full text-xs sm:text-sm">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">
              You Spoke:
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              "{transcript}"
            </p>

            {!result && (
              <button
                onClick={handleEvaluate}
                className="mt-3 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {lang === 'hi' ? 'उच्चारण चेक करें' : 'Check Pronunciation'}
              </button>
            )}
          </div>
        )}

        {/* Results Card */}
        {result && (
          <div className="mt-4 w-full p-4 rounded-3xl bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border-2 border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(result.score >= 80 ? 3 : result.score >= 50 ? 2 : 1)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-500" />
              ))}
            </div>

            <h4 className="text-lg font-black text-amber-700 dark:text-amber-400">
              {result.score}% {t.pronunciationScore}
            </h4>

            <p className="text-xs font-semibold mt-1 text-slate-600 dark:text-slate-300">
              {t[result.feedbackKey]}
            </p>

            <button
              onClick={handleNext}
              className="mt-4 inline-flex items-center gap-1.5 py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'अगला वाक्य' : 'Next Sentence'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
