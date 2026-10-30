import React, { useState } from 'react';
import { Sparkles, Languages, Volume2, CheckCircle2 } from 'lucide-react';
import type { Correction, Language } from '../../types';

interface CorrectionCardProps {
  correction: Correction;
  onSpeak: (text: string) => void;
  lang: Language;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({
  correction,
  onSpeak,
  lang,
}) => {
  const [showHindi, setShowHindi] = useState(lang === 'hi');

  return (
    <div className="mt-2.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-200/80 dark:from-slate-900 dark:to-amber-950/20 dark:border-amber-900/40 shadow-sm transition-all text-left">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-200/50 dark:border-amber-900/30">
        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-bounce-soft" />
          <span>{lang === 'hi' ? 'इसे ऐसे बोलना और बेहतर होगा 💡' : 'Better way to say it 💡'}</span>
        </div>

        {/* Hindi / English Explanation Toggle */}
        <button
          onClick={() => setShowHindi(!showHindi)}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition shadow-xs cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{showHindi ? 'English Explain' : 'हिंदी में समझें'}</span>
        </button>
      </div>

      {/* Comparison: Original -> Corrected */}
      <div className="space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-rose-500 text-[11px] uppercase tracking-wide min-w-[50px]">
            You said:
          </span>
          <span className="line-through decoration-rose-400 decoration-2">
            "{correction.original}"
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">"{correction.corrected}"</span>
          </div>

          <button
            onClick={() => onSpeak(correction.corrected)}
            title="Listen to correct sentence"
            aria-label="Listen"
            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-200 transition shrink-0 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1-Line Simple Explanation */}
      <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/60 p-2 rounded-lg border border-amber-100 dark:border-amber-950/50">
        <p className="leading-relaxed">
          <span className="font-semibold text-amber-700 dark:text-amber-400 mr-1">
            {showHindi ? 'नियम:' : 'Tip:'}
          </span>
          {showHindi ? correction.explanation_hi : correction.explanation_en}
        </p>
      </div>
    </div>
  );
};
