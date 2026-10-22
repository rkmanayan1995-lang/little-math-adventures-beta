import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span className="font-bold text-slate-700 font-fredoka text-sm">Little Math Adventures</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Preschool Creative & Visual Foundation (Ages 3–7)</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>Andy (Girl)</span>
          <span className="text-slate-300">·</span>
          <span>Sancho (Boy)</span>
          <span className="text-slate-300">·</span>
          <span>Osi (Shih Tzu Dog)</span>
        </div>
      </div>
    </footer>
  );
};
