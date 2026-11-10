import React, { useState, useEffect, useRef } from 'react';
import { EsportsProfile } from '../types/esports';
import { EsportsCard } from './EsportsCard';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { X, Download, Check, Sparkles, Zap, Copy, Flame } from 'lucide-react';

interface CardShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EsportsProfile;
}

export const CardShowcaseModal: React.FC<CardShowcaseModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isForging, setIsForging] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const modalPopCardRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    'Summoning Awakened Shadow Titan...',
    'Applying High-Contrast Tough-Guy Shaders...',
    'Inscribing Guild Creed & Combat Stats...',
    'Charging Holographic Foil & Red Embers...',
  ];

  useEffect(() => {
    if (isOpen) {
      setIsForging(true);
      setLoadingStep(0);
      setDownloadSuccess(false);
      soundFx.playAwaken();

      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingMessages.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsForging(false);
              soundFx.playEquip();
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.5 },
                colors: ['#ef4444', '#f59e0b', '#dc2626', '#ffffff'],
              });
            }, 300);
            return prev;
          }
          return prev + 1;
        });
      }, 350);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadImage = async () => {
    if (!modalPopCardRef.current) return;
    setIsDownloading(true);
    soundFx.playShutter();

    try {
      const canvas = await html2canvas(modalPopCardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0c0d12',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${profile.playerName.toLowerCase().replace(/\s+/g, '_')}_awakened_card.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#f59e0b', '#ffffff'],
      });
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyAlias = () => {
    const fullText = `${profile.aliasPrefix ? profile.aliasPrefix + ' ' : ''}${profile.playerName}${profile.aliasSuffix ? ' ' + profile.aliasSuffix : ''} | ${profile.guildName} | ${profile.playerUID}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    soundFx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b0c13] border-2 border-red-600/80 rounded-2xl shadow-[0_0_60px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col items-center p-4 sm:p-6 my-auto">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-radial from-red-900/30 via-transparent to-transparent pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-50 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
          title="Close Pop-Up"
        >
          <X className="w-5 h-5" />
        </button>

        {/* FORGING / LOADING SURGE STATE */}
        {isForging ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 space-y-6 text-center max-w-md">
            {/* Animated Energy Reactor */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-red-600/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-t-red-500 border-r-amber-500 border-b-transparent border-l-transparent animate-spin" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-[0_0_30px_#ef4444]">
                <Flame className="w-8 h-8 text-black fill-black animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                Awakening Esports Card...
              </h3>
              <p className="font-mono-stat text-xs text-red-400 transition-all duration-200 h-6">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            {/* Stepped Progress Bar */}
            <div className="w-64 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          /* COMPLETED CARD POP-UP REVEAL */
          <div className="w-full flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-300">
            {/* Header Badge */}
            <div className="flex items-center gap-2 text-center">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
                Card Generated Successfully
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>

            {/* The Master Card in Pop-Up Spotlight */}
            <div className="w-full max-w-[420px] flex justify-center py-1">
              <EsportsCard
                profile={profile}
                cardRef={modalPopCardRef}
                interactiveTilt={true}
              />
            </div>

            {/* Action Buttons: Download & Copy & Close */}
            <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {/* Primary Download Button */}
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="py-3 px-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:brightness-110 text-black font-display font-black text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-red-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Forging Image...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download PNG</span>
                  </>
                )}
              </button>

              {/* Copy Alias / Info */}
              <button
                type="button"
                onClick={handleCopyAlias}
                className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-300" />
                    <span>Copy Name & UID</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 text-center">
              Move your mouse or finger across the card to inspect the 3D perspective tilt and holographic sheen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
