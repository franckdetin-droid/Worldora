import React from 'react';
import { ShieldCheck, MessageSquare, Globe2, Truck } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Espace Super-Admin & Export ZIP</span>
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
              <li><a href="#" className="hover:text-white transition-colors">Conditions Générales d'Utilisation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sécurité des Échanges & Données</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Signaler un abus ou litige</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support & Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WORLDORA B2B Marketplace. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Français (FR)</span>
            <span>·</span>
            <span>EUR (€)</span>
            <span>·</span>
            <span>HTTPS Sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
