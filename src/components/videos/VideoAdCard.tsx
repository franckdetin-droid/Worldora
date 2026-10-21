import React, { useRef, useState, useEffect } from 'react';
import { AdVideo, VideoComment } from '../../types';
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
  Heart,
  MessageCircle,
  Send,
  X,
  User,
  Building,
} from 'lucide-react';
import {
  incrementVideoViews,
  incrementVideoClicks,
  toggleVideoLike,
  addVideoComment,
  getVideoComments,
  getCurrentUser,
} from '../../services/storageService';

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

  // Likes state
  const currentUser = getCurrentUser();
  const userIdentifier = currentUser?.id || currentUser?.email || 'visitor_user';
  const [likesCount, setLikesCount] = useState<number>(ad.likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(
    Boolean(ad.likedBy && ad.likedBy.includes(userIdentifier))
  );
  const [likeAnimating, setLikeAnimating] = useState(false);

  // Comments state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<VideoComment[]>(() => {
    return ad.comments && ad.comments.length > 0 ? ad.comments : getVideoComments(ad.id);
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(currentUser?.name || '');
  const [commentCompany, setCommentCompany] = useState(currentUser?.companyName || '');

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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = toggleVideoLike(ad.id, userIdentifier);
    if (result.success) {
      setLikesCount(result.likes);
      setIsLiked(result.isLiked);
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 500);
    }
  };

  const handleOpenComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCommentsList(getVideoComments(ad.id));
    setIsCommentsOpen(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const author = commentAuthor.trim() || currentUser?.name || 'Acheteur Professionnel';
    const company = commentCompany.trim() || currentUser?.companyName;

    const res = addVideoComment(ad.id, {
      userName: author,
      userCompany: company,
      content: newCommentText.trim(),
    });

    if (res.success && res.comment) {
      setCommentsList((prev) => [res.comment!, ...prev]);
      setNewCommentText('');
    }
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
    <div className="relative bg-slate-950 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between aspect-9/16 sm:aspect-4/3 max-w-md mx-auto w-full group">
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
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/95" />

      {/* Top Header Bar */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 shadow-xs">
            Vidéo Usine B2B
          </span>
          <span className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-xs drop-shadow-sm">
            {ad.brandName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur-xs text-white hover:bg-slate-800 cursor-pointer transition-colors shadow-sm"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Floating Side Action Rail for Likes & Comments (TikTok/Reels style for B2B) */}
      <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-3">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className={`flex flex-col items-center gap-1 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-90 ${
            isLiked
              ? 'bg-rose-500/90 text-white'
              : 'bg-slate-900/80 hover:bg-slate-800 text-white hover:text-rose-400 border border-white/10'
          }`}
          title={isLiked ? 'Je n’aime plus' : 'J’aime cette démonstration'}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${
              isLiked ? 'fill-current scale-110' : ''
            } ${likeAnimating ? 'animate-ping' : ''}`}
          />
          <span className="text-[10px] font-bold tabular-nums">
            {likesCount}
          </span>
        </button>

        {/* Comments Button */}
        <button
          type="button"
          onClick={handleOpenComments}
          className="flex flex-col items-center gap-1 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white hover:text-amber-400 transition-all cursor-pointer shadow-lg border border-white/10 active:scale-90"
          title="Voir et ajouter des commentaires"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold tabular-nums">
            {commentsList.length}
          </span>
        </button>

        {/* Views badge */}
        <div className="flex flex-col items-center text-[10px] text-slate-300 bg-slate-900/70 backdrop-blur-xs px-2 py-1 rounded-full border border-white/10">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold tabular-nums">{ad.views || 0}</span>
        </div>
      </div>

      {/* Center Play Button Overlay if Paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="relative z-10 mx-auto w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border border-white/20 shadow-xl"
        >
          <Play className="w-6 h-6 ml-1 text-amber-400" />
        </button>
      )}

      {/* Bottom Information & Action Bar */}
      <div className="relative z-10 p-4 sm:p-5 space-y-2 pr-16 sm:pr-20">
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

        {/* Primary CTA Button */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCtaClick}
            className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{ad.ctaText || 'Contacter le fournisseur'}</span>
          </button>

          {ad.targetProductId && onViewProduct && (
            <button
              type="button"
              onClick={() => onViewProduct(ad.targetProductId!)}
              title="Voir la fiche produit détaillée"
              className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-white/20 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ================= INTERACTIVE COMMENTS MODAL / DRAWER ================= */}
      {isCommentsOpen && (
        <div
          className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in slide-in-from-bottom-6 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white">
                Commentaires ({commentsList.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsCommentsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {commentsList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-1">
                <MessageCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">Aucun commentaire pour le moment</p>
                <p className="text-[11px] text-slate-500">
                  Soyez le premier professionnel à poser une question ou commenter cette vidéo.
                </p>
              </div>
            ) : (
              commentsList.map((com) => (
                <div key={com.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black uppercase">
                        {com.userName.charAt(0)}
                      </div>
                      <span className="truncate max-w-[140px]">{com.userName}</span>
                      {com.userCompany && (
                        <span className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">
                          ({com.userCompany})
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 tabular-nums shrink-0">
                      {new Date(com.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {com.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800 space-y-2">
            {!currentUser && (
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Votre nom"
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="text"
                  value={commentCompany}
                  onChange={(e) => setCommentCompany(e.target.value)}
                  placeholder="Votre société"
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Écrire un commentaire..."
                required
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shrink-0"
                title="Publier le commentaire"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
