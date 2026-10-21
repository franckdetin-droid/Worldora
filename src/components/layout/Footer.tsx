import React from 'react';
import { ShieldCheck, MessageSquare, Globe2, Truck, Lock } from 'lucide-react';
import { getSocialLinks } from '../../services/storageService';

interface FooterProps {
  onNavigate?: (view: 'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const socialLinks = getSocialLinks();
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust pillars strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Messagerie Directe</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Échangez sans intermédiaire avec les fournisseurs pour négocier prix et délais.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fournisseurs Contrôlés</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Vérification des profils d'entreprises, licences d'export et conformité légale.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Commerce International</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Exportateurs et importateurs d'Afrique, d'Europe, d'Asie et des Amériques.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Incoterms Flexibles</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Accords FOB, CIF, EXW ou DDP adaptés aux volumes et contraintes logistiques.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-950 font-bold text-base">
                W
              </div>
              <span className="text-xl font-bold tracking-tight text-white">WORLDORA</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 max-w-md leading-relaxed">
              WORLDORA est la place de marché B2B nouvelle génération dédiée aux échanges commerciaux directs entre acheteurs professionnels et fabricants certifiés à travers le monde.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              Plateforme responsive certifiée pour ordinateur, tablette et smartphone Android.
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Plateforme</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('videos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vidéos & Démonstrations Usines
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Catalogue Général</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Agroalimentaire & Matières premières</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Équipements Industriels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Énergie & Photovoltaïque</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Informations Légales</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('contact')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  Nous contacter (ggh52167@gmail.com)
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Conditions Générales d'Utilisation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sécurité des Échanges & Données</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Signaler un abus ou litige</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media Channels Row */}
        <div className="py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-white">Réseaux Sociaux Officiels :</span>
            <span>Rejoignez la communauté WORLDORA</span>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center font-bold text-sm shadow-xs"
                title="Facebook WORLDORA"
              >
                f
              </a>
            )}
            {socialLinks.tiktok && (
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center font-bold text-xs shadow-xs"
                title="TikTok WORLDORA"
              >
                ♬
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center font-bold text-sm shadow-xs"
                title="Instagram WORLDORA"
              >
                📸
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center font-bold text-xs shadow-xs"
                title="YouTube WORLDORA"
              >
                ▶
              </a>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WORLDORA B2B Marketplace. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('contact')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Contact Direct
            </button>
            <span>·</span>
            <span>Français (FR)</span>
            <span>·</span>
            <span>EUR (€)</span>
            <span>·</span>
            <span>HTTPS Sécurisé</span>
            {onNavigate && (
              <>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-400 text-slate-500 transition-colors cursor-pointer inline-flex items-center gap-1"
                  title="Accéder à la console d'administration (/admin)"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Admin (/admin)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
