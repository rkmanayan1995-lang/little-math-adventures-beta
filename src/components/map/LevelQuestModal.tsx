import React, { useState, useEffect } from 'react';
import { MapDestination } from '../../types/creativeFoundation';
import { MathQuestion } from '../../types/mathEngine';
import { getQuestionsForLevel, validateAnswer } from '../../data/questionBank';
import { soundManager } from '../../utils/soundEffects';
import { progressManager } from '../../utils/progressManager';
import { t } from '../../utils/localization';
import { SupportedLanguage } from '../../types/localization';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { EnergyGauge } from '../home/EnergyGauge';
import {
  X,
  Star,
  Sparkles,
  Trophy,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Volume2,
  HelpCircle,
  Lightbulb,
  Award,
  Crown,
  Heart,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface LevelQuestModalProps {
  isOpen: boolean;
  destination: MapDestination | null;
  onClose: () => void;
  onLevelCompleted?: (destId: string, stars: number) => void;
  onStartNextLevel?: (nextDest: MapDestination) => void;
  allDestinations?: MapDestination[];
}

export const LevelQuestModal: React.FC<LevelQuestModalProps> = ({
  isOpen,
  destination,
  onClose,
  onLevelCompleted,
  onStartNextLevel,
  allDestinations
}) => {
  const currentLang: SupportedLanguage = progressManager.getSettings().language || 'en';

  // Retrieve all 10 deterministic questions for this level safely
  const levelNumber = destination?.number ?? 1;
  const questions: MathQuestion[] = getQuestionsForLevel(levelNumber);

  // Current question index (0 to 9 for the 10 questions)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Selected option for current attempt
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  // Answer attempt outcome state: null (not evaluated), true (correct), false (incorrect)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Gentle hint display & supportive message
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  // Guard against rapid duplicate taps while evaluating or celebrating
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Track attempts per question: 0 means answered on first try (Gold Star), >0 means participation star
  const [attemptsPerQuestion, setAttemptsPerQuestion] = useState<Record<number, number>>({});

  // Track rewards won per question index: 'gold' | 'participation'
  const [questionRewards, setQuestionRewards] = useState<Record<number, 'gold' | 'participation'>>({});

  // Interactive tokens tapped by toddler for tactile counting
  const [tappedTokens, setTappedTokens] = useState<number[]>([]);

  // Character emotional states for visual animations during gameplay
  const [andyExpression, setAndyExpression] = useState<'idle' | 'happy' | 'thinking' | 'encouraging' | 'celebration'>('idle');
  const [sanchoExpression, setSanchoExpression] = useState<'idle' | 'happy' | 'thinking' | 'encouraging' | 'celebration'>('idle');
  const [osiExpression, setOsiExpression] = useState<'idle' | 'happy' | 'thinking' | 'encouraging' | 'celebration'>('idle');

  // Active speaking character for dialogue bubbles
  const [activeSpeaker, setActiveSpeaker] = useState<'andy' | 'sancho' | 'osi'>('andy');

  // Level Quest completion state (only after all 10 questions are finished!)
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

  const currentQuestion: MathQuestion | undefined = questions[currentIndex] || questions[0];

  // Reset or restore resume state whenever destination changes
  useEffect(() => {
    if (!destination) return;
    const resume = progressManager.getResumeState();
    if (resume && resume.destId === destination.id && resume.questionIndex > 0 && resume.questionIndex < 10) {
      setCurrentIndex(resume.questionIndex);
    } else {
      setCurrentIndex(0);
    }
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setShowHint(false);
    setFeedbackText(null);
    setIsEvaluating(false);
    setAttemptsPerQuestion({});
    setQuestionRewards({});
    setTappedTokens([]);
    setIsLevelComplete(false);
    setAndyExpression('idle');
    setSanchoExpression('idle');
    setOsiExpression('idle');
    setActiveSpeaker('andy');
  }, [destination?.id]);

  // Save resume state so player can safely refresh or return
  useEffect(() => {
    if (destination && isOpen && !isLevelComplete) {
      progressManager.saveResumeState(destination.id, currentIndex);
    }
  }, [currentIndex, destination?.id, isOpen, isLevelComplete]);

  // Read question prompt aloud whenever moving to a new question
  useEffect(() => {
    if (currentQuestion && isOpen && !isLevelComplete && destination) {
      const speaker = currentQuestion.speaker === 'sancho' ? 'sancho' : 'andy';
      setActiveSpeaker(speaker);
      if (speaker === 'andy') {
        setAndyExpression('happy');
        setSanchoExpression('idle');
      } else {
        setSanchoExpression('thinking');
        setAndyExpression('idle');
      }
      setOsiExpression('idle');

      soundManager.speak(currentQuestion.narration, speaker);
    }
  }, [currentIndex, isOpen, isLevelComplete, destination?.id]);

  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;
    const speaker = currentQuestion.speaker === 'sancho' ? 'sancho' : 'andy';
    setActiveSpeaker(speaker);
    if (speaker === 'andy') {
      setAndyExpression('happy');
    } else {
      setSanchoExpression('thinking');
    }
    soundManager.speak(currentQuestion.narration, speaker);
  };

  const handleSpeakHint = () => {
    if (!currentQuestion) return;
    setActiveSpeaker('sancho');
    setSanchoExpression('encouraging');
    soundManager.speak(currentQuestion.hint, 'sancho');
  };

  /**
   * Handle selecting an answer option.
   * Deterministic math engine evaluation with duplicate-tap prevention:
   * - Unlimited attempts
   * - Gentle hints from Sancho
   * - 1 Star for 1st attempt (Gold Star)
   * - 1 Participation star for additional attempts (Silver Star)
   * - Zero star deduction on mistakes
   */
  const handleSelectOption = (option: string | number) => {
    // Prevent repeated taps from submitting the same answer or awarding duplicate rewards
    if (!currentQuestion || isLevelComplete || isEvaluating) return;

    // If current question has already been solved, do not accept more taps
    if (questionRewards[currentIndex]) return;

    setIsEvaluating(true);
    setSelectedOption(option);

    const result = validateAnswer(currentQuestion.id, option);

    if (result.isCorrect) {
      // Correct Answer!
      setIsAnswerCorrect(true);
      setShowHint(false);

      const attempts = attemptsPerQuestion[currentIndex] || 0;
      const isFirstTry = attempts === 0;
      const rewardType: 'gold' | 'participation' = isFirstTry ? 'gold' : 'participation';

      // Record reward strictly once without duplicate awards
      setQuestionRewards((prev) => ({
        ...prev,
        [currentIndex]: rewardType
      }));

      // Feedback text
      const praise = isFirstTry
        ? `⭐ Awesome! ${option} is correct on your first try!`
        : `🌟 Fantastic persistence! ${option} is correct!`;
      setFeedbackText(result.explanation ? `${praise} ${result.explanation}` : praise);

      // Character animations & voice celebrations
      setAndyExpression('celebration');
      setSanchoExpression('happy');
      setOsiExpression('celebration');
      setActiveSpeaker('andy');

      // Sound effects: celebratory chimes and Osi's playful puppy bark
      soundManager.playStarSparkle();
      soundManager.playCelebration();
      if (Math.random() > 0.4) {
        soundManager.playBark(2);
      }

      soundManager.speak(
        result.explanation || `You got it! ${option} is the right answer!`,
        currentQuestion.speaker || 'andy'
      );

      // Release evaluation lock so next-question button is interactive
      setIsEvaluating(false);

      // Check if all 10 questions are now completed
      const totalSolved = Object.keys(questionRewards).length + 1;
      if (totalSolved >= 10 || currentIndex === questions.length - 1) {
        // Slight delay for celebratory feedback before displaying level completion screen
        setTimeout(() => {
          handleAllQuestionsCompleted();
        }, 1600);
      }
    } else {
      // Incorrect attempt: supportive message and useful hint; allow another attempt
      setIsAnswerCorrect(false);
      setShowHint(true);
      setFeedbackText(`Good try! ${result.hint}`);

      // Track attempts for this question
      setAttemptsPerQuestion((prev) => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + 1
      }));

      // Sancho encourages thinking and trying again
      setActiveSpeaker('sancho');
      setSanchoExpression('encouraging');
      setAndyExpression('thinking');
      setOsiExpression('idle');

      // Soft non-punitive chime and gentle spoken hint
      soundManager.playPop();
      soundManager.speak(result.hint, 'sancho');

      // Release evaluation lock to allow next attempt
      setIsEvaluating(false);
    }
  };

  /**
   * Advance to the next question in the 10-question sequence
   */
  const handleNextQuestion = () => {
    // If screen time is exhausted, prevent advancing to another question and safely close to break screen
    if (progressManager.isScreenTimeExhausted()) {
      onClose();
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      setShowHint(false);
      setFeedbackText(null);
      setIsEvaluating(false);
      setTappedTokens([]);
      setAndyExpression('idle');
      setSanchoExpression('idle');
      setOsiExpression('idle');
      soundManager.playPop();
    } else {
      handleAllQuestionsCompleted();
    }
  };

  /**
   * Called once all 10 questions have been solved!
   */
  const handleAllQuestionsCompleted = () => {
    if (!destination) return;
    soundManager.playCelebration();
    soundManager.playBark(3);
    setIsLevelComplete(true);

    // Save level completion in central progress manager with maximum 3 stars for the map level
    const finalStars = goldStarsCount >= 7 ? 3 : goldStarsCount >= 4 ? 2 : 1;
    const result = progressManager.completeLevel(destination.id, {
      starsEarned: finalStars,
      questionsCompleted: 10,
      score: 10,
      firstTryCount: goldStarsCount
    });
    progressManager.clearResumeState();

    if (result.success && onLevelCompleted) {
      onLevelCompleted(destination.id, finalStars);
    }

    // Special Level 10 Math Adventure Champion celebration narration
    if (destination.number === 10) {
      soundManager.speak(
        'Hooray! You are our Math Adventure Champion! You mastered all ten destinations with Andy, Sancho, and Osi!',
        'narrator'
      );
    } else {
      soundManager.speak(
        `Congratulations! You finished all ten questions in ${destination.title}!`,
        'andy'
      );
    }
  };

  /**
   * Replay all 10 questions in this level
   */
  const handleReplaySession = () => {
    progressManager.clearResumeState();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setShowHint(false);
    setFeedbackText(null);
    setIsEvaluating(false);
    setAttemptsPerQuestion({});
    setQuestionRewards({});
    setTappedTokens([]);
    setIsLevelComplete(false);
    setAndyExpression('idle');
    setSanchoExpression('idle');
    setOsiExpression('idle');
    soundManager.playPop();
  };

  // Calculate question stars breakdown
  const goldStarsCount = Object.values(questionRewards).filter((r) => r === 'gold').length;
  const participationStarsCount = Object.values(questionRewards).filter((r) => r === 'participation').length;
  const totalStarsWon = goldStarsCount + participationStarsCount;

  // Next destination check for level completion
  const destinationList = allDestinations || progressManager.getProgress().destinations;
  const nextDest = destination ? destinationList.find((d) => d.number === destination.number + 1) : undefined;
  const nextLevelAccess = nextDest ? progressManager.canAccessLevel(nextDest.id) : null;

  // Render Visual Aids (Tokens, Patterns, Grouping, Story)
  const renderVisualIllustration = () => {
    if (!currentQuestion?.illustration) return null;
    const ill = currentQuestion.illustration;

    // Interactive Token Counting Aid
    if (ill.type === 'token_count' && ill.items) {
      return (
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-4 sm:p-5 my-3 text-center shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider font-fredoka flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap each item to count!</span>
            </span>
            {tappedTokens.length > 0 && (
              <button
                onClick={() => {
                  soundManager.playPop();
                  setTappedTokens([]);
                }}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-200/70 hover:bg-amber-200 px-2 py-0.5 rounded-lg font-fredoka transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Count</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {ill.items.map((itemGroup, groupIdx) => (
              <div
                key={groupIdx}
                className="flex flex-wrap items-center justify-center gap-2 p-2.5 sm:p-3 bg-white rounded-2xl shadow-xs border-2 border-amber-200"
              >
                {Array.from({ length: itemGroup.count || 1 }).map((_, itemIdx) => {
                  const globalIdx = groupIdx * 20 + itemIdx;
                  const isTapped = tappedTokens.includes(globalIdx);
                  const tapPosition = tappedTokens.indexOf(globalIdx) + 1;

                  return (
                    <button
                      key={itemIdx}
                      type="button"
                      onClick={() => {
                        soundManager.playCountNote((tappedTokens.length % 7) + 1);
                        if (!isTapped) {
                          setTappedTokens((prev) => [...prev, globalIdx]);
                        }
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 text-3xl sm:text-4xl rounded-2xl flex items-center justify-center transition-all transform active:scale-90 border-2 ${
                        isTapped
                          ? 'bg-amber-100 border-amber-400 scale-105 shadow-md ring-2 ring-amber-300'
                          : 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 hover:scale-105'
                      }`}
                      title={itemGroup.label || 'Count me!'}
                      aria-label={`${itemGroup.label || 'Item'} ${itemIdx + 1}`}
                    >
                      <span>{itemGroup.emoji}</span>
                      {isTapped && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white rounded-full text-xs font-black font-fredoka flex items-center justify-center shadow-xs animate-in zoom-in-75">
                          {tapPosition}
                        </span>
                      )}
                    </button>
                  );
                })}

                {itemGroup.label && (
                  <span className="text-xs font-bold text-slate-700 ml-1 px-1 font-fredoka">
                    {itemGroup.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {ill.formulaDisplay && (
            <div className="mt-3 text-base sm:text-lg font-black text-amber-950 font-fredoka tracking-wide bg-amber-100/80 inline-block px-4 py-1.5 rounded-xl border border-amber-300">
              {ill.formulaDisplay}
            </div>
          )}
        </div>
      );
    }

    // Pattern Sequence Illustration
    if (ill.type === 'pattern' && ill.patternElements) {
      return (
        <div className="bg-indigo-50/90 border-2 border-indigo-200 rounded-3xl p-4 sm:p-5 my-3 text-center shadow-xs">
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-3 font-fredoka">
            Complete the Pattern Sequence
          </span>
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            {ill.patternElements.map((elem, idx) => (
              <div
                key={idx}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl font-fredoka shadow-xs transition-all ${
                  elem === '?'
                    ? 'border-3 border-dashed border-indigo-500 bg-white text-indigo-600 animate-pulse ring-4 ring-indigo-200'
                    : 'bg-white text-slate-800 border-2 border-indigo-100'
                }`}
              >
                {elem}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Grouping & Early Multiplication Illustration
    if (ill.type === 'grouping' && ill.groups) {
      return (
        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 my-3 text-center shadow-xs">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-3 font-fredoka">
            Equal Groups (Repeated Addition)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {ill.groups.map((grp, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-emerald-300 rounded-2xl p-3 sm:p-4 shadow-xs text-center"
              >
                <span className="text-xs font-bold text-emerald-900 block mb-1.5 font-fredoka">
                  {grp.label}
                </span>
                <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl py-1">
                  {Array.from({ length: grp.count }).map((_, i) => (
                    <span key={i} className="hover:scale-110 transition-transform">
                      {grp.itemEmoji}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-black text-slate-700 font-fredoka mt-1 block">
                  {grp.count} in this group
                </span>
              </div>
            ))}
          </div>
          {ill.formulaDisplay && (
            <div className="mt-3 text-base sm:text-lg font-black text-emerald-950 font-fredoka bg-emerald-100/80 inline-block px-4 py-1.5 rounded-xl border border-emerald-300 math-expression" dir="ltr" data-math="true">
              {ill.formulaDisplay}
            </div>
          )}
        </div>
      );
    }

    // Illustrated Story Scene
    if (ill.type === 'story' && ill.storyScene) {
      return (
        <div className="bg-purple-50/90 border-2 border-purple-200 rounded-3xl p-4 sm:p-5 my-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-2 font-fredoka">
            <span className="flex items-center gap-1.5">
              <span>📖 Story Setting:</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg text-purple-950">
                {ill.storyScene.setting}
              </span>
            </span>
            <span className="text-purple-700">Companion: {ill.storyScene.character.toUpperCase()}</span>
          </div>

          {ill.items && (
            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
              {ill.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white px-3.5 py-2 rounded-2xl border-2 border-purple-200 text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 shadow-xs"
                >
                  <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                  <span className="font-fredoka">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {ill.formulaDisplay && (
            <div className="text-center text-sm sm:text-base font-black text-purple-950 font-fredoka mt-2 bg-purple-100/70 py-1 px-3 rounded-xl inline-block border border-purple-200 math-expression" dir="ltr" data-math="true">
              {ill.formulaDisplay}
            </div>
          )}
        </div>
      );
    }

    // Default Formula Display
    if (ill.formulaDisplay) {
      return (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3 sm:p-4 my-3 text-center">
          <span className="text-lg sm:text-xl font-black text-slate-900 font-fredoka math-expression inline-block" dir="ltr" data-math="true">
            {ill.formulaDisplay}
          </span>
        </div>
      );
    }

    return null;
  };

  // Safe check after all hooks are declared
  if (!isOpen || !destination) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div
          className="px-5 sm:px-6 py-3.5 flex items-center justify-between text-white border-b-2 border-white/20 select-none"
          style={{ backgroundColor: destination.accentColor || '#10B981' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xl font-fredoka shadow-xs">
              {destination.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider opacity-90">
                  Level {destination.number} · {destination.title}
                </span>
                <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">
                  10 Questions
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-fredoka tracking-tight leading-tight">
                {destination.mathTopic}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EnergyGauge compact className="bg-white/90 text-slate-900 border-white/40 shadow-xs" />
            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
              aria-label="Return to Map"
              title="Return to Map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quest Body or Victory Completion Screen */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!isLevelComplete && currentQuestion ? (
            <div className="space-y-4">
              {/* Question Stepper HUD & Progress Indicator */}
              <div className="bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-xs sm:text-sm font-black font-fredoka text-slate-800">
                    Question {currentIndex + 1} of 10
                  </span>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl font-fredoka text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{totalStarsWon} Stars</span>
                  </div>
                </div>

                {/* 10 Step Progress Dots with Gold & Participation Stars */}
                <div className="flex items-center gap-1 sm:gap-1.5 self-center overflow-x-auto max-w-full py-0.5 no-scrollbar">
                  {questions.map((_, idx) => {
                    const reward = questionRewards[idx];
                    const isCurrent = idx === currentIndex;

                    return (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-fredoka transition-all ${
                          reward === 'gold'
                            ? 'bg-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-300'
                            : reward === 'participation'
                            ? 'bg-slate-300 text-slate-800 ring-1 ring-slate-400'
                            : isCurrent
                            ? 'bg-white border-2 border-amber-500 text-amber-600 scale-110 shadow-xs animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        title={
                          reward === 'gold'
                            ? `Q${idx + 1}: Gold Star (1st try)`
                            : reward === 'participation'
                            ? `Q${idx + 1}: Participation Star`
                            : `Question ${idx + 1}`
                        }
                      >
                        {reward === 'gold' ? (
                          '⭐'
                        ) : reward === 'participation' ? (
                          '🌟'
                        ) : (
                          idx + 1
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Character Presence Card: Andy, Sancho, or Osi introducing the challenge */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 via-pink-50 to-emerald-50 p-3 rounded-2xl border-2 border-amber-200">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-white rounded-2xl p-1 border-2 border-amber-300 shadow-xs overflow-hidden flex items-center justify-center">
                  {activeSpeaker === 'andy' && (
                    <CharacterArtSvg characterId="andy" expression={andyExpression} className="w-full h-full" />
                  )}
                  {activeSpeaker === 'sancho' && (
                    <CharacterArtSvg characterId="sancho" expression={sanchoExpression} className="w-full h-full" />
                  )}
                  {activeSpeaker === 'osi' && (
                    <CharacterArtSvg characterId="osi" expression={osiExpression} className="w-full h-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 font-fredoka">
                      {activeSpeaker === 'andy'
                        ? 'Andy (Adventurer)'
                        : activeSpeaker === 'sancho'
                        ? 'Sancho (Problem Solver)'
                        : 'Osi (Puppy)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                    {activeSpeaker === 'andy'
                      ? '“Let’s explore this math adventure together!”'
                      : activeSpeaker === 'sancho'
                      ? '“Take your time to count and think!”'
                      : '“Arf! Math adventures are fun!”'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className="w-10 h-10 rounded-2xl bg-amber-200/70 hover:bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 transition-all active:scale-90 shadow-xs"
                  title="Listen to Question"
                  aria-label="Read Question Aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Single Clear Short Instruction Prompt */}
              <div className="bg-white border-3 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-xs text-center">
                <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest block mb-1 font-fredoka">
                  Instruction
                </span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 font-fredoka leading-snug">
                  {currentQuestion.text}
                </p>
              </div>

              {/* Visual Counting Objects / Story Illustration */}
              {renderVisualIllustration()}

              {/* Exactly 3 Distinct Large Answer Choices */}
              <div className="pt-1">
                <span className="text-xs font-bold text-slate-600 block mb-2 font-fredoka text-center">
                  Choose the correct answer:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = isAnswerCorrect && isSelected;
                    const isWrong = isAnswerCorrect === false && isSelected;
                    const isLocked = Boolean(questionRewards[currentIndex]) || isEvaluating;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleSelectOption(option)}
                        className={`h-20 sm:h-24 rounded-3xl font-black text-3xl sm:text-4xl font-fredoka border-4 transition-all transform active:scale-95 shadow-md flex items-center justify-center select-none math-expression ${
                          isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-200 shadow-xl ring-4 ring-emerald-300'
                            : isWrong
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : isLocked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75'
                            : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 hover:border-amber-400 hover:scale-102'
                        }`}
                        dir="ltr"
                        data-math="true"
                        aria-label={`Option: ${option}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Feedback & Gentle Sancho Hint Banner */}
              {feedbackText && (
                <div
                  className={`p-4 rounded-3xl border-3 flex items-start gap-3 text-xs sm:text-sm font-bold font-fredoka animate-in fade-in duration-200 ${
                    isAnswerCorrect
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : 'bg-amber-50 text-amber-950 border-amber-300'
                  }`}
                >
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="leading-relaxed">{feedbackText}</span>
                    {showHint && (
                      <button
                        type="button"
                        onClick={handleSpeakHint}
                        className="mt-1.5 text-xs text-amber-900 underline font-black flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Hear Sancho's hint again</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Controls: Hint Button & Next Question Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowHint(true);
                    handleSpeakHint();
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100/90 hover:bg-amber-200 rounded-2xl border-2 border-amber-300 flex items-center gap-1.5 font-fredoka transition-all active:scale-95"
                >
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>Sancho's Hint</span>
                </button>

                {isAnswerCorrect && (
                  progressManager.isScreenTimeExhausted() && currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => onClose()}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-sm font-fredoka flex items-center gap-2 shadow-lg transition-all active:scale-95 animate-pulse"
                    >
                      <span>Playtime Finished · Save & Rest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm font-fredoka flex items-center gap-2 shadow-lg transition-all active:scale-95 animate-bounce"
                    >
                      <span>
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Adventure!'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            /* Level Completion Celebration Screen with Andy, Sancho, and Osi */
            <div className="space-y-6 py-4 text-center animate-in zoom-in-95 duration-300">
              {/* Special Champion Celebration at Level 10 vs Standard Level Completion */}
              {destination.number === 10 ? (
                <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-4 border-amber-500 p-6 rounded-3xl text-slate-950 shadow-xl space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center text-amber-600 border-4 border-amber-400 animate-bounce">
                    <Crown className="w-12 h-12 fill-amber-400 text-amber-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-fredoka tracking-tight">
                    🌟 Math Adventure Champion! 🌟
                  </h3>
                  <p className="text-xs sm:text-sm font-bold max-w-md mx-auto leading-relaxed">
                    Incredible achievement! You have completed all 10 adventure destinations from Sunny Meadow all the way to Math Master Island!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-amber-500 shadow-md border-3 border-amber-300">
                    <Trophy className="w-10 h-10 fill-amber-400 text-amber-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-fredoka">
                    Level {destination.number} Completed!
                  </h3>
                  <p className="text-sm font-bold text-slate-600">
                    You conquered {destination.title} with the adventure team!
                  </p>
                </div>
              )}

              {/* All Three Friends Celebrating Together */}
              <div className="bg-gradient-to-b from-amber-50/80 to-emerald-50/80 border-2 border-amber-200 rounded-3xl p-4 sm:p-5">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-3 font-fredoka">
                  Adventure Team Celebration
                </span>
                <div className="flex items-end justify-center gap-4 sm:gap-6">
                  {/* Sancho */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-24 sm:w-24 sm:h-28">
                      <CharacterArtSvg characterId="sancho" expression="celebration" className="w-full h-full" />
                    </div>
                    <span className="text-xs font-bold font-fredoka text-slate-800 mt-1">Sancho</span>
                  </div>

                  {/* Andy in Center */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 -mb-2">
                      <CharacterArtSvg characterId="andy" expression="celebration" className="w-full h-full" />
                    </div>
                    <span className="text-xs font-black font-fredoka text-amber-950 mt-1">Andy</span>
                  </div>

                  {/* Osi the Puppy */}
                  <div className="flex flex-col items-center">
                    <div className="w-18 h-20 sm:w-22 sm:h-24">
                      <CharacterArtSvg characterId="osi" expression="celebration" className="w-full h-full" />
                    </div>
                    <span className="text-xs font-bold font-fredoka text-slate-800 mt-1">Osi 🐶</span>
                  </div>
                </div>
              </div>

              {/* Question & Stars Score Breakdown */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 text-center shadow-xs">
                  <span className="text-2xl font-black text-slate-900 font-fredoka block">10 / 10</span>
                  <span className="text-xs font-bold text-slate-500">Questions Solved</span>
                </div>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center shadow-xs">
                  <span className="text-2xl font-black text-amber-950 font-fredoka flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span>{totalStarsWon} Stars</span>
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    {goldStarsCount} First-Try · {participationStarsCount} Practice
                  </span>
                </div>
              </div>

              {/* Action Buttons: Return to Map & Next Level */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReplaySession}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 font-fredoka transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('feedback_replay_level', currentLang)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 font-fredoka shadow-md transition-all active:scale-95"
                >
                  <span>{t('action_close', currentLang)}</span>
                </button>

                {/* Next Level button if available and allowed */}
                {nextDest && nextLevelAccess?.allowed && onStartNextLevel && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCelebration();
                      onStartNextLevel(nextDest);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 font-fredoka shadow-lg transition-all active:scale-95 animate-pulse"
                  >
                    <span>Next Level: {nextDest.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
