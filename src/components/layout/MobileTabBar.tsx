import React from 'react';
import { ShoppingBag, MessageSquare, LayoutDashboard, UserCheck, Film, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface MobileTabBarProps {
  currentUser: User | null;
  unreadCount: number;
  currentView: string;
  onNavigate: (view: 'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product') => void;
  onOpenAuth: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentUser,
  unreadCount,
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-1 py-1 shadow-lg">
      <div className="flex items-center justify-around h-14">
        {/* 1. Catalog */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
            currentView === 'catalog' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Offres</span>
        </button>

        {/* 2. B2B Video Reels / Ads */}
        <button
          onClick={() => onNavigate('videos')}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
            currentView === 'videos' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Film className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <span className="text-[10px] mt-0.5">Vidéos</span>
        </button>

        {/* 3. Messages */}
        <button
          onClick={() => {
            if (currentUser) {
              onNavigate('messages');
            } else {
              onOpenAuth();
            }
          }}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
            currentView === 'messages' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold text-white bg-amber-600 rounded-full border border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Messages</span>
        </button>

        {/* 4. Dashboard or Login */}
        {currentUser ? (
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
              currentView === 'dashboard' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Tableau</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth()}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Compte</span>
          </button>
        )}
      </div>
    </nav>
  );
};
