import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { User } from '../../types';
import { loginUser, ADMIN_PASSWORD } from '../../services/storageService';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: User) => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (pwdToTest: string) => {
    setError(null);
    setIsLoading(true);

    const clean = pwdToTest.trim();
    if (!clean) {
      setError('Veuillez saisir le mot de passe administrateur.');
      setIsLoading(false);
      return;
    }

    if (clean === ADMIN_PASSWORD || clean.toLowerCase() === 'fluxlien@gmail.com') {
      const res = loginUser('fluxlien@gmail.com', clean);
      if (res.success && res.user) {
        setSuccessMsg('Accès administrateur validé ! Redirection...');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(res.user!);
          onClose();
        }, 300);
        return;
      }
    }

    // Try fallback
    const fallbackRes = loginUser(clean, clean);
    if (fallbackRes.success && fallbackRes.user && fallbackRes.user.isAdmin) {
      setSuccessMsg('Accès validé !');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(fallbackRes.user!);
        onClose();
      }, 300);
      return;
    }

    setIsLoading(false);
    setError(`Mot de passe incorrect. Le mot de passe configuré est : ${ADMIN_PASSWORD}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(passwordInput);
  };

  const handleQuickUnlock = () => {
    setPasswordInput(ADMIN_PASSWORD);
    handleVerify(ADMIN_PASSWORD);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Espace Super-Administrateur
              </h2>
              <p className="text-[11px] text-amber-300">
                Direction WORLDORA & Exportateur ZIP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Mot de passe administrateur :</p>
              <p className="text-xs text-amber-800 font-mono font-semibold select-all mt-0.5 bg-amber-100/70 px-1.5 py-0.5 rounded inline-block">
                fluxlien@gmail.com
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                Saisissez ce mot de passe ou cliquez sur le bouton 1-clic ci-dessous pour déverrouiller l’accès total.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="fluxlien@gmail.com"
                  autoFocus
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Déverrouiller l'Administration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleQuickUnlock}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Connexion instantanée 1-clic (fluxlien@gmail.com)</span>
              </button>
            </div>
          </form>

          {/* Quick specs reminder */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Compte Admin :</span>
              <span className="font-semibold text-slate-700">fluxlien@gmail.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Régie Vidéo & Pubs :</span>
              <span className="text-emerald-700 font-medium">Opérationnelle</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Exportateur ZIP :</span>
              <span className="text-emerald-700 font-medium">Actif (Code complet)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
