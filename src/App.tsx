import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomeScreen } from './components/home/HomeScreen';
import { CharacterRoster } from './components/characters/CharacterRoster';
import { CharacterExpressions } from './components/characters/CharacterExpressions';
import { AdventureMapSection } from './components/map/AdventureMapSection';
import { CountingObjectsLab } from './components/counting/CountingObjectsLab';
import { UiKitSection } from './components/uikit/UiKitSection';
import { VisualSpecsSection } from './components/specifications/VisualSpecsSection';
import { StoryWorldSection } from './components/story/StoryWorldSection';
import { GameIntroduction } from './components/intro/GameIntroduction';
import { MathEngineInspector } from './components/engine/MathEngineInspector';
import { soundManager } from './utils/soundEffects';
import { progressManager } from './utils/progressManager';
import { PlayerProgress } from './types/progress';
import { BreakScreenModal } from './components/home/BreakScreenModal';
import { SettingsModal } from './components/home/SettingsModal';
import { DeveloperTestingModal, DeveloperActiveBadge } from './components/dev/DeveloperTestingModal';
import { BetaChecklistModal } from './components/beta/BetaChecklistModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { LanguageSelectorModal } from './components/common/LanguageSelectorModal';
import { applyLanguageDirection } from './utils/localization';
import { SupportedLanguage } from './types/localization';
import { Sparkles, RefreshCw, AlertCircle, Heart, Sun, Wrench } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PlayerProgress>(() => progressManager.getProgress());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [soundMuted, setSoundMuted] = useState<boolean>(() => soundManager.getMuted());
  const [showLowTimeReminder, setShowLowTimeReminder] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Startup Flow: load shell, restore & validate saved progress, route first-time vs returning players
  useEffect(() => {
    let isMounted = true;

    const initializeStartup = async () => {
      try {
        // 1. Restore & validate saved progress and settings
        const initialProgress = progressManager.getProgress();
        if (isMounted) {
          setProgress(initialProgress);
          setSoundMuted(initialProgress.settings.soundMuted);
          soundManager.setMuted(initialProgress.settings.soundMuted);
        }

        // 2. Pre-warm voice synthesis cache safely
        soundManager.getAvailableVoices();

        // 3. Determine initial tab:
        // First-time player -> opening story ('intro')
        // Returning player -> home screen ('home')
        const isFirstTime = progressManager.isFirstTimePlayer();
        const startTab = isFirstTime ? 'intro' : 'home';

        // 4. Smooth startup transition allowing assets to settle
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (isMounted) {
          setActiveTab(startTab);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Startup validation error:', err);
        if (isMounted) {
          setStartupError('Could not restore game progress smoothly. Starting with safe defaults.');
          setIsLoading(false);
          setActiveTab('home');
        }
      }
    };

    initializeStartup();

    // Subscribe to progress changes across the application
    const unsubscribe = progressManager.subscribe((newProgress) => {
      if (isMounted) {
        setProgress(newProgress);
        setSoundMuted(newProgress.settings.soundMuted);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Healthy Screen-Time Active Playtime Ticker & App Lifecycle Listener
  useEffect(() => {
    progressManager.checkReplenishment();

    let lastTickTime = Date.now();

    const intervalId = setInterval(() => {
      // Pause active counting when window/tab is hidden or device is locked
      if (typeof document !== 'undefined' && document.hidden) {
        lastTickTime = Date.now();
        return;
      }

      const now = Date.now();
      const deltaSec = Math.floor((now - lastTickTime) / 1000);

      if (deltaSec >= 1) {
        lastTickTime = now;
        const { exhaustedNow, lowWarningNow } = progressManager.tickActiveTime(deltaSec);

        if (lowWarningNow) {
          setShowLowTimeReminder(true);
          soundManager.speak(
            'Gentle reminder: Two minutes of adventure time left!',
            'sancho'
          );
        }
      }
    }, 1000);

    const handleVisibilityChange = () => {
      // Prevent double-counting time across lifecycle transitions
      lastTickTime = Date.now();
      if (!document.hidden) {
        progressManager.checkReplenishment();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Synchronize Accessibility Preferences (Reduced Motion and Large Text Scaling)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (progress.settings.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }

      if (progress.settings.textSize === 'large') {
        document.documentElement.classList.add('text-size-large');
      } else {
        document.documentElement.classList.remove('text-size-large');
      }
    }
  }, [progress.settings.reducedMotion, progress.settings.textSize]);

  // Synchronize Interface Language & Direction (RTL for Arabic, LTR for others)
  useEffect(() => {
    const lang: SupportedLanguage = progress.settings.language || 'en';
    applyLanguageDirection(lang);
  }, [progress.settings.language]);

  // Keyboard shortcut listener: Shift+D to open Developer QA Testing Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        setIsDevModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // First-time or replayed story completion:
  // After the story, show the adventure map as specified in startup flow
  const handleIntroComplete = () => {
    progressManager.markIntroCompleted();
    setActiveTab('map');
  };

  const handleIntroSkip = () => {
    progressManager.markIntroCompleted();
    setActiveTab('map');
  };

  // Play Adventure button from Home Screen -> go to Adventure Map
  const handlePlayAdventure = () => {
    setActiveTab('map');
  };

  // Replay Story button from Home Screen -> open story intro
  const handleReplayStory = () => {
    setActiveTab('intro');
  };

  // Select destination from Progress Modal -> jump to map
  const handleSelectDestination = (destId: string) => {
    progressManager.setActiveLevel(destId);
    setActiveTab('map');
  };

  // Error recovery action
  const handleRetryStartup = () => {
    setStartupError(null);
    setIsLoading(true);
    progressManager.resetAll();
    setTimeout(() => {
      setProgress(progressManager.getProgress());
      setIsLoading(false);
      setActiveTab('intro');
    }, 300);
  };

  // Loading Screen State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-center p-4 selection:bg-amber-200">
        <div className="flex flex-col items-center text-center max-w-sm p-8 bg-white rounded-3xl shadow-xl border-3 border-amber-300 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-amber-400 to-blue-500 flex items-center justify-center text-white text-3xl font-extrabold font-fredoka shadow-md mb-4 animate-bounce">
            M
          </div>
          <h1 className="text-xl font-black text-slate-900 font-fredoka tracking-tight mb-2">
            Little Math Adventures
          </h1>
          <p className="text-xs font-bold text-amber-900/80 mb-6 flex items-center gap-1.5 justify-center">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Loading magical numbers & story...</span>
          </p>
          <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
            <div className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-slate-800 flex flex-col font-sans antialiased selection:bg-amber-200 selection:text-slate-900 pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
      {/* Developer Testing Mode Top Active Banner */}
      {progressManager.isDevModeActive() && (
        <div className="bg-slate-900 text-amber-300 px-4 py-2 text-xs font-bold font-fredoka flex items-center justify-between border-b-2 border-amber-400 z-50 sticky top-0 shadow-md">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">
              DEVELOPER QA TESTING MODE ACTIVE — Screen-time limits &amp; progression gates bypassed for QA. Child save rules intact.
            </span>
            <span className="sm:hidden">
              DEV QA MODE ACTIVE — Time &amp; Levels Bypassed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDevModalOpen(true)}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black shadow-xs transition-all active:scale-95"
            >
              Dev Tools
            </button>
            <button
              onClick={() => {
                progressManager.disableDevMode();
                soundManager.playPop();
              }}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black shadow-xs transition-all active:scale-95"
            >
              Exit Dev Mode
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        energy={progress.energy}
        maxEnergy={progress.maxEnergy}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDevModal={() => setIsDevModalOpen(true)}
        onOpenBetaModal={() => setIsBetaModalOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      {/* Recoverable Startup Error Banner (if any) */}
      {startupError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-4 text-xs font-bold text-amber-950">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{startupError}</span>
            </div>
            <button
              onClick={handleRetryStartup}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-fredoka transition-all shadow-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcoming Home Screen */}
        {activeTab === 'home' && (
          <HomeScreen
            progress={progress}
            onPlayAdventure={handlePlayAdventure}
            onReplayStory={handleReplayStory}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {/* 5-Scene Animated Introduction */}
        {activeTab === 'intro' && (
          <GameIntroduction
            onComplete={handleIntroComplete}
            onSkip={handleIntroSkip}
          />
        )}

        {/* Progression Map & Destinations */}
        {activeTab === 'map' && (
          <AdventureMapSection
            destinations={progress.destinations}
            onUpdateDestination={(id, status, stars) => progressManager.updateDestination(id, status, stars)}
            onReplayIntro={() => setActiveTab('intro')}
            onReturnHome={() => setActiveTab('home')}
            energy={progress.energy}
            onConsumeEnergy={() => progressManager.consumeEnergy(1)}
          />
        )}

        {/* 10-Level Deterministic Math Engine Inspector & Verifier */}
        {activeTab === 'engine' && (
          <MathEngineInspector
            onPlayLevelOnMap={(lvl) => {
              const destId = lvl < 10 ? `dest_0${lvl}` : `dest_10`;
              progressManager.setActiveLevel(destId);
              setActiveTab('map');
            }}
          />
        )}

        {/* Character Roster */}
        {activeTab === 'team' && (
          <CharacterRoster onSelectExpressionTab={() => setActiveTab('expressions')} />
        )}

        {/* 5 Expressions Suite */}
        {activeTab === 'expressions' && (
          <CharacterExpressions />
        )}

        {/* Counting Objects Lab */}
        {activeTab === 'counting' && (
          <CountingObjectsLab />
        )}

        {/* UI Kit & Design Tokens */}
        {activeTab === 'uikit' && (
          <UiKitSection />
        )}

        {/* Visual Asset Guide & Specs */}
        {activeTab === 'specs' && (
          <VisualSpecsSection />
        )}

        {/* Story World Lore & Narrative */}
        {activeTab === 'story' && (
          <StoryWorldSection />
        )}
      </main>

      <Footer onOpenDevModal={() => setIsDevModalOpen(true)} />

      {/* Gentle 2-Minute Screen-Time Low Warning Toast */}
      {showLowTimeReminder && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center shrink-0 text-amber-800">
            <Sun className="w-5 h-5 fill-amber-400 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black font-fredoka text-amber-950">2 Minutes Remaining</h4>
            <p className="text-[11px] text-amber-900 leading-snug mt-0.5">
              Andy, Sancho, and Osi will be taking a restful break soon!
            </p>
          </div>
          <button
            onClick={() => setShowLowTimeReminder(false)}
            className="text-amber-800 hover:text-amber-950 text-xs font-bold px-2.5 py-1 bg-amber-200/70 rounded-lg font-fredoka transition-all active:scale-95"
          >
            OK
          </button>
        </div>
      )}

      {/* Authoritative Screen-Time Break Screen Modal (Exempts authorized Dev Testing Mode) */}
      {progressManager.isScreenTimeExhausted() && (
        <BreakScreenModal
          isOpen={true}
          onOpenDevModal={() => setIsDevModalOpen(true)}
        />
      )}

      {/* Global Settings & Accessibility Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={true}
          onClose={() => setIsSettingsOpen(false)}
          settings={progress.settings}
          onUpdateSettings={(updated) => progressManager.updateSettings(updated)}
          onResetProgress={() => progressManager.resetGameProgress()}
          onOpenDevModal={() => {
            setIsSettingsOpen(false);
            setIsDevModalOpen(true);
          }}
          onOpenBetaChecklistModal={() => setIsBetaModalOpen(true)}
          onReplayIntro={() => {
            setIsSettingsOpen(false);
            setActiveTab('intro');
          }}
        />
      )}

      {/* Global Floating Developer QA Mode Badge (Visible when active) */}
      <DeveloperActiveBadge onOpenModal={() => setIsDevModalOpen(true)} />

      {/* Developer Testing Mode Passcode & Control Modal */}
      <DeveloperTestingModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        onOpenChecklistModal={() => setIsBetaModalOpen(true)}
      />

      {/* Beta Testing 10-Point Checklist & Feedback Modal */}
      <BetaChecklistModal
        isOpen={isBetaModalOpen}
        onClose={() => setIsBetaModalOpen(false)}
      />

      {/* 7-Language Selection Modal (Accessible globally from header or home) */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={progress.settings.language || 'en'}
        onSelectLanguage={(newLang) => {
          progressManager.updateSettings({ language: newLang });
          applyLanguageDirection(newLang);
        }}
      />

      {/* Non-intrusive Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}
