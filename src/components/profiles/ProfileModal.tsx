import React, { useState } from 'react';
import { X, Check, Plus, Edit2, User, Star } from 'lucide-react';
import type { LearnerProfile, AgeCategory, DifficultyLevel, Language } from '../../types';
import { translations } from '../../utils/i18n';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: LearnerProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (profile: Omit<LearnerProfile, 'id' | 'streakDays' | 'lastPracticedDate' | 'totalMinutesSpoken' | 'totalSentencesSpoken' | 'starsCount' | 'badges' | 'commonMistakes' | 'vocabulary'>) => void;
  onUpdateProfileName: (id: string, newName: string) => void;
  lang: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfileName,
  lang,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // New profile form state
  const [newName, setNewName] = useState('');
  const [newAgeCategory, setNewAgeCategory] = useState<AgeCategory>('little-learner');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('beginner');
  const [newAvatar, setNewAvatar] = useState('🐯');

  if (!isOpen) return null;
  const t = translations[lang];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onCreateProfile({
      name: newName.trim(),
      ageCategory: newAgeCategory,
      age: newAgeCategory === 'little-learner' ? 7 : newAgeCategory === 'student' ? 12 : 24,
      difficulty: newDifficulty,
      avatar: newAvatar,
    });

    setNewName('');
    setIsCreating(false);
  };

  const startEdit = (p: LearnerProfile) => {
    setEditingId(p.id);
    setEditName(p.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateProfileName(id, editName.trim());
    }
    setEditingId(null);
  };

  const avatarChoices = ['🦁', '🚀', '💼', '🐯', '🐼', '🦊', '🦄', '⭐', '🦉', '🎓'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
            <User className="w-5 h-5" />
            <h3>{t.switchProfile}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile List */}
        {!isCreating ? (
          <div className="mt-4 space-y-3">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              const isEditing = editingId === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div
                    onClick={() => onSelectProfile(p.id)}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <span className="text-3xl p-1 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
                      {p.avatar}
                    </span>

                    <div className="min-w-0">
                      {isEditing ? (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-xs sm:text-sm font-bold px-2 py-1 rounded-lg border border-indigo-400 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(p.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                          {p.name}
                        </h4>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="capitalize">{p.ageCategory.replace('-', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{p.difficulty}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {p.starsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setIsCreating(true)}
              className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition bg-indigo-50/50 dark:bg-indigo-950/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नई प्रोफ़ाइल जोड़ें' : 'Add New Profile'}</span>
            </button>
          </div>
        ) : (
          /* Create Profile Form */
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'नाम:' : 'Profile Name:'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'hi' ? 'जैसे: राहुल, आरव या पापा' : 'e.g. Aarav (Class 2), Papa'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Avatar picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'अवतार चुनें:' : 'Choose Avatar:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {avatarChoices.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition cursor-pointer ${
                      newAvatar === av
                        ? 'border-indigo-600 bg-indigo-50 scale-110 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Category */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'उम्र / श्रेणी:' : 'Age Category:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['little-learner', 'student', 'adult'] as AgeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewAgeCategory(cat)}
                    className={`py-2 px-1 rounded-xl font-bold border transition cursor-pointer ${
                      newAgeCategory === cat
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cat === 'little-learner' ? '5-8 Yrs' : cat === 'student' ? '9-15 Yrs' : 'Adult'}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'कठिनाई स्तर:' : 'Difficulty Level:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((dif) => (
                  <button
                    key={dif}
                    type="button"
                    onClick={() => setNewDifficulty(dif)}
                    className={`py-2 px-1 rounded-xl font-bold capitalize border transition cursor-pointer ${
                      newDifficulty === dif
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {dif}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-300/40 cursor-pointer"
              >
                {lang === 'hi' ? 'सेव करें' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
