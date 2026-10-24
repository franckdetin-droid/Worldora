import React from 'react';
import { User } from '../../types';
import {
  Globe,
  MessageSquare,
  Plus,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Film,
  ShieldCheck,
} from 'lucide-react';
import { WorldoraLogo } from '../common/WorldoraLogo';

interface NavbarProps {
  currentUser: User | null;
  unreadCount: number;
  onOpenAuth: (redirectAction?: string) => void;
  onLogout: () => void;
  onNavigate: (view: 'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product' | 'contact') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  unreadCount,
  onOpenAuth,
  onLogout,
  onNavigate,
  currentView,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand wordmark & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('catalog')}
              className="text-left group cursor-pointer focus:outline-none"
              title="Retour au catalogue WORLDORA"
            >
              <WorldoraLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('catalog')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'catalog' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 py-5 -mb-px' : ''
              }`}
            >
              Catalogue Produits
            </button>

            <button
              onClick={() => onNavigate('videos')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'videos' ? 'text-amber-600 font-bold border-b-2 border-amber-500 py-5 -mb-px' : ''
              }`}
            >
              <Film className="w-4 h-4 text-amber-500" />
              <span>Vidéos & Pubs B2B</span>
            </button>

            <a
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Comment ça marche
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentView === 'contact' ? 'text-amber-600 font-bold border-b-2 border-amber-500 py-5 -mb-px' : ''
              }`}
            >
              <span>Nous contacter</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Fast shortcut: Add product if supplier or both */}
                {(currentUser.accountType === 'supplier' || currentUser.accountType === 'both') && (
                  <button
                    onClick={() => onNavigate('add-product')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter produit</span>
                  </button>
                )}

                {/* Messages shortcut with unread badge */}
                <button
                  onClick={() => onNavigate('messages')}
                  title="Mes messages"
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-amber-600 rounded-full border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-800 font-medium text-xs sm:text-sm cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                        {currentUser.companyName}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {currentUser.isAdmin ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                              Super-Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {currentUser.accountType === 'supplier'
                                ? 'Fournisseur'
                                : currentUser.accountType === 'buyer'
                                ? 'Acheteur'
                                : 'Acheteur & Fournisseur'}
                            </span>
                          )}
                        </div>
                      </div>

                      {currentUser.isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Panneau Administrateur</span>
                        </button>
                      )}

                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Tableau de bord</span>
                      </button>

                      <button
                        onClick={() => onNavigate('videos')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Film className="w-4 h-4 text-slate-400" />
                        <span>Vidéos & Démonstrations</span>
                      </button>

                      <button
                        onClick={() => onNavigate('messages')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span>Mes messages</span>
                        </div>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth()}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onOpenAuth()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Rejoindre
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
