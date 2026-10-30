import React from 'react';
import { Star, Flame, Globe, Sliders, Shield } from 'lucide-react';
import type { LearnerProfile, Language } from '../../types';
import { translations } from '../../utils/i18n';

interface HeaderProps {
  currentProfile: LearnerProfile;
  lang: Language;
  onToggleLang: () => void;
  onOpenProfiles: () => void;
  onOpenParentZone: () => void;
  onOpenVoiceSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  lang,
  onToggleLang,
  onOpenProfiles,
  onOpenParentZone,
  onOpenVoiceSettings,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo and Mascot Header */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-500 flex items-center justify-center text-white text-lg font-black shadow-sm shadow-indigo-300/40">
            बोल
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-brand-600 dark:from-indigo-400 dark:to-brand-400 bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Profile Pill */}
          <button
            onClick={onOpenProfiles}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 border border-indigo-200/60 dark:border-slate-700 text-xs font-semibold text-indigo-900 dark:text-indigo-200 transition cursor-pointer"
            title="Switch Profile"
          >
            <span className="text-base">{currentProfile.avatar}</span>
            <span className="max-w-[70px] sm:max-w-[100px] truncate">
              {currentProfile.name.split('–')[0].trim()}
            </span>
          </button>

          {/* Star Rewards for Kids & Streaks */}
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200/80 dark:border-amber-900/40 text-xs font-bold text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{currentProfile.starsCount}</span>
            </span>
            <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
              <span>{currentProfile.streakDays}d</span>
            </span>
          </div>

          {/* UI Language Toggle */}
          <button
            onClick={onToggleLang}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
            title="Switch Language (English / हिंदी)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[11px]">{lang === 'en' ? 'हिं' : 'EN'}</span>
          </button>

          {/* Voice Settings */}
          <button
            onClick={onOpenVoiceSettings}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="Voice Speed & Gender"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Parent Zone PIN Protected */}
          <button
            onClick={onOpenParentZone}
            className="p-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition cursor-pointer"
            title="Parent Zone (Protected)"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
