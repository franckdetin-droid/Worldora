import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Building,
  HelpCircle,
} from 'lucide-react';
import {
  OFFICIAL_CONTACT_EMAIL,
  sendContactMessage,
  getSocialLinks,
} from '../../services/storageService';

interface ContactViewProps {
  onNavigateCatalog?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigateCatalog }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Demande d’information générale');
  const [message, setMessage] = useState('');

  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialLinks = getSocialLinks();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = sendContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (res.success) {
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      setError(res.error || 'Erreur lors de l’envoi de votre message.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Support & Relations Partenaires</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Contactez la direction WORLDORA B2B
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Notre équipe internationale vous accompagne pour vos importations, partenariats usines, régies publicitaires vidéo ou demandes spécifiques.
          </p>

          {/* Quick Direct Email Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200">
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-bold text-white select-all">
                {OFFICIAL_CONTACT_EMAIL}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier l’adresse Gmail'}</span>
            </button>

            <a
              href={`mailto:${OFFICIAL_CONTACT_EMAIL}?subject=Contact%20WORLDORA%20B2B`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir dans Gmail</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Envoyez-nous un message direct
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Remplissez le formulaire ci-dessous. Un responsable commercial ou technique vous répondra dans un délai de 24 heures ouvrées.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">
                Message envoyé avec succès !
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Votre demande a bien été transmise à notre service client à l'adresse <strong>{OFFICIAL_CONTACT_EMAIL}</strong>. Nous reviendrons vers vous très rapidement.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nom complet ou Entreprise *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Jean Dupont (SARL Import-Export)"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse e-mail professionnelle *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="directeur@votre-entreprise.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Téléphone / WhatsApp (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Objet de votre demande *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  >
                    <option value="Demande d’information générale">Demande d’information générale</option>
                    <option value="Partenariat Fournisseur / Exportateur">Partenariat Fournisseur / Exportateur</option>
                    <option value="Régie Publicitaire Vidéo & Bannières">Régie Publicitaire Vidéo & Bannières</option>
                    <option value="Support Acheteur & Commandes">Support Acheteur & Commandes</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Votre message *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet, vos volumes ou vos questions..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Envoyer le message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Coordinates & Social Media */}
        <div className="space-y-6">
          {/* Coordinates Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900">
              Coordonnées Officielles
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">E-mail Principal</span>
                  <a
                    href={`mailto:${OFFICIAL_CONTACT_EMAIL}`}
                    className="block font-bold text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    {OFFICIAL_CONTACT_EMAIL}
                  </a>
                  <span className="text-[10px] text-slate-500">Boîte de réception surveillée 7j/7</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Délai de Réponse</span>
                  <p className="font-semibold text-slate-800">Sous 24h ouvrées</p>
                  <span className="text-[10px] text-slate-500">Du lundi au samedi 08h - 19h (GMT+1)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Siège Mondial</span>
                  <p className="font-semibold text-slate-800">WORLDORA Global B2B</p>
                  <span className="text-[10px] text-slate-500">Paris (France) · Hub Export Abidjan & Dakar</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Confidentialité</span>
                  <p className="font-semibold text-slate-800">Protection RGPD & B2B</p>
                  <span className="text-[10px] text-slate-500">Vos échanges commerciaux sont strictement protégés.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Communauté Mondiale
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Suivez WORLDORA sur les réseaux
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Découvrez les coulisses des usines, les arrivages maritimes et les nouveautés du commerce international.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors text-slate-300 font-semibold"
                >
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center font-black text-blue-400 text-sm">f</span>
                  <span>Facebook</span>
                </a>
              )}

              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors text-slate-300 font-semibold"
                >
                  <span className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center font-black text-pink-400 text-xs">♬</span>
                  <span>TikTok</span>
                </a>
              )}

              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-pink-600 hover:text-white transition-colors text-slate-300 font-semibold"
                >
                  <span className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center font-black text-pink-400 text-xs">📸</span>
                  <span>Instagram</span>
                </a>
              )}

              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white transition-colors text-slate-300 font-semibold"
                >
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center font-black text-red-400 text-xs">▶</span>
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
