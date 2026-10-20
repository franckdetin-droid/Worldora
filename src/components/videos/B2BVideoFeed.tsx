import React, { useState } from 'react';
import { AdVideo } from '../../types';
import { VideoAdCard } from './VideoAdCard';
import { CATEGORIES_LIST } from '../../data/seedData';
import { Sparkles, Film, Filter } from 'lucide-react';

interface B2BVideoFeedProps {
  ads: AdVideo[];
  onContactSupplier: (supplierId: string, productId?: string) => void;
  onViewProduct: (productId: string) => void;
}

export const B2BVideoFeed: React.FC<B2BVideoFeedProps> = ({
  ads,
  onContactSupplier,
  onViewProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');

  const filteredAds = ads.filter((ad) => {
    if (ad.status !== 'active') return false;
    if (selectedCategory !== 'Toutes les catégories' && ad.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Mobile-friendly Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Film className="w-4 h-4" />
          <span>Vidéos & Démonstrations Usines</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          Publicités & Reportages B2B
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Découvrez les coulisses de fabrication, les tests qualité et les départs de cargaisons en vidéo.
        </p>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 scrollbar-none text-xs">
          {CATEGORIES_LIST.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos List / Continuous Roll */}
      {filteredAds.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <Film className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Aucune vidéo dans cette catégorie</h3>
          <p className="text-xs text-slate-500 mt-1">
            Les annonces vidéos diffusées par les exportateurs certifiés s'afficheront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAds.map((ad, idx) => (
            <div key={ad.id} className="space-y-2">
              <VideoAdCard
                ad={ad}
                onContactSupplier={onContactSupplier}
                onViewProduct={onViewProduct}
                autoPlay={idx === 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
