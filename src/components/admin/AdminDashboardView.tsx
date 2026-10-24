import React, { useState, useEffect, useRef } from 'react';
import { User, Product, AdVideo, VisitorCountryStat, AdBanner, SocialLinks, ContactMessage, ApkConfig } from '../../types';
import {
  getAdVideos,
  createAdVideo,
  updateAdVideo,
  deleteAdVideo,
  incrementVideoViews,
  getVisitorCountryStats,
  getAllUsersAdmin,
  getAllProductsAdmin,
  toggleUserVerification,
  toggleProductStatusAdmin,
  resetAllSiteDataToZero,
  getAdBanners,
  createAdBanner,
  updateAdBanner,
  deleteAdBanner,
  getSocialLinks,
  saveSocialLinks,
  getContactMessages,
  markContactMessageStatus,
  OFFICIAL_CONTACT_EMAIL,
  getApkConfig,
  saveApkConfig,
  triggerApkDownload,
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
  RotateCcw,
  Heart,
  MessageCircle,
  Share2,
  X,
  Sparkles,
  Layout,
  Mail,
  Send,
  ExternalLink,
} from 'lucide-react';
import { ProjectExportView } from './ProjectExportView';
import { WorldoraLogo } from '../common/WorldoraLogo';

interface AdminDashboardViewProps {
  currentUser: User;
  onLogout: () => void;
  onNavigateCatalog: () => void;
  onViewProductDetail: (product: Product) => void;
  initialSubTab?: 'analytics' | 'videos' | 'banners' | 'apk' | 'socials' | 'moderation' | 'export';
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onLogout,
  onNavigateCatalog,
  onViewProductDetail,
  initialSubTab = 'analytics',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'analytics' | 'videos' | 'banners' | 'apk' | 'socials' | 'moderation' | 'export'
  >(initialSubTab);

  // Stats
  const [visitorStats, setVisitorStats] = useState<VisitorCountryStat[]>([]);
  const [adVideos, setAdVideos] = useState<AdVideo[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Video Preview Modal State
  const [previewVideo, setPreviewVideo] = useState<AdVideo | null>(null);

  // Banners List & Form State
  const [bannersList, setBannersList] = useState<AdBanner[]>([]);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('OFFRE SPÉCIALE');
  const [bannerPosition, setBannerPosition] = useState<'top' | 'middle'>('top');
  const [bannerImageUrl, setBannerImageUrl] = useState('https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=1200');
  const [bannerCtaText, setBannerCtaText] = useState('Découvrir l’offre');
  const [bannerLinkType, setBannerLinkType] = useState<'video' | 'product' | 'contact' | 'external'>('contact');
  const [bannerTargetId, setBannerTargetId] = useState('');
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Social Links State
  const [socialFb, setSocialFb] = useState('');
  const [socialTiktok, setSocialTiktok] = useState('');
  const [socialInsta, setSocialInsta] = useState('');
  const [socialYt, setSocialYt] = useState('');
  const [socialSuccess, setSocialSuccess] = useState<string | null>(null);

  // Contact Messages State
  const [contactMsgs, setContactMsgs] = useState<ContactMessage[]>([]);

  // Android APK Configuration State
  const [apkDownloadUrl, setApkDownloadUrl] = useState('');
  const [apkVersion, setApkVersion] = useState('1.0.0');
  const [apkFileName, setApkFileName] = useState('worldora-b2b.apk');
  const [apkEnabled, setApkEnabled] = useState(true);
  const [apkSuccess, setApkSuccess] = useState<string | null>(null);
  const [apkError, setApkError] = useState<string | null>(null);
  const [isUploadingApkFile, setIsUploadingApkFile] = useState(false);
  const apkFileInputRef = useRef<HTMLInputElement>(null);

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
    setBannersList(getAdBanners());
    setContactMsgs(getContactMessages());
    const social = getSocialLinks();
    setSocialFb(social.facebook || '');
    setSocialTiktok(social.tiktok || '');
    setSocialInsta(social.instagram || '');
    setSocialYt(social.youtube || '');
    const apkCfg = getApkConfig();
    setApkDownloadUrl(apkCfg.downloadUrl || '');
    setApkVersion(apkCfg.version || '1.0.0');
    setApkFileName(apkCfg.fileName || 'worldora-b2b.apk');
    setApkEnabled(apkCfg.enabled !== false);
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

  // Handle Open Video Preview Modal
  const handleOpenVideoPreview = (video: AdVideo) => {
    setPreviewVideo(video);
    incrementVideoViews(video.id);
    loadAdminData();
  };

  // Handle Banner Image File Upload
  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setBannerError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingBannerImage(true);
    setBannerError(null);
    try {
      const processed = await readFileAsDataUrl(file);
      setBannerImageUrl(processed.url);
    } catch {
      setBannerError('Erreur lors du téléversement de l’image.');
    } finally {
      setIsUploadingBannerImage(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = '';
    }
  };

  // Handle Create Banner Submit
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    setBannerError(null);
    setBannerSuccess(null);

    if (!bannerTitle.trim()) {
      setBannerError('Le titre de la bannière est obligatoire.');
      return;
    }
    if (!bannerImageUrl.trim()) {
      setBannerError('L’image de la bannière est obligatoire.');
      return;
    }

    const res = createAdBanner({
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim(),
      badgeText: bannerBadge.trim() || 'OFFRE SPÉCIALE',
      position: bannerPosition,
      imageUrl: bannerImageUrl.trim(),
      ctaText: bannerCtaText.trim() || 'Découvrir',
      linkType: bannerLinkType,
      targetId: bannerTargetId || undefined,
      status: 'active',
    });

    if (res.success) {
      setBannerSuccess('Bannière publicitaire défilante créée et mise en ligne avec succès !');
      setBannerTitle('');
      setBannerSubtitle('');
      loadAdminData();
      setTimeout(() => setBannerSuccess(null), 4000);
    } else {
      setBannerError(res.error || 'Erreur lors de la création de la bannière.');
    }
  };

