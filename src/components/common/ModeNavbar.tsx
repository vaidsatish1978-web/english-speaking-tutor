import React from 'react';
import { MessageCircle, Users, Sparkles, Repeat } from 'lucide-react';
import type { PracticeMode, Language } from '../../types';
import { translations } from '../../utils/i18n';

interface ModeNavbarProps {
  currentMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
  lang: Language;
}

export const ModeNavbar: React.FC<ModeNavbarProps> = ({
  currentMode,
  onSelectMode,
  lang,
}) => {
  const t = translations[lang];

  const modes: Array<{
    id: PracticeMode;
    label: string;
    icon: React.ReactNode;
    emoji: string;
  }> = [
    {
      id: 'freetalk',
      label: t.freeTalk,
      icon: <MessageCircle className="w-4 h-4" />,
      emoji: '💬',
    },
    {
      id: 'roleplay',
      label: t.rolePlay,
      icon: <Users className="w-4 h-4" />,
      emoji: '🎭',
    },
    {
      id: 'daily',
      label: t.dailyTopic,
      icon: <Sparkles className="w-4 h-4" />,
      emoji: '☀️',
    },
    {
      id: 'repeat',
      label: t.repeatAfterMe,
      icon: <Repeat className="w-4 h-4" />,
      emoji: '🗣️',
    },
  ];

  return (
    <nav className="w-full max-w-xl mx-auto px-2 py-2">
      <div className="grid grid-cols-4 gap-1 sm:gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/60">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-base">{m.emoji}</span>
              <span className="truncate max-w-[70px] sm:max-w-none">{m.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
