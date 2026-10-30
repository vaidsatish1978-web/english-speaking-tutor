import { useState, useEffect, useRef, useCallback } from 'react';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  errorMessage: string | null;
  startListening: (lang?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const currentInterimRef = useRef<string>('');
  const currentFinalRef = useRef<string>('');

  const isSupported = typeof window !== 'undefined' && 
    Boolean((window as IWindow).SpeechRecognition || (window as IWindow).webkitSpeechRecognition);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    currentInterimRef.current = '';
    currentFinalRef.current = '';
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const Win = window as IWindow;
    const SpeechRecognitionClass = Win.SpeechRecognition || Win.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
    };

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalStr += item[0].transcript;
        } else {
          interimStr += item[0].transcript;
        }
      }

      currentInterimRef.current = interimStr.trim();
      currentFinalRef.current = finalStr.trim();

      if (finalStr) {
        setTranscript(finalStr.trim());
      }
      setInterimTranscript(interimStr.trim());
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser.');
      } else if (event.error === 'no-speech') {
        setErrorMessage('No voice detected. Please speak closer to your microphone.');
      } else if (event.error !== 'aborted') {
        setErrorMessage(`Audio error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // If final transcript is empty but interim had words, promote interim to final!
      const captured = currentFinalRef.current || currentInterimRef.current;
      if (captured) {
        setTranscript(captured);
      }
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {
        // ignore
      }
    };
  }, [isSupported]);

  const startListening = useCallback((lang: string = 'en-IN') => {
    if (!isSupported) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }
    resetTranscript();
    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
      }
    } catch (err) {
      console.warn('Restarting speech recognition:', err);
      try {
        recognitionRef.current?.stop();
        setTimeout(() => recognitionRef.current?.start(), 150);
      } catch (e) {
        // ignore
      }
    }
  }, [isSupported, resetTranscript]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.warn('Error stopping speech recognition:', err);
    }
    const captured = currentFinalRef.current || currentInterimRef.current;
    if (captured) {
      setTranscript(captured);
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
  };
}
