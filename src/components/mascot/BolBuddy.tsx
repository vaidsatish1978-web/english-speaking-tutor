import React from 'react';

interface BolBuddyProps {
  state: 'idle' | 'listening' | 'speaking' | 'thinking' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
}

export const BolBuddy: React.FC<BolBuddyProps> = ({ state, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  };

  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isCelebrating = state === 'celebrating';

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Outer Glow Halo */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isListening
            ? 'bg-rose-400/30 scale-125 animate-ping'
            : isSpeaking
            ? 'bg-brand-400/30 scale-110 animate-pulse'
            : isCelebrating
            ? 'bg-amber-400/40 scale-125 animate-bounce'
            : 'bg-indigo-100 dark:bg-indigo-950/40'
        }`}
      />

      {/* SVG Mascot (BolBuddy Owl-Bot) */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full relative z-10 transition-transform duration-300 drop-shadow-md ${
          isSpeaking ? 'animate-bounce-soft' : isThinking ? 'animate-wiggle' : ''
        }`}
      >
        {/* Head/Body Base */}
        <circle cx="50" cy="50" r="45" fill="url(#buddyGradient)" />

        {/* Belly/Chest Patch */}
        <ellipse cx="50" cy="62" rx="28" ry="24" fill="#FFFFFF" opacity="0.92" />

        {/* Eyes Outer */}
        <circle cx="34" cy="42" r="13" fill="#FFFFFF" />
        <circle cx="66" cy="42" r="13" fill="#FFFFFF" />

        {/* Pupils */}
        {isListening ? (
          // Excited, wide open listening eyes
          <>
            <circle cx="34" cy="42" r="7" fill="#1E293B" />
            <circle cx="66" cy="42" r="7" fill="#1E293B" />
            <circle cx="36" cy="40" r="2.5" fill="#FFFFFF" />
            <circle cx="68" cy="40" r="2.5" fill="#FFFFFF" />
          </>
        ) : isThinking ? (
          // Looking up in thought
          <>
            <circle cx="34" cy="38" r="6" fill="#1E293B" />
            <circle cx="66" cy="38" r="6" fill="#1E293B" />
            <circle cx="36" cy="36" r="2" fill="#FFFFFF" />
            <circle cx="68" cy="36" r="2" fill="#FFFFFF" />
          </>
        ) : (
          // Happy normal friendly eyes
          <>
            <circle cx="35" cy="43" r="6.5" fill="#0F172A" />
            <circle cx="65" cy="43" r="6.5" fill="#0F172A" />
            <circle cx="37" cy="41" r="2.5" fill="#FFFFFF" />
            <circle cx="67" cy="41" r="2.5" fill="#FFFFFF" />
          </>
        )}

        {/* Cheerful Blush */}
        <ellipse cx="23" cy="53" rx="5" ry="3" fill="#FB7185" opacity="0.6" />
        <ellipse cx="77" cy="53" rx="5" ry="3" fill="#FB7185" opacity="0.6" />

        {/* Beak / Mouth */}
        {isSpeaking ? (
          // Animated talking open mouth
          <ellipse cx="50" cy="54" rx="8" ry="6" fill="#EA580C" className="animate-pulse" />
        ) : (
          // Sweet happy smile
          <path
            d="M 44 52 Q 50 58 56 52"
            stroke="#EA580C"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="transparent"
          />
        )}

        {/* Headphone band (Tutor gear) */}
        <path
          d="M 18 42 A 36 36 0 0 1 82 42"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Headphone ear pads */}
        <rect x="10" y="36" width="10" height="18" rx="5" fill="#6366F1" />
        <rect x="80" y="36" width="10" height="18" rx="5" fill="#6366F1" />

        {/* Friendly Graduation Cap or Star Antenna */}
        <polygon points="50,6 59,18 41,18" fill="#FACC15" />
        <circle cx="50" cy="6" r="3.5" fill="#EAB308" />

        {/* Gradient Defs */}
        <defs>
          <linearGradient id="buddyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
