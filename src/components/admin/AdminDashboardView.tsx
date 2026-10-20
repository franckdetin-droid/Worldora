import React, { useState, useEffect, useRef } from 'react';
import { User, Product, AdVideo, VisitorCountryStat } from '../../types';
import {
  getAdVideos,
  createAdVideo,
  updateAdVideo,
  deleteAdVideo,
  getVisitorCountryStats,
  getAllUsersAdmin,
  getAllProductsAdmin,
  toggleUserVerification,
  toggleProductStatusAdmin,
} from '../../services/storageService';
import {
  CATEGORIES_LIST,
  COUNTRIES_LIST,
  COCOA_IMAGE,
  INDUSTRIAL_VALVES_IMAGE,
  SOLAR_PANELS_IMAGE,
} from '../../data/seedData';
import { readFileAsDataUrl } from '../../utils/fileUpload';
import {
  Globe,
  Film,
  PlusCircle,
  Users,
  Package,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Pause,
  Play,
  UploadCloud,
  Link as LinkIcon,
  Eye,
  MousePointer,
  AlertCircle,
  Smartphone,
  ChevronRight,
  Filter,
  Download,
  FileArchive,
} from 'lucide-react';
import { ProjectExportView } from './ProjectExportView';

interface AdminDashboardViewProps {
  currentUser: User;
  onLogout: () => void;
  onNavigateCatalog: () => void;
  onViewProductDetail: (product: Product) => void;
  initialSubTab?: 'analytics' | 'videos' | 'moderation' | 'export';
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onLogout,
  onNavigateCatalog,
  onViewProductDetail,
  initialSubTab = 'analytics',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'videos' | 'moderation' | 'export'>(initialSubTab);

