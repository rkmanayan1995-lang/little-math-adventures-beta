import React, { useEffect, useState } from 'react';
import { WifiOff, Check } from 'lucide-react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl border-2 border-amber-300 font-fredoka animate-in slide-in-from-bottom duration-300"
    >
      <div className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Offline Mode — Math adventure is playing from cache!</span>
    </div>
  );
};
