import React, { useState, useMemo } from 'react';
import { Product, ProductFilterState, AdVideo } from '../../types';
import { ProductCard } from './ProductCard';
import { VideoAdCard } from '../videos/VideoAdCard';
import {
  CATEGORIES_LIST,
  COUNTRIES_LIST,
  HERO_IMAGE,
} from '../../data/seedData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MessageSquare,
  ShieldCheck,
  Building,
  RotateCcw,
  Film,
  Sparkles,
} from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  adVideos?: AdVideo[];
  onSelectProduct: (product: Product) => void;
  onContactSupplier: (product: Product) => void;
  onContactSupplierById?: (supplierId: string, productId?: string) => void;
  onNavigateAddProduct?: () => void;
  onNavigateVideos?: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  adVideos = [],
  onSelectProduct,
  onContactSupplier,
  onContactSupplierById,
  onNavigateVideos,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
  const [selectedCountry, setSelectedCountry] = useState('Tous les pays');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'moq-asc'>('recent');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'published') return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSupplier = p.supplierCompany?.toLowerCase().includes(q) || p.supplierName?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));

        if (!matchesName && !matchesDesc && !matchesCat && !matchesSupplier && !matchesBrand && !matchesTags) {
          return false;
        }
      }

      if (selectedCategory !== 'Toutes les catégories' && p.category !== selectedCategory) {
        return false;
      }

      if (selectedCountry !== 'Tous les pays' && p.countryOfOrigin !== selectedCountry) {
        return false;
      }

      if (minPrice !== '' && p.price < minPrice) {
        return false;
      }
      if (maxPrice !== '' && p.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'moq-asc') return a.minOrderQty - b.minOrderQty;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, search, selectedCategory, selectedCountry, sortBy, minPrice, maxPrice]);

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'Toutes les catégories' ||
    selectedCountry !== 'Tous les pays' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'recent';

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('Toutes les catégories');
    setSelectedCountry('Tous les pays');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('recent');
  };

  const activeAds = adVideos.filter((ad) => ad.status === 'active');

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* Mobile-Optimized Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden rounded-2xl mx-3 sm:mx-6 lg:mx-8 mt-3 border border-slate-800 shadow-md">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={HERO_IMAGE}
            alt="International B2B Trade"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl px-4 py-8 sm:px-12 sm:py-16">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Marketplace B2B Internationale & Vidéos Démonstrations</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Connectez vos approvisionnements au commerce mondial.
          </h1>

          <p className="mt-2 text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Découvrez matières premières et équipements industriels. Négociez en direct sans devis contraignant.
          </p>

          {/* Search bar inside Hero */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher : cacao, vannes inox, solaire..."
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {}}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg cursor-pointer shrink-0"
            >
              Rechercher
            </button>
          </div>

          {/* Quick Mobile Reel Shortcut */}
          {onNavigateVideos && activeAds.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={onNavigateVideos}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>Voir les pubs vidéos d'usines en plein écran ({activeAds.length}) →</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Content */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Categories Horizontal Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs transition-colors cursor-pointer font-medium ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Bar */}
        <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-xs text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[11px]">Origine :</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded-lg text-slate-800 bg-white text-xs"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[11px]">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1 border border-slate-200 rounded-lg text-slate-800 bg-white text-xs"
              >
                <option value="recent">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="moq-asc">Quantité min (MOQ)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 tabular-nums">
            <strong className="text-slate-900">{filteredProducts.length}</strong>{' '}
            {filteredProducts.length > 1 ? 'offres' : 'offre'}
          </div>
        </div>

        {/* Product Grid with Interleaved Video Ads ("exactement comme les produits") */}
        {filteredProducts.length === 0 ? (
          <div className="my-8 p-8 bg-white rounded-2xl border border-slate-200 text-center max-w-lg mx-auto">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Aucun produit ne correspond à vos critères</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Modifiez votre recherche ou réinitialisez les filtres.
            </p>
            <button
              onClick={resetFilters}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Voir tous les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
            {filteredProducts.map((product, index) => {
              // Interleave active video ad after every 2 or 3 products
              const shouldShowAd = activeAds.length > 0 && (index === 1 || index === 4);
              const adIndex = index === 1 ? 0 : 1;
              const adToShow = activeAds[adIndex % activeAds.length];

              return (
                <React.Fragment key={product.id}>
                  <ProductCard
                    product={product}
                    onSelect={onSelectProduct}
                    onContactSupplier={onContactSupplier}
                  />

                  {shouldShowAd && adToShow && (
                    <div className="sm:col-span-1 flex flex-col justify-center">
                      <VideoAdCard
                        ad={adToShow}
                        onContactSupplier={(supplierId, prodId) => {
                          if (onContactSupplierById) onContactSupplierById(supplierId, prodId);
                        }}
                        onViewProduct={(prodId) => {
                          const target = products.find((p) => p.id === prodId);
                          if (target) onSelectProduct(target);
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8">
          <div className="max-w-2xl mb-6">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Fonctionnement WORLDORA
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Messagerie directe & Démonstrations Usines
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Discutez en direct avec les fabricants vérifiés à l'international et regardez les départs de cargaisons en vidéo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs mb-2">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-900">Explorez le catalogue & les vidéos</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Parcourez les offres avec prix indicatifs, MOQ et démonstrations vidéos de fabrication.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs mb-2">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-900">Cliquez sur « Envoyer un message »</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ouvrez instantanément une discussion privée rattachée au produit concerné.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs mb-2">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-900">Négociez en direct</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ajustez volumes, Incoterms (FOB, CIF) et recevez fiches techniques et bons de commande.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