  // Stats
  const [visitorStats, setVisitorStats] = useState<VisitorCountryStat[]>([]);
  const [adVideos, setAdVideos] = useState<AdVideo[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Video Ad Form
  const [adTitle, setAdTitle] = useState('');
  const [adBrand, setAdBrand] = useState('');
  const [adCategory, setAdCategory] = useState(CATEGORIES_LIST[1]);
  const [adCountry, setAdCountry] = useState("Côte d'Ivoire");
  const [adVideoUrl, setAdVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [adThumbnail, setAdThumbnail] = useState(COCOA_IMAGE);
  const [adDescription, setAdDescription] = useState('');
  const [adCtaText, setAdCtaText] = useState('Contacter le fournisseur');
  const [adTargetProductId, setAdTargetProductId] = useState('');
  const [adError, setAdError] = useState<string | null>(null);
  const [adSuccess, setAdSuccess] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const loadAdminData = () => {
    setVisitorStats(getVisitorCountryStats());
    setAdVideos(getAdVideos());
    setUsersList(getAllUsersAdmin());
    setProductsList(getAllProductsAdmin());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const totalVisitors = visitorStats.reduce((sum, s) => sum + s.visitors, 0);
  const totalVideoViews = adVideos.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalVideoClicks = adVideos.reduce((sum, a) => sum + (a.clicks || 0), 0);

  // Handle Video File Upload
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setAdError('Veuillez sélectionner un fichier vidéo valide (MP4, WebM).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setAdError('Le fichier vidéo ne doit pas dépasser 50 Mo.');
      return;
    }

    setIsUploadingVideo(true);
    setAdError(null);

    try {
      const processed = await readFileAsDataUrl(file);
      setAdVideoUrl(processed.url);
      setAdSuccess('Vidéo chargée avec succès dans l’aperçu !');
    } catch (err: any) {
      setAdError(err.message || 'Erreur lors du traitement de la vidéo.');
    } finally {
      setIsUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    setAdError(null);
    setAdSuccess(null);

    if (!adTitle.trim() || !adBrand.trim() || !adVideoUrl.trim()) {
      setAdError('Le titre, la marque du sponsor et la vidéo sont obligatoires.');
      return;
    }

    const res = createAdVideo({
      title: adTitle.trim(),
      brandName: adBrand.trim(),
      category: adCategory,
      country: adCountry,
      videoUrl: adVideoUrl.trim(),
      thumbnailUrl: adThumbnail,
      description: adDescription.trim(),
      ctaText: adCtaText.trim() || 'Contacter le fournisseur',
      ctaType: 'contact_supplier',
      targetProductId: adTargetProductId || undefined,
      status: 'active',
    });

    if (res.success) {
      setAdSuccess('Publicité vidéo enregistrée et activée sur le flux mobile WORLDORA !');
      setAdTitle('');
      setAdBrand('');
      setAdDescription('');
      loadAdminData();
    } else {
      setAdError(res.error || 'Erreur lors de la création de la publicité.');
    }
  };

  const handleToggleAdStatus = (ad: AdVideo) => {
    const newStatus = ad.status === 'active' ? 'paused' : 'active';
    updateAdVideo(ad.id, { status: newStatus });
    loadAdminData();
  };

  const handleDeleteAd = (id: string) => {
    if (confirm('Supprimer cette publicité vidéo ?')) {
      deleteAdVideo(id);
      loadAdminData();
    }
  };

  const handleToggleUserVerification = (userId: string) => {
    toggleUserVerification(userId);
    loadAdminData();
  };

  const handleToggleProductStatus = (productId: string) => {
    toggleProductStatusAdmin(productId);
    loadAdminData();
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-28 text-slate-900">
      {/* Mobile Top Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              W
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Espace Super-Admin
              </span>
              <h1 className="text-base sm:text-lg font-bold leading-none">
                Tableau de Bord Créateur
              </h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
          >
            Sortir
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Supervision mobile du trafic mondial, régie publicitaire vidéo et modération.
        </p>

        {/* Admin Credential Confirmation Badge */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Admin connecté : <strong className="text-white">fluxlien@gmail.com</strong></span>
          </div>
          <span className="text-amber-400 font-mono text-[10px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
            Mot de passe : fluxlien@gmail.com
          </span>
        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-4 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`py-2 px-0.5 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Trafic Pays</span>
          </button>

          <button
            onClick={() => setActiveSubTab('videos')}
            className={`py-2 px-0.5 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'videos'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Régie Vidéo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('moderation')}
            className={`py-2 px-0.5 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'moderation'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Modération</span>
          </button>

          <button
            onClick={() => setActiveSubTab('export')}
            className={`py-2 px-0.5 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'export'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Export ZIP</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ANALYTICS & VISITEURS PAR PAYS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4">
          {/* Key KPI summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Visiteurs Uniques
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                {totalVisitors.toLocaleString('fr-FR')}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                +19.4% ce mois-ci
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Vues Vidéos Pubs
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                {totalVideoViews.toLocaleString('fr-FR')}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {totalVideoClicks} clics sortants
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Comptes Utilisateurs
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                {usersList.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Acheteurs & Fabricants
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Offres Produits
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                {productsList.length}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {productsList.filter((p) => p.status === 'published').length} en ligne
              </div>
            </div>
          </div>

          {/* Visitors By Country Card (Phone-adapted representation) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <span>Répartition des Visiteurs par Pays</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Données de géolocalisation des acheteurs connectés sur WORLDORA.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                Temps Réel
              </span>
            </div>

            {/* Country list with visual percentage bars */}
            <div className="space-y-3 pt-1">
              {visitorStats.map((item) => (
                <div key={item.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.country}</span>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="text-[11px] font-bold text-slate-800">
                        {item.visitors.toLocaleString('fr-FR')} visites
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {item.growth}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Part du trafic international</span>
                    <span className="font-semibold text-slate-600">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GESTIONNAIRE DE VIDÉOS PUBLICITAIRES */}
      {activeSubTab === 'videos' && (
        <div className="space-y-4">
          {/* Add Video Ad Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-500" />
                <span>Publier une Vidéo Publicitaire B2B</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Uploadez une vidéo de votre smartphone ou collez un lien direct. Elle apparaîtra dans le flux mobile des acheteurs comme un produit interactif.
              </p>
            </div>

            {adError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{adError}</span>
              </div>
            )}

            {adSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{adSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre de la publicité vidéo *
                </label>
                <input
                  type="text"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="Ex: Ligne d'emballage et export cacao en direct"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Entreprise / Sponsor *
                  </label>
                  <input
                    type="text"
                    value={adBrand}
                    onChange={(e) => setAdBrand(e.target.value)}
                    placeholder="Nom du fournisseur"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pays *
                  </label>
                  <select
                    value={adCountry}
                    onChange={(e) => setAdCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {COUNTRIES_LIST.filter((c) => c !== 'Tous les pays').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catégorie du produit sponsorisé
                </label>
                <select
                  value={adCategory}
                  onChange={(e) => setAdCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {CATEGORIES_LIST.filter((c) => c !== 'Toutes les catégories').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* VIDEO SOURCE: Direct Phone Upload OR Web Link */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-900">
                  Fichier vidéo (Upload smartphone ou URL) *
                </label>

                {/* Upload Button */}
                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-xl bg-slate-50 text-center cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    onChange={handleVideoFileChange}
                    accept="video/mp4,video/webm"
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-800 block">
                    {isUploadingVideo ? 'Chargement en cours...' : 'Uploader une vidéo depuis votre téléphone'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Format MP4 / WebM (max 50 Mo)
                  </span>
                </div>

                {/* Or paste link */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    Ou collez le lien direct de la vidéo :
                  </span>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={adVideoUrl}
                      onChange={(e) => setAdVideoUrl(e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Quick video samples */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 w-full">Vidéos de démonstration rapides :</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      setAdThumbnail(COCOA_IMAGE);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Cargaison Portuaire
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4');
                      setAdThumbnail(INDUSTRIAL_VALVES_IMAGE);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Usine Haute Pression
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4');
                      setAdThumbnail(SOLAR_PANELS_IMAGE);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Ligne Robotisée Solaire
                  </button>
                </div>
              </div>

              {/* Action Button & Link to Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texte du bouton CTA *
                  </label>
                  <input
                    type="text"
                    value={adCtaText}
                    onChange={(e) => setAdCtaText(e.target.value)}
                    placeholder="Ex: Envoyer un message au fournisseur"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Associer à un produit (facultatif)
                  </label>
                  <select
                    value={adTargetProductId}
                    onChange={(e) => setAdTargetProductId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Aucun produit spécifique</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.supplierCompany})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description courte de la publicité
                </label>
                <textarea
                  rows={2}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="Détails du reportage, volume d'export ou certification présentée..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Live Preview Box */}
              {adVideoUrl && (
                <div className="p-3 bg-slate-950 text-white rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Aperçu vidéo en direct :
                  </span>
                  <div className="aspect-16/9 rounded-lg overflow-hidden bg-black">
                    <video
                      src={adVideoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Diffuser la vidéo publicitaire
              </button>
            </form>
          </div>

          {/* List of active Video Ads */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Vidéos Publicitaires Actives ({adVideos.length})
            </h3>

            {adVideos.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Aucune publicité vidéo enregistrée pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {adVideos.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              ad.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {ad.status === 'active' ? 'En diffusion' : 'En pause'}
                          </span>
                          <span className="text-[10px] text-slate-500">{ad.country}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {ad.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 truncate">{ad.brandName}</p>
                      </div>

                      {/* Video Thumbnail */}
                      {ad.thumbnailUrl && (
                        <img
                          src={ad.thumbnailUrl}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 tabular-nums">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{ad.views}</strong> vues
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{ad.clicks}</strong> clics
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleAdStatus(ad)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer"
                          title={ad.status === 'active' ? 'Mettre en pause' : 'Réactiver'}
                        >
                          {ad.status === 'active' ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                          title="Supprimer la vidéo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MODÉRATION DES FOURNISSEURS ET PRODUITS */}
      {activeSubTab === 'moderation' && (
        <div className="space-y-4">
          {/* Suppliers moderation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Fournisseurs & Certification ({usersList.length})</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Attribuez ou retirez le badge « Fournisseur Vérifié » en 1 clic.
            </p>

            <div className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <div key={u.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{u.name}</span>
                      {u.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 rounded font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{u.companyName} · {u.country}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleUserVerification(u.id)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 ${
                      u.verified
                        ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {u.verified ? 'Dévérifier' : 'Certifier'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Products Moderation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-500" />
              <span>Contrôle des Produits ({productsList.length})</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {productsList.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{p.name}</span>
                      <span
                        className={`text-[9px] font-semibold px-1.5 rounded-full ${
                          p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {p.status === 'published' ? 'En ligne' : 'Brouillon'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{p.supplierCompany} · {p.price} {p.currency}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleProductStatus(p.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer shrink-0"
                  >
                    {p.status === 'published' ? 'Masquer' : 'Publier'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EXPORTATEUR DU PROJET WORLDORA */}
      {activeSubTab === 'export' && (
        <ProjectExportView
          currentUser={currentUser}
          onBackToDashboard={() => setActiveSubTab('analytics')}
        />
      )}
    </div>
  );
};
