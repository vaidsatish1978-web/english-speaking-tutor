import React, { useState } from 'react';
import { X, Shield, Lock, Award, Clock, MessageSquare, Flame } from 'lucide-react';
import type { LearnerProfile, Language } from '../../types';
import { translations } from '../../utils/i18n';

interface ParentZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LearnerProfile;
  lang: Language;
}

export const ParentZoneModal: React.FC<ParentZoneModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'mistakes' | 'vocab'>('stats');

  if (!isOpen) return null;
  const t = translations[lang];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsUnlocked(true);
      setErrorMsg(false);
      setPin('');
    } else {
      setErrorMsg(true);
      setPin('');
    }
  };

  const handleClose = () => {
    setIsUnlocked(false);
    setPin('');
    setErrorMsg(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-base">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3>{t.parentZone}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Screen */}
        {!isUnlocked ? (
          <form onSubmit={handlePinSubmit} className="mt-6 text-center py-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              {t.parentPinPrompt}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'hi'
                ? 'बच्चों की प्रगति देखने के लिए 4 अंकों का पिन डालें (डिफ़ॉल्ट पिन: 1234)'
                : 'Enter your 4-digit security PIN to view progress (Default PIN: 1234)'}
            </p>

            <div className="mt-4 flex justify-center">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/[^0-9]/g, ''));
                  setErrorMsg(false);
                }}
                placeholder="• • • •"
                className="w-36 text-center text-2xl tracking-widest font-mono py-2 px-3 rounded-xl border-2 border-purple-300 dark:border-purple-800 focus:outline-none focus:border-purple-600 dark:bg-slate-800 dark:text-white"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="mt-2 text-xs text-rose-500 font-semibold">
                {t.incorrectPin}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full max-w-xs mx-auto py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              {lang === 'hi' ? 'अनलॉक करें' : 'Unlock Dashboard'}
            </button>
          </form>
        ) : (
          /* Unlocked Parent Dashboard */
          <div className="mt-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 pb-1">
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                📊 {lang === 'hi' ? 'प्रगति' : 'Progress'}
              </button>
              <button
                onClick={() => setActiveTab('mistakes')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'mistakes'
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                ✏️ {lang === 'hi' ? 'गलतियों की डायरी' : 'Grammar Log'}
              </button>
              <button
                onClick={() => setActiveTab('vocab')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'vocab'
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                📚 {lang === 'hi' ? 'शब्दावली' : 'Vocabulary'}
              </button>
            </div>

            {/* TAB 1: Stats */}
            {activeTab === 'stats' && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.minutesSpoken}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                      {profile.totalMinutesSpoken} mins
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t.sentencesSpoken}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                      {profile.totalSentencesSpoken}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{t.streak}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                      {profile.streakDays} days
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.stars}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                      ⭐ {profile.starsCount}
                    </p>
                  </div>
                </div>

                {/* Badges Earned */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {lang === 'hi' ? 'अर्जित बैज (Badges):' : 'Badges Earned:'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((b, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Common Mistakes */}
            {activeTab === 'mistakes' && (
              <div className="mt-4 space-y-2.5">
                {profile.commonMistakes.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    {lang === 'hi' ? 'अभी कोई गलतियाँ दर्ज नहीं हुई हैं। बहुत अच्छा!' : 'No mistakes recorded yet. Great job!'}
                  </p>
                ) : (
                  profile.commonMistakes.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="line-through text-rose-500 font-medium">"{m.original}"</span>
                        <span>➔</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">"{m.corrected}"</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        {lang === 'hi' ? m.explanation_hi : m.explanation_en}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Vocabulary */}
            {activeTab === 'vocab' && (
              <div className="mt-4 space-y-2.5">
                {profile.vocabulary.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    {lang === 'hi' ? 'अभी कोई शब्द नहीं जोड़े गए हैं।' : 'No new vocabulary recorded yet.'}
                  </p>
                ) : (
                  profile.vocabulary.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">
                          {v.word}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {v.meaning_hi}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Meaning: {v.meaning_en}
                      </p>
                      <p className="text-slate-500 italic text-[11px]">
                        Example: "{v.example}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
