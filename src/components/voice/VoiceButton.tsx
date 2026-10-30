import React from 'react';
import { Mic, Send } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  langText: {
    tapToSpeak: string;
    listening: string;
    tapToStop: string;
    processing: string;
  };
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  onStartListening,
  onStopListening,
  langText,
}) => {
  const handleClick = () => {
    if (isProcessing) return;
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none">
      <div className="relative flex items-center justify-center">
        {/* Animated Expanding Rings when Listening */}
        {isListening && (
          <>
            <span className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
            <span className="absolute w-24 h-24 rounded-full bg-rose-400/30 animate-pulse" />
          </>
        )}

        {/* Audio Wave Indicator on Top */}
        {isListening && (
          <div className="absolute -top-9 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
            <span className="w-1 h-3 bg-rose-400 rounded-full animate-soundwave-1" />
            <span className="w-1 h-5 bg-rose-400 rounded-full animate-soundwave-2" />
            <span className="w-1 h-6 bg-rose-400 rounded-full animate-soundwave-3" />
            <span className="w-1 h-4 bg-rose-400 rounded-full animate-soundwave-4" />
            <span className="text-xs text-white font-medium ml-1">
              {langText.listening}
            </span>
          </div>
        )}

        {/* Main Big Button */}
        <button
          onClick={handleClick}
          disabled={isProcessing}
          aria-label={isListening ? langText.tapToStop : langText.tapToSpeak}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 active:scale-95 transform ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-rose-300/60 scale-105 ring-4 ring-rose-300 dark:ring-rose-900'
              : isProcessing
              ? 'bg-slate-400 text-white cursor-not-allowed shadow-slate-300'
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-brand-500 text-white hover:shadow-indigo-300/60 hover:scale-105 active:scale-95 ring-4 ring-indigo-200 dark:ring-indigo-950'
          }`}
        >
          {isProcessing ? (
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : isListening ? (
            <div className="flex flex-col items-center">
              <Send className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">
                Send
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse-slow" />
              <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">
                Speak
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Button Sub-Label */}
      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors">
        {isProcessing
          ? langText.processing
          : isListening
          ? langText.tapToStop
          : langText.tapToSpeak}
      </p>
    </div>
  );
};
