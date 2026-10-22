import React, { useState } from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { soundManager } from '../../utils/soundEffects';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'badge';
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  compact = false
}) => {
  const { isInstallable, isInstalled, isIOS, platform, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);

  // If already running in standalone mode (already installed as PWA)
  if (isInstalled) {
    if (variant === 'badge') {
      return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold font-fredoka border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    soundManager.playPop();
    // If native prompt is available (Chrome/Android/Edge)
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        // If dismissed or cancelled or unsupported, show detailed guide modal
        setShowModal(true);
      }
    } else {
      // For iOS Safari or desktop without triggered prompt, show guide
      setShowModal(true);
    }
  };

  const getButtonText = () => {
    if (compact) return 'Install';
    if (isIOS) return 'Install on iOS';
    return 'INSTALL APP';
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`rounded-xl font-black font-fredoka flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs min-h-[44px] ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 text-xs'
            : 'bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 px-3.5 py-2 text-xs'
        } ${className}`}
        aria-label="Install Little Math Adventures as a Progressive Web App"
      >
        {isIOS ? (
          <Smartphone className="w-4 h-4 text-blue-300" />
        ) : (
          <Download className="w-4 h-4 text-amber-300" />
        )}
        <span>{getButtonText()}</span>
      </button>

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        platform={platform}
        isInstallable={isInstallable}
        onNativeInstall={install}
      />
    </>
  );
};
