import React from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, Monitor, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { PlatformType } from '../../hooks/usePWAInstall';
import { soundManager } from '../../utils/soundEffects';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformType;
  isInstallable: boolean;
  onNativeInstall?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  platform,
  isInstallable,
  onNativeInstall
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between text-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center">
              <Download className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 id="pwa-install-modal-title" className="text-lg sm:text-xl font-black font-fredoka tracking-tight text-slate-950">
                Install Little Math Adventures
              </h2>
              <p className="text-xs font-bold text-amber-950/80">
                Play in full screen on phone, tablet, or computer
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/40 hover:bg-white/60 text-slate-950 flex items-center justify-center transition-all cursor-pointer min-w-[40px] min-h-[40px]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
          {/* Quick Perks Banner */}
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-xs text-slate-700 leading-snug">
              <div className="font-black font-fredoka text-amber-950 text-sm">
                Fast, Safe &amp; Works Offline!
              </div>
              <span>
                Installing adds an app icon to your home screen or dock for quick preschool math practice with no browser address bar.
              </span>
            </div>
          </div>

          {/* Native Install Prompt Button (if browser supports one-click install) */}
          {isInstallable && onNativeInstall && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playCelebration();
                  onNativeInstall();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black font-fredoka text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 min-h-[48px]"
              >
                <Download className="w-5 h-5 text-amber-300" />
                <span>INSTALL APP NOW (1-CLICK)</span>
              </button>
              <p className="text-center text-[11px] text-slate-500 font-medium">
                Your browser supports direct installation.
              </p>
            </div>
          )}

          {/* Platform Specific Step-by-Step Instructions */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-fredoka">
              Device Installation Instructions:
            </h3>

            {/* iOS Safari Guide */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${platform === 'ios' ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 font-black font-fredoka text-slate-900 text-sm mb-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>iPhone &amp; iPad (Apple Safari)</span>
                {platform === 'ios' && (
                  <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded-full ml-auto">
                    Your Device
                  </span>
                )}
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 pl-1 leading-relaxed">
                <li>
                  Open this link in <strong className="text-blue-900">Safari</strong> browser.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-bold">2.</span>
                  <span>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-600 -mt-0.5" /> (square with upward arrow at bottom of screen).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-bold">3.</span>
                  <span>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-blue-600 -mt-0.5" />.
                  </span>
                </li>
                <li>
                  Tap <strong>"Add"</strong> in the top-right corner. The app will appear on your Home Screen!
                </li>
              </ol>
            </div>

            {/* Android Guide */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${platform === 'android' ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 font-black font-fredoka text-slate-900 text-sm mb-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Android Phones &amp; Tablets (Chrome / Samsung)</span>
                {platform === 'android' && (
                  <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full ml-auto">
                    Your Device
                  </span>
                )}
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 pl-1 leading-relaxed">
                <li>Tap the <strong>"Install App"</strong> button above or in the browser toolbar.</li>
                <li>
                  If the prompt does not show, tap the <strong>three dots menu (⋮)</strong> in the top-right corner of Chrome.
                </li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              </ol>
            </div>

            {/* Windows / Mac Desktop Guide */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${platform === 'desktop' ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 font-black font-fredoka text-slate-900 text-sm mb-2">
                <Monitor className="w-4 h-4 text-purple-600" />
                <span>Windows &amp; Mac (Chrome / Edge / Safari)</span>
                {platform === 'desktop' && (
                  <span className="text-[10px] font-bold uppercase bg-purple-600 text-white px-2 py-0.5 rounded-full ml-auto">
                    Your Device
                  </span>
                )}
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 pl-1 leading-relaxed">
                <li>
                  <strong>Chrome &amp; Edge:</strong> Look for the <strong>Install</strong> icon <Download className="w-3.5 h-3.5 inline text-purple-600 -mt-0.5" /> in the browser address bar (top-right), or open the menu (⋮) &gt; <em>"Install Little Math Adventures"</em>.
                </li>
                <li>
                  <strong>macOS Safari (Sonoma+):</strong> Click <em>File &gt; Add to Dock…</em> in the top menu bar.
                </li>
              </ul>
            </div>
          </div>

          {/* Child Protection Safeguard */}
          <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              100% kid-safe PWA: No account creation, no in-app purchases, no tracking, and local progress isolation.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black font-fredoka text-sm shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
