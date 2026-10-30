import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import type { ChatMessage, Language } from '../../types';
import { CorrectionCard } from '../correction/CorrectionCard';

interface ChatBubbleProps {
  message: ChatMessage;
  onSpeak: (text: string) => void;
  lang: Language;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onSpeak, lang }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`flex items-start gap-2 max-w-[90%] sm:max-w-[80%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-xs ${
            isUser
              ? 'bg-gradient-to-tr from-brand-500 to-indigo-500 text-white'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {isUser ? 'You' : '🤖'}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed break-words ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60 rounded-tl-xs'
          }`}
        >
          <p className="font-normal">{message.text}</p>

          {/* New words tag for tutor messages */}
          {!isUser && message.newWords && message.newWords.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                <BookOpen className="w-3 h-3" />
                {lang === 'hi' ? 'नए शब्द:' : 'New words:'}
              </span>
              {message.newWords.map((word, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40"
                >
                  {word}
                </span>
              ))}
            </div>
          )}

          {/* Replay Audio Button for Tutor */}
          {!isUser && (
            <div className="mt-2 flex items-center justify-end">
              <button
                onClick={() => onSpeak(message.text)}
                title="Listen again"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'दोबारा सुनें' : 'Listen again'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gentle Correction Card below User Message if mistake was detected */}
      {isUser && message.correction && (
        <div className="w-full max-w-[90%] sm:max-w-[80%]">
          <CorrectionCard
            correction={message.correction}
            onSpeak={onSpeak}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
};
