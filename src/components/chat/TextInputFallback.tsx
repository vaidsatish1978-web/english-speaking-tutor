import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

interface TextInputFallbackProps {
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  isSupported: boolean;
  placeholder: string;
  speechNotSupportedNotice: string;
}

export const TextInputFallback: React.FC<TextInputFallbackProps> = ({
  onSendMessage,
  isProcessing,
  isSupported,
  placeholder,
  speechNotSupportedNotice,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-2">
      {!isSupported && (
        <div className="flex items-center gap-2 mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{speechNotSupportedNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholder}
          disabled={isProcessing}
          className="w-full py-3.5 pl-4 pr-12 text-sm sm:text-base rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm transition"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          aria-label="Send message"
          className="absolute right-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white transition active:scale-95 shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
