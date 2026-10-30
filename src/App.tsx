import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/common/Header';
import { ModeNavbar } from './components/common/ModeNavbar';
import { VoiceSettingsModal } from './components/common/VoiceSettingsModal';
import { ProfileModal } from './components/profiles/ProfileModal';
import { ParentZoneModal } from './components/parent/ParentZoneModal';
import { BolBuddy } from './components/mascot/BolBuddy';
import { VoiceButton } from './components/voice/VoiceButton';
import { ChatBubble } from './components/chat/ChatBubble';
import { TextInputFallback } from './components/chat/TextInputFallback';
import { RolePlay } from './components/modes/RolePlay';
import { DailyTopic } from './components/modes/DailyTopic';
import { RepeatAfterMe } from './components/modes/RepeatAfterMe';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useProfiles } from './hooks/useProfiles';
import { sendChatMessage, getSavedGeminiKey } from './services/gemini';
import type { PracticeMode, Language, ChatMessage, RolePlayScenario, DailyTopic as DailyTopicType } from './types';
import { translations } from './utils/i18n';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentMode, setCurrentMode] = useState<PracticeMode>('freetalk');
  const [activeScenario, setActiveScenario] = useState<RolePlayScenario | null>(null);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(Boolean(getSavedGeminiKey()));

  // Hooks
  const {
    profiles,
    activeProfile,
    switchProfile,
    createProfile,
    updateProfileName,
    addStars,
    recordTurn,
  } = useProfiles();

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechRecSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const {
    isSpeaking,
    speed,
    gender,
    setSpeed,
    setGender,
    speak,
  } = useSpeechSynthesis();

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isProcessing]);

  // Handle when active profile changes: initialize welcome message
  useEffect(() => {
    let welcome = '';
    if (activeProfile.ageCategory === 'little-learner') {
      welcome = `Hello ${activeProfile.name.split('–')[0]}! 🌟 I am BolBuddy! Tap the big mic below and talk to me! Tell me, what did you do today?`;
    } else if (activeProfile.ageCategory === 'student') {
      welcome = `Hi ${activeProfile.name.split('–')[0]}! Welcome to BolEnglish. Ready to practice? What did you do today?`;
    } else {
      welcome = `Welcome to BolEnglish! I'm your interactive English conversation partner. Feel free to speak about your day, work, or hobbies.`;
    }

    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'tutor',
        text: welcome,
        timestamp: Date.now(),
        newWords: ['Welcome', 'Practice'],
      },
    ]);
  }, [activeProfile.id]);

  // When speech recognition produces a final transcript after user stops listening
  useEffect(() => {
    if (!isListening && transcript.trim() && !isProcessing) {
      handleSendUserMessage(transcript.trim());
      resetTranscript();
    }
  }, [isListening, transcript]);

  // Send message to Tutor API
  const handleSendUserMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // 1. Add user message to chat UI
    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // 2. Call backend proxy or smart engine
      const response = await sendChatMessage(
        text,
        chatMessages,
        activeProfile.ageCategory,
        activeProfile.difficulty,
        currentMode,
        activeScenario?.title
      );

      // 3. Attach correction to user message if error was detected
      if (response.correction) {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === userMsgId ? { ...m, correction: response.correction } : m
          )
        );
      }

      // 4. Add tutor reply message
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: Date.now(),
        newWords: response.new_words,
      };

      setChatMessages((prev) => [...prev, tutorMessage]);

      // 5. Update user progress stats
      recordTurn(response.correction, response.new_words);

      // 6. Speak the tutor's reply aloud
      speak(response.reply);

      // 7. Celebrate if little learner or great sentence
      if (activeProfile.ageCategory === 'little-learner' && !response.correction) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error('Error in tutor loop:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start Roleplay scenario
  const handleSelectScenario = (scenario: RolePlayScenario) => {
    setActiveScenario(scenario);
    setChatMessages([
      {
        id: `scenario-init-${Date.now()}`,
        sender: 'tutor',
        text: scenario.initialMessage,
        timestamp: Date.now(),
      },
    ]);
    speak(scenario.initialMessage);
  };

  // Start Daily Topic
  const handleStartDailyTopic = (topic: DailyTopicType, starterPrompt?: string) => {
    setCurrentMode('freetalk');
    const promptIntro = `Today's Topic is: "${topic.title}". ${topic.prompt}`;
    setChatMessages([
      {
        id: `topic-${Date.now()}`,
        sender: 'tutor',
        text: promptIntro,
        timestamp: Date.now(),
      },
    ]);
    speak(promptIntro);

    if (starterPrompt) {
      setTimeout(() => {
        handleSendUserMessage(starterPrompt);
      }, 500);
    }
  };

  // Mascot dynamic state
  const mascotState = isSpeaking
    ? 'speaking'
    : isListening
    ? 'listening'
    : isProcessing
    ? 'thinking'
    : 'idle';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Top Header */}
      <Header
        currentProfile={activeProfile}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'hi' : 'en')}
        onOpenProfiles={() => setIsProfileModalOpen(true)}
        onOpenParentZone={() => setIsParentModalOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
      />

      {/* AI Key Status Bar Banner */}
      <div className="max-w-xl mx-auto w-full px-3 pt-1">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition cursor-pointer ${
            hasGeminiKey
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200'
              : 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 hover:bg-indigo-100'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasGeminiKey ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="truncate">
              {hasGeminiKey
                ? (lang === 'hi' ? 'Google Gemini AI सक्रिय है (Active)' : 'Google Gemini AI Connected')
                : (lang === 'hi' ? 'मुफ्त Gemini AI Key जोड़ें (असीमित बातचीत के लिए)' : 'Connect Free Gemini AI Key (for infinite topics)')}
            </span>
          </div>
          <span className="text-[10px] font-bold underline shrink-0 ml-1">
            {hasGeminiKey ? (lang === 'hi' ? 'सेटिंग्स' : 'Settings') : (lang === 'hi' ? 'यहाँ क्लिक करें' : 'Click here')}
          </span>
        </button>
      </div>

      {/* 2. Practice Mode Selector Tabs */}
      <ModeNavbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setActiveScenario(null);
        }}
        lang={lang}
      />

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-3 py-2">
        {/* ROLEPLAY SELECTOR VIEW */}
        {currentMode === 'roleplay' && !activeScenario && (
          <RolePlay onSelectScenario={handleSelectScenario} lang={lang} />
        )}

        {/* DAILY TOPIC VIEW */}
        {currentMode === 'daily' && (
          <DailyTopic onStartTopic={handleStartDailyTopic} lang={lang} />
        )}

        {/* REPEAT AFTER ME (PRONUNCIATION) VIEW */}
        {currentMode === 'repeat' && (
          <RepeatAfterMe
            difficulty={activeProfile.difficulty}
            onSpeakSentence={(s) => speak(s)}
            isListening={isListening}
            transcript={transcript}
            onStartListening={() => startListening('en-IN')}
            onStopListening={stopListening}
            onAddStars={addStars}
            lang={lang}
          />
        )}

        {/* CHAT / VOICE CONVERSATION VIEW (Free Talk & Active Role-play) */}
        {(currentMode === 'freetalk' || (currentMode === 'roleplay' && activeScenario)) && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Active Roleplay Header pill if in scenario */}
            {activeScenario && (
              <div className="mb-2 p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveScenario(null)}
                  className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-bold hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'रोलप्ले सूची पर वापस' : 'Back to Scenarios'}</span>
                </button>
                <span className="font-extrabold text-indigo-900 dark:text-indigo-200">
                  {activeScenario.emoji} {activeScenario.title}
                </span>
              </div>
            )}

            {/* Mascot Avatar Widget */}
            <div className="flex flex-col items-center justify-center my-2">
              <BolBuddy state={mascotState} size="md" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                BolBuddy Tutor
              </span>
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto max-h-[46vh] sm:max-h-[50vh] pr-1 py-2 custom-scrollbar">
              {chatMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  onSpeak={(text) => speak(text)}
                  lang={lang}
                />
              ))}

              {/* BolBuddy Thinking indicator */}
              {isProcessing && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                    🤖
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-500 font-medium ml-1">
                      {t.processing}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Notice if any */}
              {speechError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs mb-2">
                  {speechError}
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Suggested prompts in Roleplay */}
            {activeScenario && activeScenario.suggestedPrompts && (
              <div className="py-1">
                <p className="text-[11px] font-bold text-slate-400 mb-1">
                  {lang === 'hi' ? 'आप यह बोल सकते हैं:' : 'Quick ideas to speak:'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeScenario.suggestedPrompts.slice(0, 2).map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendUserMessage(sp)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:border-indigo-400 transition cursor-pointer"
                    >
                      "{sp}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Docked Voice Controls */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-col items-center">
              {/* Real-time speech preview banner */}
              {isListening && interimTranscript && (
                <div className="mb-2 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs max-w-sm truncate animate-pulse shadow-md border border-slate-700">
                  🎤 Hearing: "{interimTranscript}"
                </div>
              )}

              {/* Big Tap to Speak Mic Button */}
              <VoiceButton
                isListening={isListening}
                isProcessing={isProcessing}
                onStartListening={() => startListening('en-IN')}
                onStopListening={stopListening}
                langText={{
                  tapToSpeak: t.tapToSpeak,
                  listening: t.listening,
                  tapToStop: t.tapToStop,
                  processing: t.processing,
                }}
              />

              {/* Text Fallback Input Box */}
              <TextInputFallback
                onSendMessage={handleSendUserMessage}
                isProcessing={isProcessing}
                isSupported={isSpeechRecSupported}
                placeholder={t.textFallbackPlaceholder}
                speechNotSupportedNotice={t.speechNotSupported}
              />
            </div>
          </div>
        )}
      </main>

      {/* Profile Switcher Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfile.id}
        onSelectProfile={(id) => {
          switchProfile(id);
          setIsProfileModalOpen(false);
        }}
        onCreateProfile={createProfile}
        onUpdateProfileName={updateProfileName}
        lang={lang}
      />

      {/* Parent Zone Modal (4-Digit PIN Protected) */}
      <ParentZoneModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        profile={activeProfile}
        lang={lang}
      />

      {/* Voice Speed, Gender & Gemini Key Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => {
          setIsVoiceModalOpen(false);
          setHasGeminiKey(Boolean(getSavedGeminiKey()));
        }}
        speed={speed}
        gender={gender}
        onSpeedChange={setSpeed}
        onGenderChange={setGender}
        onTestVoice={() => speak("Hello! I am BolBuddy. Let's speak English together!")}
        lang={lang}
      />
    </div>
  );
}

export default App;
