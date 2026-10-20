import React, { useState } from 'react';
import { X, Lock, Mail, Building, MapPin, UserCheck, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { AccountType, User } from '../../types';
import { loginUser, registerUser, ADMIN_PASSWORD } from '../../services/storageService';
import { COUNTRIES_LIST } from '../../data/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  redirectNotice?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  redirectNotice,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminCode, setAdminCode] = useState('fluxlien@gmail.com');

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('buyer');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('France');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If admin password fluxlien@gmail.com or admin email is entered
    const isTargetingAdmin =
      loginPassword.trim() === 'fluxlien@gmail.com' ||
      loginEmail.toLowerCase().trim() === 'fluxlien@gmail.com' ||
      loginEmail.toLowerCase().trim() === 'admin@worldora.com';

    if (isTargetingAdmin) {
      const result = loginUser('fluxlien@gmail.com', 'fluxlien@gmail.com');
      if (result.success && result.user) {
        onSuccess(result.user);
        onClose();
        return;
      }
    }

    if (!loginEmail.trim()) {
      setError('Veuillez saisir votre adresse e-mail ou mot de passe administrateur.');
      return;
    }

    const result = loginUser(loginEmail, loginPassword);
    if (result.success && result.user) {
      onSuccess(result.user);
      onClose();
    } else {
      setError(result.error || 'Identifiants incorrects.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom complet est obligatoire.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (!companyName.trim()) {
      setError('Le nom de votre entreprise ou raison sociale est obligatoire.');
      return;
    }
    if (!country.trim()) {
      setError('Le pays est obligatoire.');
      return;
    }
    if (!city.trim()) {
      setError('La ville est obligatoire.');
      return;
    }

    const result = registerUser({
      name,
      email,
      password,
      accountType,
      companyName,
      country,
      city,
      description,
      phone,
    });

    if (result.success && result.user) {
      onSuccess(result.user);
      onClose();
    } else {
      setError(result.error || 'Erreur lors de la création du compte.');
    }
  };

  const handleQuickDemo = (emailToLogin: string) => {
    setError(null);
    const result = loginUser(emailToLogin);
    if (result.success && result.user) {
      onSuccess(result.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white text-slate-900 font-bold flex items-center justify-center text-sm">
              W
            </div>
            <span className="font-bold text-base tracking-tight">WORLDORA B2B</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice if redirected from action */}
        {redirectNotice && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{redirectNotice}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Créer un compte
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'admin'
                ? 'bg-amber-500 text-slate-950 border-b-2 border-amber-600'
                : 'text-amber-700 bg-amber-50/60 hover:bg-amber-100 hover:text-amber-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Admin</span>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'admin' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">Mot de passe Administrateur :</p>
                  <p className="text-xs text-amber-800 font-mono font-bold select-all mt-0.5 bg-amber-100/70 px-1.5 py-0.5 rounded inline-block">
                    fluxlien@gmail.com
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1">
                    Accès complet réservé au créateur : Régie Vidéos, Trafic mondial par pays et Exportateur ZIP complet.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe Administrateur
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="fluxlien@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    const res = loginUser('fluxlien@gmail.com', adminCode);
                    if (res.success && res.user) {
                      onSuccess(res.user);
                      onClose();
                    } else {
                      setError(res.error || 'Mot de passe incorrect.');
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Valider le mot de passe et entrer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('fluxlien@gmail.com')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Connexion instantanée (fluxlien@gmail.com)</span>
                </button>
              </div>
            </div>
          ) : mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse e-mail professionnelle
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="directeur.achats@entreprise.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Connexion sécurisée
              </button>

              {/* Quick Demo Switcher */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Accès rapides pré-configurés (1 clic) :
                </p>
                <div className="mb-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('fluxlien@gmail.com')}
                    className="w-full text-left p-2.5 rounded-lg border-2 border-amber-500 bg-amber-50/70 hover:bg-amber-100 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        <span>Super-Admin (Créateur du site)</span>
                      </div>
                      <div className="text-[11px] text-amber-800 font-mono mt-0.5">
                        Mot de passe : fluxlien@gmail.com
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-950 bg-amber-300 px-2.5 py-1 rounded-md">
                      Accès Total →
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('acheteur@worldora-demo.com')}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900">Marc Dupont</div>
                    <div className="text-[11px] text-slate-500">Acheteur (Euro-Distribution)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('amadou.diallo@agro-sahel.com')}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900">Amadou Diallo</div>
                    <div className="text-[11px] text-slate-500">Fournisseur (Agro Cacao CI)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('jl.mercier@rhone-valves.fr')}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900">Jean-Luc Mercier</div>
                    <div className="text-[11px] text-slate-500">Fournisseur (Industrie FR)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('fatou@atlantic-trade.sn')}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900">Fatou Ndiaye</div>
                    <div className="text-[11px] text-slate-500">Acheteur & Fournisseur (SN)</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type de compte
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('buyer')}
                    className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      accountType === 'buyer'
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Acheteur
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('supplier')}
                    className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      accountType === 'supplier'
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Fournisseur
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('both')}
                    className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      accountType === 'both'
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Les deux
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail professionnel *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@societe.com"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe sécurisé (min. 6 caractères) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de l'entreprise / Raison sociale *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Sahara Agro Export SA"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pays *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {COUNTRIES_LIST.filter((c) => c !== 'Tous les pays').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paris, Abidjan, Dakar..."
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone professionnel (facultatif)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 1 00 00 00 00"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Présentation de l'entreprise
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Activités principales, certifications, capacités de production..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-sm mt-2"
              >
                Finaliser l'inscription B2B
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
