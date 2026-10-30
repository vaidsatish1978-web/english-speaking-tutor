import React, { useState } from 'react';
import { X, Volume2, Gauge, User, Key, Check, Sparkles } from 'lucide-react';
import type { VoiceSpeed, VoiceGender, Language } from '../../types';
import { translations } from '../../utils/i18n';
import { getSavedGeminiKey, saveGeminiKey } from '../../services/gemini';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speed: VoiceSpeed;
  gender: VoiceGender;
  onSpeedChange: (speed: VoiceSpeed) => void;
  onGenderChange: (gender: VoiceGender) => void;
  onTestVoice: () => void;
  lang: Language;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  speed,
  gender,
  onSpeedChange,
  onGenderChange,
  onTestVoice,
  lang,
}) => {
  const [apiKey, setApiKey] = useState(getSavedGeminiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;
  const t = translations[lang];

  const handleSaveKey = () => {
    saveGeminiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
            <Volume2 className="w-5 h-5" />
            <h3>{t.settings}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Option */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
            <Gauge className="w-4 h-4" />
            <span>{t.voiceSpeed}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSpeedChange('normal')}
              className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                speed === 'normal'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/30'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {t.normal} (1.0x)
            </button>
            <button
              onClick={() => onSpeedChange('slow')}
              className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                speed === 'slow'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/30'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              🐢 {t.slow} (0.8x)
            </button>
          </div>
        </div>

        {/* Gender Option */}
        <div className="mt-5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
            <User className="w-4 h-4" />
            <span>{t.voiceGender}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onGenderChange('female')}
              className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                gender === 'female'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/30'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              👩 {t.female}
            </button>
            <button
              onClick={() => onGenderChange('male')}
              className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                gender === 'male'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/30'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              👨 {t.male}
            </button>
          </div>
        </div>

        {/* Test voice button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onTestVoice}
            className="w-full py-2.5 px-3 rounded-2xl bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 border border-indigo-200/60 dark:border-slate-700 transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'आवाज़ चेक करें' : 'Test Tutor Voice'}</span>
          </button>
        </div>

        {/* Optional Gemini API Key Section */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{lang === 'hi' ? 'Google Gemini AI Key (वैकल्पिक)' : 'Google Gemini AI Key (Optional)'}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            {lang === 'hi'
              ? 'असीमित बुद्धिमान AI बातचीत के लिए अपनी मुफ्त Gemini Key जोड़ें (यह केवल आपके फ़ोन/ब्राउज़र में सुरक्षित रहती है)।'
              : 'Add your free Gemini API key for unlimited AI smarts. Stored safely only on your device.'}
          </p>

          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-7 pr-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <Key className="w-3.5 h-3.5 absolute left-2 top-2.5 text-slate-400" />
            </div>

            <button
              onClick={handleSaveKey}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer ${
                isSaved ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? (lang === 'hi' ? 'सेव्ड!' : 'Saved!') : (lang === 'hi' ? 'सेव' : 'Save')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
