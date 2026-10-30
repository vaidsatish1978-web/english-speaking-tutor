import React from 'react';
import { Calendar, Lightbulb, Sparkles } from 'lucide-react';
import type { DailyTopic as DailyTopicType, Language } from '../../types';
import { DAILY_TOPICS } from '../../data/practiceData';

interface DailyTopicProps {
  onStartTopic: (topic: DailyTopicType, starterPrompt?: string) => void;
  lang: Language;
}

export const DailyTopic: React.FC<DailyTopicProps> = ({ onStartTopic, lang }) => {
  const todayTopic = DAILY_TOPICS[0];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4">
      {/* Topic Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-brand-600 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>{lang === 'hi' ? 'आज का विषय' : 'Daily Topic of the Day'}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black mb-2">
          {lang === 'hi' ? todayTopic.title_hi : todayTopic.title}
        </h3>

        <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal mb-5">
          "{lang === 'hi' ? todayTopic.prompt_hi : todayTopic.prompt}"
        </p>

        <button
          onClick={() => onStartTopic(todayTopic)}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm sm:text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'hi' ? 'इस पर बोलकर चर्चा करें' : 'Discuss this with BolBuddy'}</span>
        </button>
      </div>

      {/* Suggested Starters */}
      <div className="mt-6">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{lang === 'hi' ? 'शुरुआत करने के लिए विचार (Idea Starters):' : 'Ideas to start speaking:'}</span>
        </h4>

        <div className="space-y-2.5">
          {todayTopic.starterSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onStartTopic(todayTopic, suggestion)}
              className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 text-xs sm:text-sm text-slate-700 dark:text-slate-200 shadow-xs transition flex items-center justify-between gap-3 group cursor-pointer"
            >
              <span>"{suggestion}"</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Say this ➔
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
