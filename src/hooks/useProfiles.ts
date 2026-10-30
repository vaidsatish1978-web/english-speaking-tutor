import { useState, useEffect, useCallback } from 'react';
import type { LearnerProfile, Correction } from '../types';
import { INITIAL_PROFILES } from '../data/initialProfiles';

const STORAGE_KEY_PROFILES = 'bolenglish_profiles_v1';
const STORAGE_KEY_ACTIVE = 'bolenglish_active_profile_id';

export function useProfiles() {
  const [profiles, setProfiles] = useState<LearnerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse profiles from localStorage', e);
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved && profiles.some((p) => p.id === saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return profiles[0]?.id || 'profile-little-learner';
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Failed to save profiles to localStorage', e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, activeProfileId);
    } catch (e) {
      // ignore
    }
  }, [activeProfileId]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const switchProfile = useCallback((id: string) => {
    setActiveProfileId(id);
  }, []);

  const createProfile = useCallback(
    (newProfileData: Omit<LearnerProfile, 'id' | 'streakDays' | 'lastPracticedDate' | 'totalMinutesSpoken' | 'totalSentencesSpoken' | 'starsCount' | 'badges' | 'commonMistakes' | 'vocabulary'>) => {
      const newProfile: LearnerProfile = {
        ...newProfileData,
        id: `profile-${Date.now()}`,
        streakDays: 1,
        lastPracticedDate: new Date().toISOString().split('T')[0],
        totalMinutesSpoken: 0,
        totalSentencesSpoken: 0,
        starsCount: 5,
        badges: ['New Explorer 🌟'],
        commonMistakes: [],
        vocabulary: [],
      };

      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    },
    []
  );

  const updateProfileName = useCallback((id: string, newName: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  }, []);

  const addStars = useCallback((count: number) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, starsCount: p.starsCount + count }
          : p
      )
    );
  }, [activeProfileId]);

  const recordTurn = useCallback(
    (mistake?: Correction | null, newWords?: string[]) => {
      const today = new Date().toISOString().split('T')[0];

      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id !== activeProfileId) return p;

          let streak = p.streakDays;
          if (p.lastPracticedDate !== today) {
            streak += 1;
          }

          const updatedMistakes = [...p.commonMistakes];
          if (mistake) {
            updatedMistakes.unshift({
              id: `cm-${Date.now()}`,
              original: mistake.original,
              corrected: mistake.corrected,
              explanation_en: mistake.explanation_en,
              explanation_hi: mistake.explanation_hi,
              date: today,
            });
          }

          const updatedVocab = [...p.vocabulary];
          if (newWords && newWords.length > 0) {
            newWords.forEach((word) => {
              if (!updatedVocab.some((v) => v.word.toLowerCase() === word.toLowerCase())) {
                updatedVocab.unshift({
                  word,
                  meaning_en: 'Useful conversational term',
                  meaning_hi: 'बातचीत का उपयोगी शब्द',
                  example: `Practice using "${word}" in your sentences.`,
                  date: today,
                });
              }
            });
          }

          return {
            ...p,
            streakDays: streak,
            lastPracticedDate: today,
            totalSentencesSpoken: p.totalSentencesSpoken + 1,
            totalMinutesSpoken: Math.round(p.totalMinutesSpoken + 0.5),
            starsCount: p.starsCount + 1,
            commonMistakes: updatedMistakes.slice(0, 50),
            vocabulary: updatedVocab.slice(0, 50),
          };
        })
      );
    },
    [activeProfileId]
  );

  return {
    profiles,
    activeProfile,
    switchProfile,
    createProfile,
    updateProfileName,
    addStars,
    recordTurn,
  };
}
