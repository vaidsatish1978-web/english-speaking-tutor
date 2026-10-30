import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { RolePlayScenario, Language } from '../../types';
import { ROLEPLAY_SCENARIOS } from '../../data/roleplayScenarios';

interface RolePlayProps {
  onSelectScenario: (scenario: RolePlayScenario) => void;
  lang: Language;
}

export const RolePlay: React.FC<RolePlayProps> = ({ onSelectScenario, lang }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
          🎭 {lang === 'hi' ? 'रोल-प्ले अभ्यास' : 'Role-Play Scenarios'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'hi'
            ? 'दुकान, स्कूल, डॉक्टर या इंटरव्यू जैसे असली माहौल में अंग्रेज़ी बोलने का अभ्यास करें!'
            : 'Practice speaking in real-world situations like a shop, school, or job interview!'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {ROLEPLAY_SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            onClick={() => onSelectScenario(sc)}
            className="group p-4 rounded-3xl bg-white dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl p-2 rounded-2xl bg-indigo-50 dark:bg-slate-700 group-hover:scale-110 transition-transform">
                  {sc.emoji}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {sc.tutorRole.split('(')[0].trim()}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {lang === 'hi' ? sc.title_hi : sc.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {lang === 'hi' ? sc.description_hi : sc.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'बातचीत शुरू करें' : 'Start Talking'}</span>
              </span>
              <span>➔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
