import React, { useRef, useState, useEffect } from 'react';
import { AdVideo, Product } from '../../types';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageSquare,
  Eye,
  MousePointer,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { incrementVideoViews, incrementVideoClicks } from '../../services/storageService';

interface VideoAdCardProps {
  ad: AdVideo;
  onContactSupplier?: (supplierId: string, productId?: string) => void;
  onViewProduct?: (productId: string) => void;
  autoPlay?: boolean;
}

export const VideoAdCard: React.FC<VideoAdCardProps> = ({
  ad,
  onContactSupplier,
  onViewProduct,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [viewCounted, setViewCounted] = useState(false);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        if (!viewCounted) {
          incrementVideoViews(ad.id);
          setViewCounted(true);
        }
      }).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementVideoClicks(ad.id);
    if (ad.targetProductId && onViewProduct) {
      onViewProduct(ad.targetProductId);
    } else if (ad.targetSupplierId && onContactSupplier) {
      onContactSupplier(ad.targetSupplierId, ad.targetProductId);
    } else if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank');
    }
  };

  return (
    <div className="relative bg-slate-950 text-white rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-between aspect-9/16 sm:aspect-4/3 max-w-md mx-auto w-full group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={ad.videoUrl}
        poster={ad.thumbnailUrl}
        muted={isMuted}
        playsInline
        loop
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* Subtle Dark Gradient Scrims for Legibility */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />

      {/* Top Header Bar */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="bg-amber-500/90 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
            Pub B2B
          </span>
          <span className="text-xs font-semibold text-white truncate max-w-[150px] sm:max-w-xs">
            {ad.brandName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur-xs text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Center Play Button Overlay if Paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="relative z-10 mx-auto w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-xs text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border border-white/20 shadow-xl"
        >
          <Play className="w-6 h-6 ml-1 text-amber-400" />
        </button>
      )}

      {/* Bottom Information & Action Bar */}
      <div className="relative z-10 p-4 sm:p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3 h-3 text-amber-400" />
            {ad.country}
          </span>
          <span>·</span>
          <span className="truncate">{ad.category}</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
          {ad.title}
        </h3>

        {ad.description && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        )}

        {/* Primary CTA Button (Same style as products - Envoyer un message / Découvrir l'offre) */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCtaClick}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{ad.ctaText || 'Contacter le fournisseur'}</span>
          </button>

          {ad.targetProductId && onViewProduct && (
            <button
              type="button"
              onClick={() => onViewProduct(ad.targetProductId!)}
              title="Voir la fiche produit détaillée"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-white/20 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
