import React, { useState, useEffect } from 'react';
import { AdBanner } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Film,
} from 'lucide-react';
import { incrementBannerClicks, incrementBannerImpressions } from '../../services/storageService';

interface ScrollingAdBannerProps {
  banners: AdBanner[];
  position: 'top' | 'middle';
  onContactSupplier?: (supplierId: string, productId?: string) => void;
  onViewProduct?: (productId: string) => void;
  onNavigateVideos?: () => void;
  onOpenUploadBanner?: () => void;
  isAdmin?: boolean;
}

export const ScrollingAdBanner: React.FC<ScrollingAdBannerProps> = ({
  banners,
  position,
  onContactSupplier,
  onViewProduct,
  onNavigateVideos,
  onOpenUploadBanner,
  isAdmin = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeBanners = banners.filter((b) => b.position === position && b.status === 'active');

  // If no banners for this position, return null
  if (activeBanners.length === 0) {
    return null;
  }

  // Auto-scroll effect every 5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  // Track impressions
  useEffect(() => {
    const current = activeBanners[currentIndex];
    if (current) {
      incrementBannerImpressions(current.id);
    }
  }, [currentIndex, activeBanners]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentIndex % activeBanners.length];

  const handleCtaClick = () => {
    incrementBannerClicks(currentBanner.id);
    if (currentBanner.linkType === 'video' && onNavigateVideos) {
      onNavigateVideos();
    } else if (currentBanner.linkType === 'product' && currentBanner.targetId && onViewProduct) {
      onViewProduct(currentBanner.targetId);
    } else if (currentBanner.linkType === 'contact' && currentBanner.targetId && onContactSupplier) {
      onContactSupplier(currentBanner.targetId);
    } else if (currentBanner.targetUrl) {
      if (currentBanner.targetUrl.startsWith('#')) {
        const el = document.querySelector(currentBanner.targetUrl);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(currentBanner.targetUrl, '_blank');
      }
    } else if (onNavigateVideos) {
      onNavigateVideos();
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl transition-all my-4 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-100 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          {/* Badge & Ticker Indicator */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-slate-950 shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>{currentBanner.badgeText || 'Publicité Usine B2B'}</span>
            </span>

            <span className="text-[10px] text-slate-400 font-mono">
              Bannière Défilante {currentIndex + 1} / {activeBanners.length}
            </span>

            {isAdmin && onOpenUploadBanner && (
              <button
                type="button"
                onClick={onOpenUploadBanner}
                className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer ml-2"
              >
                + Uploader une bannière pub
              </button>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight leading-snug">
            {currentBanner.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
            {currentBanner.subtitle}
          </p>
        </div>

        {/* CTA Button and Navigation Arrows */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCtaClick}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            {currentBanner.linkType === 'video' ? (
              <Film className="w-4 h-4 text-slate-950" />
            ) : currentBanner.linkType === 'contact' ? (
              <MessageSquare className="w-4 h-4 text-slate-950" />
            ) : (
              <ArrowRight className="w-4 h-4 text-slate-950" />
            )}
            <span>{currentBanner.ctaText || 'Découvrir'}</span>
          </button>

          {/* Carousel Controls if > 1 banner */}
          {activeBanners.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Bannière précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Bannière suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots Bar */}
      {activeBanners.length > 1 && (
        <div className="relative z-10 px-5 pb-2.5 flex items-center gap-1.5">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
