import React, { useState } from 'react';
import { Smartphone, Download, Check, AlertCircle } from 'lucide-react';
import { getApkConfig, triggerApkDownload } from '../../services/storageService';

interface ApkDownloadButtonProps {
  className?: string;
  variant?: 'compact' | 'badge' | 'header';
}

export const ApkDownloadButton: React.FC<ApkDownloadButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const config = getApkConfig();

  if (config.enabled === false) {
    return null;
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    setFeedback(null);

    try {
      const res = triggerApkDownload();
      setFeedback(res.message);
      setTimeout(() => {
        setFeedback(null);
        setIsDownloading(false);
      }, 4000);
    } catch {
      setFeedback('Erreur lors du téléchargement.');
      setTimeout(() => {
        setFeedback(null);
        setIsDownloading(false);
      }, 3000);
    }
  };

  if (variant === 'header') {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={handleDownload}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs hover:shadow-sm transition-all cursor-pointer border border-emerald-400/40 select-none ${className}`}
          title="Télécharger l'application Android APK de WORLDORA"
        >
          {isDownloading ? (
            <Download className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <Smartphone className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Télécharger APK</span>
          <span className="sm:hidden">APK</span>
          {config.version && (
            <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded text-emerald-100 font-semibold">
              v{config.version.replace(/^v/, '')}
            </span>
          )}
        </button>

        {feedback && (
          <div className="absolute top-full mt-1.5 right-0 z-50 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feedback}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer border border-emerald-400/40 shrink-0 select-none ${className}`}
        title="Télécharger l'application mobile Android (APK)"
      >
        {isDownloading ? (
          <Download className="w-3 h-3 animate-bounce" />
        ) : (
          <Smartphone className="w-3 h-3 text-emerald-200" />
        )}
        <span>Télécharger APK</span>
        <span className="text-[9px] bg-emerald-700/90 text-emerald-100 px-1 py-0.2 rounded">
          Android
        </span>
      </button>

      {feedback && (
        <div className="absolute top-full mt-1 left-0 sm:left-auto sm:right-0 z-50 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in duration-150">
          <div className="flex items-start gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        </div>
      )}
    </div>
  );
};
