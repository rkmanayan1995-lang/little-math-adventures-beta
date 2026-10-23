import React, { useState } from 'react';
import {
  Copy,
  ExternalLink,
  Share2,
  CheckCircle2,
  ClipboardCheck,
  AlertCircle,
  Shield,
  Download,
  Smartphone,
  Globe
} from 'lucide-react';
import {
  VERIFIED_PUBLIC_BETA_URL,
  BETA_VERSION,
  copyToClipboard,
  shareBetaLink
} from '../../utils/betaTesting';
import { soundManager } from '../../utils/soundEffects';
import { progressManager } from '../../utils/progressManager';
import { t } from '../../utils/localization';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface BetaTestingCardProps {
  onOpenChecklistModal?: () => void;
  className?: string;
  compact?: boolean;
}

export const BetaTestingCard: React.FC<BetaTestingCardProps> = ({
  onOpenChecklistModal,
  className = '',
  compact = false
}) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const currentLang = progressManager.getProgress().settings.language || 'en';
  const isDeployed = Boolean(VERIFIED_PUBLIC_BETA_URL && VERIFIED_PUBLIC_BETA_URL.startsWith('http'));

  const handleCopy = async () => {
    setCopyError(null);
    if (!isDeployed) {
      setCopyError('Deployment required before a public beta link is available.');
      return;
    }

    const success = await copyToClipboard(VERIFIED_PUBLIC_BETA_URL);
    if (success) {
      soundManager.playPop();
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } else {
      setCopyError('Clipboard access unavailable. Please highlight the link below and copy manually (Ctrl+C / Cmd+C).');
    }
  };

  const handleShare = async () => {
    if (!isDeployed) return;
    const shared = await shareBetaLink(VERIFIED_PUBLIC_BETA_URL);
    if (shared) {
      soundManager.playCelebration();
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } else {
      // If Web Share is not supported or was cancelled, copy to clipboard as fallback
      handleCopy();
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-amber-50/90 via-white to-blue-50/70 rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm text-left space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-sans shadow-2xs">
              {t('beta_badge', currentLang)}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {BETA_VERSION}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-sans">
              PWA Ready
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-fredoka text-slate-950 mt-1">
            {t('beta_title', currentLang)}
          </h3>
          <p className="text-xs font-bold text-amber-900/95 italic mt-0.5 font-fredoka">
            {t('beta_subtitle', currentLang)}
          </p>
          <p className="text-[11px] font-medium text-slate-600 mt-0.5">
            Help Andy, Sancho, and Osi test their math adventure!
          </p>
        </div>

        {onOpenChecklistModal && (
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onOpenChecklistModal();
            }}
            className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-xl text-xs font-black font-fredoka flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-2xs cursor-pointer active:scale-95 min-h-[40px]"
          >
            <ClipboardCheck className="w-4 h-4 text-blue-700" />
            <span>{t('beta_checklist_btn', currentLang)}</span>
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {t('beta_description', currentLang)}
      </p>

      {/* URL Display Box */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-fredoka flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('beta_verified_url', currentLang)}</span>
        </label>

        {isDeployed ? (
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="text"
              readOnly
              value={VERIFIED_PUBLIC_BETA_URL}
              onFocus={(e) => e.target.select()}
              className="flex-1 px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-mono text-slate-800 shadow-inner select-all focus:border-amber-500 focus:outline-hidden"
              aria-label="Public Beta URL"
            />
          </div>
        ) : (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Deployment required before a public beta link is available.</span>
          </div>
        )}
      </div>

      {/* Action Buttons: COPY, OPEN, SHARE, INSTALL */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!isDeployed}
          className={`px-4 py-2.5 rounded-xl font-black text-xs font-fredoka flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer min-h-[44px] ${
            copySuccess
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50'
          }`}
          aria-live="polite"
        >
          {copySuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
              <span>{t('action_copied', currentLang)}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-300" />
              <span>{t('beta_copy_link', currentLang)}</span>
            </>
          )}
        </button>

        {/* Open Button (Uses safe native anchor link to prevent popup block) */}
        {isDeployed && (
          <a
            href={VERIFIED_PUBLIC_BETA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playPop()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-black text-xs font-fredoka flex items-center gap-1.5 transition-all active:scale-95 shadow-xs min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>{t('beta_open_game', currentLang)}</span>
          </a>
        )}

        {/* Share Button */}
        {isDeployed && (
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-fredoka flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Share2 className="w-4 h-4 text-slate-950" />
            <span>{shareSuccess ? t('action_shared', currentLang) : t('beta_share_testers', currentLang)}</span>
          </button>
        )}

        {/* Install App Button (PWA) */}
        <PWAInstallButton variant="primary" />
      </div>

      {/* Copy Error / Manual Fallback Notice */}
      {copyError && (
        <div className="p-3 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>{copyError}</span>
        </div>
      )}

      {/* Notes & Safeguard Guarantees */}
      <div className="bg-white/80 rounded-2xl p-3 border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 font-fredoka">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tester Privacy &amp; Data Safeguards</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
          <li>Testers can open the link in any mobile or desktop browser without signing in or requiring developer credentials.</li>
          <li>Each tester plays in isolated browser storage (no shared saves).</li>
          <li>No personal child information, emails, or names are ever collected.</li>
          <li>Screen-time limits and parent confirmation challenge remain strictly active.</li>
          <li>Browser progress is saved locally per device; progress is not synchronized between devices.</li>
        </ul>
      </div>
    </div>
  );
};