  const handleToggleBannerStatus = (banner: AdBanner) => {
    updateAdBanner(banner.id, {
      status: banner.status === 'active' ? 'paused' : 'active',
    });
    loadAdminData();
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('Voulez-vous supprimer cette bannière publicitaire ?')) {
      deleteAdBanner(id);
      loadAdminData();
    }
  };

  // Handle Save Social Links
  const handleSaveSocialLinks = (e: React.FormEvent) => {
    e.preventDefault();
    setSocialSuccess(null);
    saveSocialLinks({
      facebook: socialFb.trim() || undefined,
      tiktok: socialTiktok.trim() || undefined,
      instagram: socialInsta.trim() || undefined,
      youtube: socialYt.trim() || undefined,
    });
    setSocialSuccess('Liens des réseaux sociaux enregistrés et synchronisés en bas de page !');
    setTimeout(() => setSocialSuccess(null), 4000);
  };

  // Handle Save APK Config
  const handleSaveApkConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setApkError(null);
    setApkSuccess(null);

    saveApkConfig({
      downloadUrl: apkDownloadUrl.trim(),
      version: apkVersion.trim() || '1.0.0',
      fileName: apkFileName.trim() || 'worldora-b2b.apk',
      enabled: apkEnabled,
    });
    setApkSuccess('Lien et configuration de l’APK Android enregistrés avec succès ! Le bouton est mis à jour en haut du catalogue et dans la barre de navigation.');
    setTimeout(() => setApkSuccess(null), 4000);
  };

  const handleApkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingApkFile(true);
    setApkError(null);
    setApkSuccess(null);

    try {
      const processed = await readFileAsDataUrl(file);
      setApkDownloadUrl(processed.url);
      setApkFileName(processed.name);
      saveApkConfig({
        downloadUrl: processed.url,
        fileName: processed.name,
        version: apkVersion || '1.0.0',
        enabled: true,
      });
      setApkSuccess(`Fichier APK « ${file.name} » (${(file.size / (1024 * 1024)).toFixed(2)} Mo) chargé et enregistré !`);
      setTimeout(() => setApkSuccess(null), 4000);
    } catch {
      setApkError('Erreur lors du téléversement du fichier APK.');
    } finally {
      setIsUploadingApkFile(false);
      if (apkFileInputRef.current) apkFileInputRef.current.value = '';
    }
  };

  const handleTestApk = () => {
    try {
      const res = triggerApkDownload();
      alert(res.message);
    } catch {
      alert('Erreur lors du test de téléchargement.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-28 text-slate-900">
      {/* Mobile Top Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <WorldoraLogo size="sm" lightMode showText={false} />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Espace Super-Admin
              </span>
              <h1 className="text-base sm:text-lg font-bold leading-none">
                Tableau de Bord Créateur
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Voulez-vous remettre toutes les données du site à zéro ? (0 produit, 0 vidéo, 0 message, 0 visiteur)')) {
                  resetAllSiteDataToZero();
                  loadAdminData();
                  alert('Toutes les données du site ont été remises à zéro.');
                }
              }}
              className="text-[10px] sm:text-xs text-rose-300 hover:text-white px-2 py-1 rounded bg-rose-950/80 border border-rose-800/80 cursor-pointer flex items-center gap-1 font-semibold"
              title="Remettre toutes les données à zéro"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Reset 0</span>
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
            >
              Sortir
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Supervision mobile du trafic mondial, régie publicitaire vidéo et modération.
        </p>

        {/* Admin Credential Confirmation Badge */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Session sécurisée : <strong className="text-white">fluxlien@gmail.com</strong></span>
          </div>
          <span className="text-emerald-400 font-medium text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Accès Protégé Actif</span>
          </span>
        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 mt-4 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
              activeSubTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Trafic</span>
          </button>

          <button
            onClick={() => setActiveSubTab('videos')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
              activeSubTab === 'videos'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Vidéos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('banners')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
              activeSubTab === 'banners'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Bannières</span>
          </button>

          <button
            onClick={() => setActiveSubTab('apk')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
              activeSubTab === 'apk'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">App APK</span>
          </button>

          <button
            onClick={() => setActiveSubTab('socials')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
              activeSubTab === 'socials'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Réseaux</span>
          </button>

          <button
            onClick={() => setActiveSubTab('moderation')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
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
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors cursor-pointer text-[10px] sm:text-xs flex flex-col items-center justify-center gap-1 ${
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

                    {/* Direct Click to Open & Play Video */}
                    <button
                      type="button"
                      onClick={() => handleOpenVideoPreview(ad)}
                      className="w-full py-2 px-3 bg-amber-500/15 hover:bg-amber-500 text-amber-950 font-bold border border-amber-300 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-amber-700" />
                      <span>▶️ Ouvrir et visionner la vidéo</span>
                    </button>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-4 gap-1 p-2 bg-white rounded-lg border border-slate-200 text-center">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Vues</span>
                        <span className="text-xs font-black text-slate-900 flex items-center justify-center gap-0.5">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {ad.views}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Clics</span>
                        <span className="text-xs font-black text-blue-600 flex items-center justify-center gap-0.5">
                          <MousePointer className="w-3 h-3 text-blue-500" />
                          {ad.clicks}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">J'aime</span>
                        <span className="text-xs font-black text-rose-600 flex items-center justify-center gap-0.5">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                          {ad.likes || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Avis</span>
                        <span className="text-xs font-black text-indigo-600 flex items-center justify-center gap-0.5">
                          <MessageCircle className="w-3 h-3 text-indigo-500" />
                          {ad.comments?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* CTR & Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                      <div className="text-[10px] text-slate-500 font-medium">
                        CTR (Taux de clic) :{' '}
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {(((ad.clicks || 0) / Math.max(1, ad.views || 0)) * 100).toFixed(1)}%
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

      {/* SUB-TAB: BANNIÈRES PUBLICITAIRES DÉFILANTES DU CATALOGUE */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          {/* Create Banner Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-amber-500" />
                  <span>Ajouter une Bannière Défilante (Pub)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Publiez des bannières publicitaires animées qui défilent automatiquement dans le catalogue des produits.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateCatalog}
                className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Voir le catalogue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {bannerError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{bannerError}</span>
              </div>
            )}

            {bannerSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{bannerSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateBanner} className="space-y-3">
              {/* Image Upload or URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-900">
                  Image de la bannière (Upload smartphone ou URL) *
                </label>

                <div
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-xl bg-slate-50 text-center cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-800 block">
                    {isUploadingBannerImage ? 'Téléversement...' : 'Uploader une image depuis votre appareil'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Format paysage recommandé (JPG, PNG, WebP)
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">
                    Ou collez le lien direct de l'image :
                  </span>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={bannerImageUrl}
                      onChange={(e) => setBannerImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Banner presets */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 w-full">Photos d'illustration rapides :</span>
                  <button
                    type="button"
                    onClick={() => setBannerImageUrl('https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=1200')}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Cargo & Cacao
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImageUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200')}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Usine Haute Pression
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImageUrl('https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=1200')}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Énergie Solaire
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImageUrl('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200')}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Entrepôt Logistique
                  </button>
                </div>
              </div>

              {/* Position & Badge */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emplacement dans le catalogue *
                  </label>
                  <select
                    value={bannerPosition}
                    onChange={(e) => setBannerPosition(e.target.value as 'top' | 'middle')}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="top">1. Haut du catalogue (sous recherche)</option>
                    <option value="middle">2. Milieu du catalogue (entre produits)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Badge de la bannière
                  </label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={(e) => setBannerBadge(e.target.value)}
                    placeholder="Ex: OFFRE SPÉCIALE B2B"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre de la bannière *
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Ex: -15% sur les commandes groupées de matières premières"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sous-titre / Description
                </label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Ex: Fournisseurs certifiés ISO, livraison portuaire garantie"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* CTA & Target Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texte du bouton CTA *
                  </label>
                  <input
                    type="text"
                    value={bannerCtaText}
                    onChange={(e) => setBannerCtaText(e.target.value)}
                    placeholder="Ex: Découvrir l'offre"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Action lors du clic *
                  </label>
                  <select
                    value={bannerLinkType}
                    onChange={(e) => setBannerLinkType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="contact">Page Nous Contacter (ggh52167@gmail.com)</option>
                    <option value="video">Ouvrir le flux des vidéos publicitaires</option>
                    <option value="product">Lier à un produit spécifique</option>
                    <option value="external">Lien web externe</option>
                  </select>
                </div>
              </div>

              {bannerLinkType === 'product' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sélectionner le produit cible :
                  </label>
                  <select
                    value={bannerTargetId}
                    onChange={(e) => setBannerTargetId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="">Sélectionner un produit</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.supplierCompany})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {bannerLinkType === 'external' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL externe :
                  </label>
                  <input
                    type="url"
                    value={bannerTargetId}
                    onChange={(e) => setBannerTargetId(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              )}

              {/* Banner Live Preview */}
              {bannerImageUrl && (
                <div className="p-3 bg-slate-950 text-white rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Aperçu visuel de la bannière :
                  </span>
                  <div className="relative rounded-lg overflow-hidden h-28 bg-slate-900 border border-slate-800 flex items-center">
                    <img
                      src={bannerImageUrl}
                      alt="Aperçu"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="relative z-10 p-3 max-w-[80%]">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/60 inline-block mb-1">
                        {bannerBadge || 'ANNONCE'}
                      </span>
                      <h4 className="text-xs font-black text-white leading-tight line-clamp-1">
                        {bannerTitle || 'Titre de la bannière'}
                      </h4>
                      <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                        {bannerSubtitle || 'Sous-titre descriptif de l\'annonce...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier la bannière défilante</span>
              </button>
            </form>
          </div>

          {/* List of Existing Banners */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Bannières Défilantes en Ligne ({bannersList.length})
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  Haut: {bannersList.filter((b) => b.position === 'top').length}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                  Milieu: {bannersList.filter((b) => b.position === 'middle').length}
                </span>
              </div>
            </div>

            {bannersList.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Aucune bannière enregistrée. Créez-en une ci-dessus pour la faire défiler dans le catalogue.
              </p>
            ) : (
              <div className="space-y-3">
                {bannersList.map((banner) => (
                  <div
                    key={banner.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              banner.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {banner.status === 'active' ? 'Active (Défilante)' : 'En pause'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.2 rounded">
                            {banner.position === 'top' ? '📍 Position Haut' : '📍 Position Milieu'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                          {banner.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{banner.subtitle}</p>
                      </div>

                      <img
                        src={banner.imageUrl}
                        alt=""
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    </div>

                    {/* Stats & Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 tabular-nums">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <strong>{banner.impressions}</strong> affichages
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3.5 h-3.5 text-blue-500" />
                          <strong>{banner.clicks}</strong> clics
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleBannerStatus(banner)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer"
                          title={banner.status === 'active' ? 'Mettre en pause' : 'Réactiver'}
                        >
                          {banner.status === 'active' ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                          title="Supprimer la bannière"
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

      {/* SUB-TAB: APPLICATION MOBILE ANDROID (FICHIER & LIEN APK) */}
      {activeSubTab === 'apk' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Gestion du Téléchargement APK Android</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Renseignez le lien de téléchargement direct ou téléversez le package d'installation APK. Le bouton « Télécharger APK » s'affiche en haut du catalogue et dans l'en-tête du site.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateCatalog}
                className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Voir sur le catalogue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {apkError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{apkError}</span>
              </div>
            )}

            {apkSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{apkSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveApkConfig} className="space-y-4">
              {/* Method 1: Web Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lien de téléchargement direct de l'APK (URL web) :
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={apkDownloadUrl.startsWith('data:') ? '' : apkDownloadUrl}
                    onChange={(e) => setApkDownloadUrl(e.target.value)}
                    placeholder="https://.../worldora.apk (ex: Google Drive direct, MediaFire, Cloud Storage)"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Collez le lien direct vers le fichier .apk hébergé en ligne.
                </p>
              </div>

              {/* Method 2: Direct File Upload */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-900">
                  Ou téléversez directement le fichier .apk depuis votre appareil :
                </label>

                <div
                  onClick={() => apkFileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 text-center cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    ref={apkFileInputRef}
                    onChange={handleApkFileChange}
                    accept=".apk,application/vnd.android.package-archive"
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-800 block">
                    {isUploadingApkFile ? 'Téléversement en cours...' : 'Sélectionner un fichier .apk (Smartphone / PC)'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Format binaire Android APK
                  </span>
                </div>

                {apkDownloadUrl.startsWith('data:') && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                    <span className="font-medium truncate">
                      📦 Fichier APK intégré localement : <strong>{apkFileName}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setApkDownloadUrl('')}
                      className="text-rose-600 hover:underline text-[11px] font-semibold cursor-pointer shrink-0 ml-2"
                    >
                      Effacer
                    </button>
                  </div>
                )}
              </div>

              {/* Version & File Name */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom du fichier téléchargé :
                  </label>
                  <input
                    type="text"
                    value={apkFileName}
                    onChange={(e) => setApkFileName(e.target.value)}
                    placeholder="worldora-b2b.apk"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de version :
                  </label>
                  <input
                    type="text"
                    value={apkVersion}
                    onChange={(e) => setApkVersion(e.target.value)}
                    placeholder="1.0.0"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Enable Toggle */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="apkEnabledToggle"
                  checked={apkEnabled}
                  onChange={(e) => setApkEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="apkEnabledToggle" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Activer et afficher le bouton « Télécharger APK » sur le catalogue et l'en-tête
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Enregistrer la configuration APK</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestApk}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-300 flex items-center justify-center gap-1.5 shrink-0"
                  title="Déclencher immédiatement le téléchargement de test"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Tester le téléchargement</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Info & Demonstration Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Aperçu du Bouton Télécharger APK pour les acheteurs :
            </h4>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Application WORLDORA Android</p>
                <p className="text-[10px] text-slate-400">
                  Version {apkVersion || '1.0.0'} · {apkDownloadUrl ? 'Lien configuré' : 'Lien en attente'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleTestApk}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer border border-emerald-400/40"
              >
                <Smartphone className="w-3 h-3 text-emerald-200" />
                <span>Télécharger APK</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ce bouton est maintenant visible en haut du catalogue produits (à côté de la nouvelle barre de recherche) et dans la barre de navigation supérieure pour que vos clients puissent installer l'application sur leur téléphone Android en 1 clic.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB: RÉSEAUX SOCIAUX & CONTACT OFFICIEL */}
      {activeSubTab === 'socials' && (
        <div className="space-y-4">
          {/* Social Links Config Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-500" />
                <span>Configuration des Réseaux Sociaux</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Renseignez vos liens officiels Facebook, TikTok, Instagram et YouTube. Ils s'affichent automatiquement dans le pied de page (Footer) de tout le site.
              </p>
            </div>

            {socialSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{socialSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSocialLinks} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <span>Lien Facebook</span>
                </label>
                <input
                  type="url"
                  value={socialFb}
                  onChange={(e) => setSocialFb(e.target.value)}
                  placeholder="https://facebook.com/votrepage"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-black inline-block"></span>
                  <span>Lien TikTok</span>
                </label>
                <input
                  type="url"
                  value={socialTiktok}
                  onChange={(e) => setSocialTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@votrecompte"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-600 inline-block"></span>
                  <span>Lien Instagram</span>
                </label>
                <input
                  type="url"
                  value={socialInsta}
                  onChange={(e) => setSocialInsta(e.target.value)}
                  placeholder="https://instagram.com/votreprofil"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                  <span>Lien YouTube</span>
                </label>
                <input
                  type="url"
                  value={socialYt}
                  onChange={(e) => setSocialYt(e.target.value)}
                  placeholder="https://youtube.com/@votrechaine"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Enregistrer et synchroniser avec le Footer</span>
              </button>
            </form>
          </div>

          {/* Official Email Notice Card */}
          <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-950">
                Email Officiel de Contact : {OFFICIAL_CONTACT_EMAIL}
              </h4>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Cette adresse Gmail officielle est visible publiquement par tous les acheteurs et exportateurs sur la page dédiée <strong>« Nous Contacter »</strong>. Les messages soumis via le formulaire de contact sont archivés ci-dessous.
            </p>
          </div>

          {/* Contact Messages Inbox */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>Messages Reçus depuis le Formulaire Contact ({contactMsgs.length})</span>
              </h3>
            </div>

            {contactMsgs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Aucun message envoyé pour le moment. Les demandes adressées à {OFFICIAL_CONTACT_EMAIL} apparaîtront ici.
              </p>
            ) : (
              <div className="space-y-3">
                {contactMsgs.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{msg.name}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              msg.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : msg.status === 'replied'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {msg.status === 'new' ? 'Nouveau' : msg.status === 'replied' ? 'Répondu' : 'Archivé'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {msg.email} {msg.phone ? `· ${msg.phone}` : ''} {msg.country ? `· ${msg.country}` : ''} · {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      <a
                        href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject)}`}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Répondre</span>
                      </a>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs">
                      <div className="font-semibold text-slate-800 mb-0.5">{msg.subject}</div>
                      <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1 text-[10px]">
                      {msg.status !== 'replied' && (
                        <button
                          type="button"
                          onClick={() => {
                            markContactMessageStatus(msg.id, 'replied');
                            setContactMsgs(getContactMessages());
                          }}
                          className="px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                          Marquer Répondu
                        </button>
                      )}
                      {msg.status !== 'archived' && (
                        <button
                          type="button"
                          onClick={() => {
                            markContactMessageStatus(msg.id, 'archived');
                            setContactMsgs(getContactMessages());
                          }}
                          className="px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                          Archiver
                        </button>
                      )}
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

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-700 shadow-2xl animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Lecteur & Statistiques Vidéo Admin
                </span>
                <h3 className="text-sm font-bold text-white truncate">{previewVideo.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-black aspect-16/9 flex items-center justify-center">
              <video
                src={previewVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Engagement & Details */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-60 text-xs text-slate-300">
              <div className="grid grid-cols-4 gap-2 text-center bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Vues</span>
                  <span className="text-sm font-bold text-white">{previewVideo.views}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Clics CTA</span>
                  <span className="text-sm font-bold text-blue-400">{previewVideo.clicks}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">J'aime</span>
                  <span className="text-sm font-bold text-rose-400">{previewVideo.likes || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Commentaires</span>
                  <span className="text-sm font-bold text-indigo-400">{previewVideo.comments?.length || 0}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sponsor / Marque :</span>
                  <span className="font-semibold text-white">{previewVideo.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pays cible :</span>
                  <span className="font-semibold text-white">{previewVideo.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Catégorie :</span>
                  <span className="font-semibold text-white">{previewVideo.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taux de clic (CTR) :</span>
                  <span className="font-semibold text-emerald-400">
                    {(((previewVideo.clicks || 0) / Math.max(1, previewVideo.views || 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Video Comments Breakdown */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Commentaires des acheteurs ({previewVideo.comments?.length || 0})</span>
                </h4>
                {(!previewVideo.comments || previewVideo.comments.length === 0) ? (
                  <p className="text-[11px] text-slate-500 italic">Aucun commentaire publié pour cette vidéo pour l'instant.</p>
                ) : (
                  <div className="space-y-2">
                    {previewVideo.comments.map((c) => (
                      <div key={c.id} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400 mb-0.5">
                          <strong className="text-slate-200">{c.userName}</strong>
                          <span className="text-[10px]">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p className="text-slate-300">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Fermer la prévisualisation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
