import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import { Download, X, Check, ShieldCheck, Zap } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardElementRef: React.RefObject<HTMLDivElement | null>;
  playerName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cardElementRef,
  playerName,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardElementRef.current) return;
    setIsExporting(true);
    soundFx.playShutter();

    try {
      // High-resolution capture at 2x pixel density
      const canvas = await html2canvas(cardElementRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0c0d12',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setExportedUrl(dataUrl);
      setDownloadReady(true);

      // Trigger actual download link
      const link = document.createElement('a');
      link.download = `${playerName.toLowerCase().replace(/\s+/g, '_')}_apex_profile_card.png`;
      link.href = dataUrl;
      link.click();

      // Fire celebratory esports confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#dc2626', '#ffffff'],
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f1118] border-2 border-red-600/70 rounded-xl overflow-hidden shadow-2xl box-glow-crimson p-5 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
              Export Profile Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Info */}
        <div className="space-y-2 text-xs text-zinc-300">
          <p>
            Your aggressive profile card will be rendered in ultra-high 2.5x definition PNG, complete with the Awakened Titan background, tough-guy face upgrades, and your ultimate gamer alias.
          </p>

          <div className="flex items-center gap-2 p-2.5 bg-[#141622] rounded-lg border border-zinc-800 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Optimized for Discord avatars, Instagram story showcase, and Free Fire / BGMI clan rosters.</span>
          </div>
        </div>

        {/* Preview or Action */}
        <div className="pt-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:brightness-110 text-black font-display font-black text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-red-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Forging High-Res PNG...</span>
              </>
            ) : downloadReady ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Downloaded! Click to Save Again</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download High-Res Card (.PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
