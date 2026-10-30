import { useState, useEffect, useCallback, useRef } from 'react';
import type { VoiceSpeed, VoiceGender } from '../types';

export interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speed: VoiceSpeed;
  gender: VoiceGender;
  setSpeed: (speed: VoiceSpeed) => void;
  setGender: (gender: VoiceGender) => void;
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState<VoiceSpeed>('normal');
  const [gender, setGender] = useState<VoiceGender>('female');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const onEndCallbackRef = useRef<(() => void) | undefined>(undefined);

  // Load available system voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!isSupported || !text) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      onEndCallbackRef.current = onEnd;

      // Clean text of emojis or special markdown for TTS
      const cleanText = text
        .replace(/[*_#`~[\]]/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Adjust rate: slow = 0.8x (ideal for kids/beginners), normal = 1.0x
      utterance.rate = speed === 'slow' ? 0.8 : 1.0;
      utterance.pitch = gender === 'female' ? 1.1 : 0.9;

      // Find best matching voice
      if (voices.length > 0) {
        const enVoices = voices.filter((v) => v.lang.startsWith('en'));
        const inVoices = enVoices.filter((v) => v.lang === 'en-IN');

        const voiceCandidatePool = inVoices.length > 0 ? inVoices : enVoices;

        const genderKeywords =
          gender === 'female'
            ? ['female', 'zira', 'samantha', 'victoria', 'kavya', 'priya', 'veena', 'neerja', 'aditi', 'google uk english female', 'siri']
            : ['male', 'david', 'george', 'ravi', 'prabhat', 'google uk english male', 'alex'];

        const matchedVoice = voiceCandidatePool.find((v) =>
          genderKeywords.some((keyword) => v.name.toLowerCase().includes(keyword))
        );

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        } else if (voiceCandidatePool.length > 0) {
          utterance.voice = voiceCandidatePool[0];
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallbackRef.current) {
          onEndCallbackRef.current();
          onEndCallbackRef.current = undefined;
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, speed, gender, voices]
  );

  return {
    isSpeaking,
    isSupported,
    speed,
    gender,
    setSpeed,
    setGender,
    speak,
    stop,
  };
}
