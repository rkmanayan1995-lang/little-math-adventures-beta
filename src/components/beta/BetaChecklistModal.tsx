import React, { useState, useEffect } from 'react';
import {
  X,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Send,
  Copy,
  RotateCcw,
  Sparkles,
  Shield,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  BETA_TESTING_CHECKLIST,
  loadChecklistProgress,
  saveChecklistProgress,
  saveBetaFeedback,
  getSavedBetaFeedback,
  VERIFIED_PUBLIC_BETA_URL,
  BETA_VERSION,
  copyToClipboard
} from '../../utils/betaTesting';
import { soundManager } from '../../utils/soundEffects';

interface BetaChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BetaChecklistModal: React.FC<BetaChecklistModalProps> = ({
  isOpen,
  onClose
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() =>
    loadChecklistProgress()
  );
  const [activeTab, setActiveTab] = useState<'checklist' | 'feedback'>('checklist');

  // Feedback Form State
  const [deviceBrowser, setDeviceBrowser] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Sync checklist progress
  useEffect(() => {
    saveChecklistProgress(checkedItems);
  }, [checkedItems]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    soundManager.playPop();
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResetChecklist = () => {
    soundManager.playPop();
    setCheckedItems({});
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = BETA_TESTING_CHECKLIST.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (!issueDescription.trim() && !suggestions.trim()) {
      setFeedbackError('Please enter an issue description or suggestion.');
      return;
    }

    saveBetaFeedback({
      deviceBrowser: deviceBrowser.trim() || 'Unspecified device',
      issueDescription: issueDescription.trim(),
      stepsToReproduce: stepsToReproduce.trim(),
      suggestions: suggestions.trim(),
      testedChecklistCount: completedCount
    });

    soundManager.playCelebration();
    setFeedbackSuccess('Thank you! Your beta feedback was saved locally.');
    setIssueDescription('');
    setStepsToReproduce('');
    setSuggestions('');
    setTimeout(() => setFeedbackSuccess(null), 3500);
  };

  const handleCopyFormattedReport = async () => {
    const reportText = `[Little Math Adventures Beta Test Report - ${BETA_VERSION}]
URL: ${VERIFIED_PUBLIC_BETA_URL}
Checklist Passed: ${completedCount}/${totalCount} items
Device/Browser: ${deviceBrowser || 'Not specified'}

Issue Description:
${issueDescription || 'None reported'}

Steps to Reproduce:
${stepsToReproduce || 'N/A'}

Suggestions:
${suggestions || 'N/A'}
`;
    const success = await copyToClipboard(reportText);
    if (success) {
      soundManager.playPop();
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="beta-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 flex items-center justify-between text-white border-b-2 border-slate-800 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  QA &amp; Beta Readiness
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 font-mono">
                  {BETA_VERSION}
                </span>
              </div>
              <h2 id="beta-modal-title" className="text-lg font-black font-fredoka text-white">
                Beta Testing Checklist &amp; Feedback
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            aria-label="Close Beta Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 px-3 text-xs font-black font-fredoka flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-amber-500 text-amber-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-amber-600" />
            <span>10-Point Testing Checklist</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-full font-sans">
              {completedCount}/{totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('feedback')}
            className={`pb-2.5 px-3 text-xs font-black font-fredoka flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'feedback'
                ? 'border-amber-500 text-amber-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Tester Feedback Form</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {activeTab === 'checklist' ? (
            <div className="space-y-4">
              {/* Progress Summary Card */}
              <div className="bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-fredoka text-slate-900">
                      Checklist Progress: {completedCount} of {totalCount} Verified
                    </span>
                    <span className="text-xs font-bold text-amber-700 font-mono">
                      ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-48 sm:w-64 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetChecklist}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-300 text-xs font-bold font-fredoka flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* 10 Checklist Items */}
              <div className="space-y-2.5">
                {BETA_TESTING_CHECKLIST.map((item) => {
                  const isChecked = Boolean(checkedItems[item.id]);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/70 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div click
                        className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span
                          className={`text-xs font-black font-fredoka block ${
                            isChecked ? 'text-emerald-950' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Note on Data & Child Privacy */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-slate-600 text-[11px] leading-relaxed">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Safe &amp; Isolated Beta:</strong> Checklist status is saved in the browser’s local storage. No tracking cookies or advertising SDKs are included. Child-facing math curriculum and parental locks are strictly preserved.
                </span>
              </div>
            </div>
          ) : (
            /* Feedback Form Tab */
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 space-y-1">
                <span className="font-black font-fredoka block">
                  Help Us Improve Little Math Adventures!
                </span>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  Notice an audio delay, a misaligned button, or a confusing question? Let us know below. Please do not submit any children&apos;s names, phone numbers, or private contact details.
                </p>
              </div>

              {feedbackSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              {feedbackError && (
                <div className="p-3 bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{feedbackError}</span>
                </div>
              )}

              {/* Field 1: Device / Browser */}
              <div className="space-y-1">
                <label className="text-xs font-black font-fredoka text-slate-800 block">
                  Device &amp; Browser (Optional):
                </label>
                <input
                  type="text"
                  value={deviceBrowser}
                  onChange={(e) => setDeviceBrowser(e.target.value)}
                  placeholder="e.g. iPhone 14 Safari, Google Pixel Chrome, Mac Chrome"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              {/* Field 2: Issue Description */}
              <div className="space-y-1">
                <label className="text-xs font-black font-fredoka text-slate-800 block">
                  Issue Description:
                </label>
                <textarea
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe what happened or what didn't look right..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              {/* Field 3: Steps to Reproduce */}
              <div className="space-y-1">
                <label className="text-xs font-black font-fredoka text-slate-800 block">
                  Steps to Reproduce (Optional):
                </label>
                <textarea
                  rows={2}
                  value={stepsToReproduce}
                  onChange={(e) => setStepsToReproduce(e.target.value)}
                  placeholder="1. Open Level 3... 2. Tap question 4... 3. Tap hint button..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              {/* Field 4: Suggestions */}
              <div className="space-y-1">
                <label className="text-xs font-black font-fredoka text-slate-800 block">
                  Suggestions / Improvements (Optional):
                </label>
                <textarea
                  rows={2}
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Any ideas to make Andy, Sancho, and Osi's math adventure even more fun?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black font-fredoka flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer min-h-[44px]"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save Feedback Locally</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFormattedReport}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 rounded-xl text-xs font-bold font-fredoka flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer min-h-[44px]"
                >
                  {copiedReport ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Report Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Bug Report Text</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Public Beta: {VERIFIED_PUBLIC_BETA_URL ? 'Ready to share' : 'Deployment required'}
          </span>
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black font-fredoka text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer min-h-[40px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
