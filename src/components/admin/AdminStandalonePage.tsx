import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  AlertTriangle,
  RotateCcw,
  Globe,
  Database,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { User, Product } from '../../types';
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminPassword,
  loginUser,
  logoutUser,
  resetAllSiteDataToZero,
  loadSampleDemoData,
  ADMIN_PASSWORD,
  ADMIN_PRIMARY_EMAIL,
} from '../../services/storageService';
import { AdminDashboardView } from './AdminDashboardView';

interface AdminStandalonePageProps {
  currentUser: User | null;
  onNavigatePublic: () => void;
  onViewProductDetail: (product: Product) => void;
  onDataReset?: () => void;
}

export const AdminStandalonePage: React.FC<AdminStandalonePageProps> = ({
  currentUser,
  onNavigatePublic,
  onViewProductDetail,
  onDataReset,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdminAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // If current user is already an authenticated admin, grant access
    if (currentUser && currentUser.isAdmin && isAdminAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, [currentUser]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!passwordInput.trim()) {
      setAuthError('Veuillez saisir le mot de passe administrateur.');
      return;
    }

    if (verifyAdminPassword(passwordInput)) {
      const loginRes = loginUser(ADMIN_PRIMARY_EMAIL, passwordInput.trim());
      if (loginRes.success) {
        setAdminAuthenticated(true);
        setIsAuthenticated(true);
        setPasswordInput('');
        setAuthError(null);
      } else {
        setAuthError(loginRes.error || 'Erreur lors de la connexion.');
      }
    } else {
      setAuthError('Mot de passe administrateur incorrect. Accès strictement refusé.');
    }
  };

  const handleLockSession = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    logoutUser();
  };

  const handleResetToZero = () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION : Confirmez-vous la remise à zéro complète de toutes les données du site ?\n\n' +
      '• Produits publiés : 0\n' +
      '• Publicités vidéos : 0\n' +
      '• Messages & Conversations : 0\n' +
      '• Statistiques visiteurs par pays : 0\n' +
      '• Seul le compte administrateur est conservé.'
    );

    if (confirmed) {
      resetAllSiteDataToZero();
      setResetFeedback('Toutes les données du site ont été remises à zéro avec succès.');
      setReloadKey((prev) => prev + 1);
      if (onDataReset) onDataReset();
      setTimeout(() => setResetFeedback(null), 4000);
    }
  };

  const handleLoadDemoData = () => {
    const confirmed = window.confirm(
      'Charger les données de test / démonstration pour tester la marketplace ?'
    );
    if (confirmed) {
      loadSampleDemoData();
      setResetFeedback('Données de démonstration chargées.');
      setReloadKey((prev) => prev + 1);
      if (onDataReset) onDataReset();
      setTimeout(() => setResetFeedback(null), 3000);
    }
  };

  // ================= STATE A: STRICT LOCKED ADMIN GATE =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
        {/* Minimal Admin Topbar */}
        <header className="px-4 py-3 sm:px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              W
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">WORLDORA B2B</span>
              <span className="ml-2 text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                Console Admin Protégée
              </span>
            </div>
          </div>

          <button
            onClick={onNavigatePublic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au site public</span>
          </button>
        </header>

        {/* Center Password Gate */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Subtle glow effect */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Console d'Administration Protégée
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Accès strictement réservé au créateur du site WORLDORA. Authentification par mot de passe obligatoire.
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                  Mot de passe administrateur
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Saisissez votre mot de passe secret"
                    autoFocus
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Déverrouiller l'Administration</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-400">
                Identifiant du compte principal : <span className="font-mono text-slate-300">{ADMIN_PRIMARY_EMAIL}</span>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-3 text-center text-xs text-slate-600 border-t border-slate-900">
          WORLDORA B2B Platform · Accès restreint (/admin)
        </footer>
      </div>
    );
  }

  // ================= STATE B: UNLOCKED ADMIN DASHBOARD =================
  const adminUser: User = currentUser && currentUser.isAdmin
    ? currentUser
    : {
        id: 'user-admin-root',
        name: 'Direction Générale WORLDORA (Super-Admin)',
        email: ADMIN_PRIMARY_EMAIL,
        password: ADMIN_PASSWORD,
        accountType: 'both',
        companyName: 'WORLDORA Global Headquarters',
        country: 'France',
        city: 'Paris',
        description: 'Super Administrateur de la plateforme WORLDORA.',
        verified: true,
        isAdmin: true,
        createdAt: '2025-01-01T00:00:00Z',
      };

  return (
    <div key={reloadKey} className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950">
      {/* Top Dedicated Admin Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">WORLDORA ADMIN</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400">
                Connecté : <strong className="text-amber-300 font-mono">{ADMIN_PRIMARY_EMAIL}</strong>
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Reset Site to 0 Button */}
            <button
              onClick={handleResetToZero}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Remettre tous les produits, vidéos, messages et visiteurs à zéro"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Remettre tout à</span>
              <span>zéro (0)</span>
            </button>

            {/* Optional Demo Loader */}
            <button
              onClick={handleLoadDemoData}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Charger des données d'exemple"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Charger démo</span>
            </button>

            {/* Return to Public Site */}
            <button
              onClick={onNavigatePublic}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-slate-950 bg-amber-950/40 hover:bg-amber-400 border border-amber-800/80 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Voir site public</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* Lock Session */}
            <button
              onClick={handleLockSession}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Verrouiller la session administrateur"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Verrouiller</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert if reset happened */}
        {resetFeedback && (
          <div className="max-w-7xl mx-auto mt-2 p-2 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetFeedback}</span>
            </div>
            <button
              onClick={() => setResetFeedback(null)}
              className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}
      </header>

      {/* Main Admin Dashboard View */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <AdminDashboardView
          currentUser={adminUser}
          onLogout={handleLockSession}
          onNavigateCatalog={onNavigatePublic}
          onViewProductDetail={onViewProductDetail}
        />
      </main>
    </div>
  );
};
