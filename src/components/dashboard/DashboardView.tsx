import React, { useState, useEffect, useRef } from 'react';
import { User, Product, Conversation, AccountType, ProductDocument, MessageAttachment } from '../../types';
import {
  getSupplierProducts,
  getUserConversations,
  createProduct,
  updateProduct,
  deleteProduct,
  updateUserProfile,
  getConversationMessages,
  sendChatMessage,
  markConversationAsRead,
} from '../../services/storageService';
import {
  CATEGORIES_LIST,
  COUNTRIES_LIST,
  CURRENCIES,
  UNITS_LIST,
  INDUSTRIAL_VALVES_IMAGE,
  COCOA_IMAGE,
  SOLAR_PANELS_IMAGE,
  HERO_IMAGE,
} from '../../data/seedData';
import {
  validateImageFile,
  validateDocumentFile,
  readFileAsDataUrl,
} from '../../utils/fileUpload';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  User as UserIcon,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Send,
  Building,
  MapPin,
  Lock,
  Globe,
  Bell,
  ArrowRight,
  UploadCloud,
  FileText,
  X,
  Paperclip,
  Download,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  onLogout: () => void;
  onViewProductDetail: (product: Product) => void;
  initialTab?: 'overview' | 'products' | 'add-product' | 'messages' | 'profile' | 'settings';
  onNavigateCatalog: () => void;
  onNavigateAdmin?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onLogout,
  onViewProductDetail,
  initialTab = 'overview',
  onNavigateCatalog,
  onNavigateAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'add-product' | 'messages' | 'profile' | 'settings'
  >(initialTab);

  const [products, setProducts] = useState<Product[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [dashboardChatAttachment, setDashboardChatAttachment] = useState<MessageAttachment | null>(null);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  // Editing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Form states for Add/Edit product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(CATEGORIES_LIST[1]);
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState<number | ''>(100);
  const [prodCurrency, setProdCurrency] = useState('EUR');
  const [prodUnit, setProdUnit] = useState('Pièce');
  const [prodCountry, setProdCountry] = useState(currentUser.country || 'France');
  const [prodMinOrderQty, setProdMinOrderQty] = useState<number | ''>(10);
  const [prodImages, setProdImages] = useState<string[]>([COCOA_IMAGE]);
  const [prodDocuments, setProdDocuments] = useState<ProductDocument[]>([]);
  const [prodBrand, setProdBrand] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodStock, setProdStock] = useState<number | ''>(500);
  const [prodLeadTime, setProdLeadTime] = useState('7-10 jours ouvrés');
  const [prodShippingTerms, setProdShippingTerms] = useState('FOB');
  const [prodTags, setProdTags] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Profile form state
  const [profName, setProfName] = useState(currentUser.name);
  const [profCompany, setProfCompany] = useState(currentUser.companyName);
  const [profCountry, setProfCountry] = useState(currentUser.country);
  const [profCity, setProfCity] = useState(currentUser.city);
  const [profDescription, setProfDescription] = useState(currentUser.description || '');
  const [profPhone, setProfPhone] = useState(currentUser.phone || '');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Settings state
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationChat, setNotificationChat] = useState(true);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  const loadData = () => {
    const userProds = getSupplierProducts(currentUser.id);
    setProducts(userProds);
    const userConvs = getUserConversations(currentUser.id);
    setConversations(userConvs);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Load chat messages when a conversation is chosen in Dashboard messages tab
  useEffect(() => {
    if (selectedConversation) {
      const res = getConversationMessages(selectedConversation.id, currentUser.id);
      if (res.success && res.messages) {
        setChatMessages(res.messages);
        markConversationAsRead(selectedConversation.id, currentUser.id);
        const userConvs = getUserConversations(currentUser.id);
        setConversations(userConvs);
      }
    }
  }, [selectedConversation]);

  // Stats calculation
  const publishedCount = products.filter((p) => p.status === 'published').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const activeConvCount = conversations.length;
  const unreadCount = conversations.reduce((acc, c) => {
    return acc + (c.buyerId === currentUser.id ? c.unreadCountBuyer || 0 : c.unreadCountSupplier || 0);
  }, 0);

  // Reset Add Form
  const resetForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(CATEGORIES_LIST[1]);
    setProdDescription('');
    setProdPrice(100);
    setProdCurrency('EUR');
    setProdUnit('Pièce');
    setProdCountry(currentUser.country || 'France');
    setProdMinOrderQty(10);
    setProdImages([COCOA_IMAGE]);
    setProdDocuments([]);
    setProdBrand('');
    setProdSku('');
    setProdStock(500);
    setProdLeadTime('7-10 jours ouvrés');
    setProdShippingTerms('FOB');
    setProdTags('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdDescription(product.description);
    setProdPrice(product.price);
    setProdCurrency(product.currency);
    setProdUnit(product.unit);
    setProdCountry(product.countryOfOrigin);
    setProdMinOrderQty(product.minOrderQty);
    setProdImages(product.images || [COCOA_IMAGE]);
    setProdDocuments(product.documents || []);
    setProdBrand(product.brand || '');
    setProdSku(product.sku || '');
    setProdStock(product.stock !== undefined ? product.stock : 500);
    setProdLeadTime(product.leadTime || '');
    setProdShippingTerms(product.shippingTerms || '');
    setProdTags(product.tags ? product.tags.join(', ') : '');
    setFormError(null);
    setFormSuccess(null);
    setActiveTab('add-product');
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFormError(null);
    setIsUploadingImage(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setFormError(validation.error || 'Fichier image non valide.');
          setIsUploadingImage(false);
          return;
        }
        const processed = await readFileAsDataUrl(file);
        setProdImages((prev) => [...prev, processed.url]);
      }
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors du téléversement de l’image.');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Technical Document Upload handler (PDF, Datasheet, Certificate)
  const handleDocumentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFormError(null);
    setIsUploadingDoc(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateDocumentFile(file);
        if (!validation.valid) {
          setFormError(validation.error || 'Document non valide.');
          setIsUploadingDoc(false);
          return;
        }
        const processed = await readFileAsDataUrl(file);
        setProdDocuments((prev) => [
          ...prev,
          {
            name: processed.name,
            url: processed.url,
            size: processed.size,
            type: processed.type,
          },
        ]);
      }
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors du téléversement du document.');
    } finally {
      setIsUploadingDoc(false);
      if (documentInputRef.current) documentInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    if (prodImages.length <= 1) {
      setFormError('Au moins une image est obligatoire pour la fiche produit.');
      return;
    }
    setProdImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setProdDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = (status: 'published' | 'draft') => {
    setFormError(null);
    setFormSuccess(null);

    if (!prodName.trim()) {
      setFormError('Le nom du produit est obligatoire.');
      return;
    }
    if (prodPrice === '' || prodPrice < 0) {
      setFormError('Veuillez saisir un prix valide.');
      return;
    }
    if (prodMinOrderQty === '' || prodMinOrderQty < 1) {
      setFormError('La quantité minimale de commande (MOQ) doit être supérieure ou égale à 1.');
      return;
    }
    if (!prodDescription.trim()) {
      setFormError('La description détaillée est obligatoire.');
      return;
    }
    if (prodImages.length === 0) {
      setFormError('Au moins une image du produit est obligatoire.');
      return;
    }

    const tagsArray = prodTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      // Update existing
      const res = updateProduct(
        editingProduct.id,
        {
          name: prodName,
          category: prodCategory,
          description: prodDescription,
          price: Number(prodPrice),
          currency: prodCurrency,
          unit: prodUnit,
          countryOfOrigin: prodCountry,
          minOrderQty: Number(prodMinOrderQty),
          images: prodImages,
          documents: prodDocuments,
          brand: prodBrand,
          sku: prodSku,
          stock: prodStock !== '' ? Number(prodStock) : undefined,
          leadTime: prodLeadTime,
          shippingTerms: prodShippingTerms,
          tags: tagsArray,
          status,
        },
        currentUser.id
      );

      if (res.success) {
        setFormSuccess(`Produit mis à jour avec succès en tant que "${status === 'published' ? 'Publié' : 'Brouillon'}" !`);
        loadData();
      } else {
        setFormError(res.error || 'Erreur lors de la mise à jour.');
      }
    } else {
      // Create new
      const res = createProduct(
        {
          supplierId: currentUser.id,
          name: prodName,
          category: prodCategory,
          description: prodDescription,
          price: Number(prodPrice),
          currency: prodCurrency,
          unit: prodUnit,
          countryOfOrigin: prodCountry,
          minOrderQty: Number(prodMinOrderQty),
          images: prodImages,
          documents: prodDocuments,
          brand: prodBrand,
          sku: prodSku,
          stock: prodStock !== '' ? Number(prodStock) : undefined,
          leadTime: prodLeadTime,
          shippingTerms: prodShippingTerms,
          tags: tagsArray,
          status,
        },
        currentUser.id
      );

      if (res.success) {
        setFormSuccess(`Nouveau produit enregistré avec succès (${status === 'published' ? 'Publié au catalogue public' : 'Enregistré en brouillon privé'}) !`);
        loadData();
      } else {
        setFormError(res.error || 'Erreur lors de la création.');
      }
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const res = deleteProduct(productId, currentUser.id);
    if (res.success) {
      loadData();
      setDeleteConfirmationId(null);
    } else {
      alert(res.error || 'Erreur lors de la suppression.');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    const res = updateUserProfile(currentUser.id, {
      name: profName,
      companyName: profCompany,
      country: profCountry,
      city: profCity,
      description: profDescription,
      phone: profPhone,
    });
    if (res.success) {
      setProfileSuccess('Profil mis à jour avec succès.');
    }
  };

  const handleDashboardChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      alert(validation.error || 'Fichier non valide.');
      return;
    }
    try {
      const processed = await readFileAsDataUrl(file);
      setDashboardChatAttachment({
        name: processed.name,
        url: processed.url,
        size: processed.size,
        type: processed.type,
      });
    } catch (err: any) {
      alert(err.message || 'Erreur de lecture du fichier.');
    } finally {
      if (chatFileInputRef.current) chatFileInputRef.current.value = '';
    }
  };

  const handleDashboardSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || (!chatInput.trim() && !dashboardChatAttachment)) return;

    const res = sendChatMessage(
      selectedConversation.id,
      currentUser.id,
      chatInput,
      dashboardChatAttachment || undefined
    );

    if (res.success && res.message) {
      setChatMessages((prev) => [...prev, res.message!]);
      setChatInput('');
      setDashboardChatAttachment(null);
      const userConvs = getUserConversations(currentUser.id);
      setConversations(userConvs);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs sticky top-20">
            {/* User badge */}
            <div className="p-3 bg-slate-50 rounded-xl mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.companyName}</p>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">
                  {currentUser.accountType === 'supplier'
                    ? 'Fournisseur'
                    : currentUser.accountType === 'buyer'
                    ? 'Acheteur'
                    : 'Acheteur & Fournisseur'}
                </span>
              </div>
            </div>

            {/* Nav list */}
            <nav className="space-y-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Vue d'ensemble</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Mes produits</span>
                </div>
                <span className="text-[11px] tabular-nums font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('add-product');
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'add-product'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter un produit</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Mes messages</span>
                </div>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Mon profil / Entreprise</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>

              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                {onNavigateAdmin && (
                  <button
                    type="button"
                    onClick={onNavigateAdmin}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all cursor-pointer shadow-xs mb-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>Espace Super-Admin</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3">
          {/* TAB 1: VUE D'ENSEMBLE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome banner */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Bienvenue, {currentUser.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Gérez vos transactions, répondez aux acheteurs internationaux et publiez vos produits avec pièces jointes et photos.
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('add-product');
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  + Ajouter un produit
                </button>
              </div>

              {/* Real Stats Cards (from database) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Produits publiés
                  </span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                    {publishedCount}
                  </div>
                  <span className="text-[11px] text-emerald-600 mt-1 inline-block">
                    Visibles au catalogue
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Brouillons
                  </span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                    {draftCount}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 inline-block">
                    Non visibles au public
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Conversations
                  </span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                    {activeConvCount}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 inline-block">
                    Discussions actives
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Messages non lus
                  </span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                    {unreadCount}
                  </div>
                  <span className={`text-[11px] mt-1 inline-block ${unreadCount > 0 ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
                    {unreadCount > 0 ? 'Réponse attendue' : 'À jour'}
                  </span>
                </div>
              </div>

              {/* Quick actions strip */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Raccourcis rapides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('add-product');
                    }}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-slate-800 mb-1" />
                    <div className="text-xs font-semibold text-slate-900">Publier une offre B2B</div>
                    <div className="text-[11px] text-slate-500">Ajouter photos, PDF techniques et prix</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Package className="w-5 h-5 text-slate-800 mb-1" />
                    <div className="text-xs font-semibold text-slate-900">Gérer mon catalogue</div>
                    <div className="text-[11px] text-slate-500">Modifier stocks, tarifs ou passer en brouillon</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5 text-slate-800 mb-1" />
                    <div className="text-xs font-semibold text-slate-900">Ouvrir la messagerie</div>
                    <div className="text-[11px] text-slate-500">Négocier en direct et échanger des documents</div>
                  </button>
                </div>
              </div>

              {/* Recent messages summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Dernières discussions B2B</h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Tout afficher →
                  </button>
                </div>

                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    Aucune conversation pour l'instant. Dès qu'un acheteur vous contactera sur une fiche produit, son message apparaîtra ici.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {conversations.slice(0, 3).map((conv) => {
                      const isBuyer = currentUser.id === conv.buyerId;
                      const partner = isBuyer ? conv.supplierCompany : conv.buyerCompany;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setSelectedConversation(conv);
                            setActiveTab('messages');
                          }}
                          className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{partner}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {conv.lastMessagePreview || 'Aucun message'}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MES PRODUITS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Mes Produits ({products.length})</h2>
                  <p className="text-xs text-slate-500">
                    Consultez, modifiez ou supprimez les offres de votre entreprise.
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('add-product');
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  + Ajouter un produit
                </button>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-slate-800">Aucun produit publié</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Commencez à référencer vos articles pour recevoir des messages et demandes d'acheteurs internationaux.
                  </p>
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('add-product');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-800"
                  >
                    Créer mon premier produit
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                  {products.map((prod) => (
                    <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate max-w-sm">{prod.name}</h4>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                prod.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {prod.status === 'published' ? 'Publié' : 'Brouillon'}
                            </span>
                            {prod.documents && prod.documents.length > 0 && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                                <FileText className="w-3 h-3 text-slate-400" />
                                {prod.documents.length} doc{prod.documents.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{prod.category}</p>
                          <div className="text-xs font-semibold text-slate-800 tabular-nums mt-1">
                            {prod.price.toLocaleString('fr-FR')} {prod.currency} / {prod.unit}
                            <span className="text-slate-400 font-normal ml-2">MOQ : {prod.minOrderQty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => onViewProductDetail(prod)}
                          title="Voir la fiche"
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Voir</span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(prod)}
                          title="Modifier"
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">Modifier</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmationId(prod.id)}
                          title="Supprimer"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delete Modal Confirmation */}
              {deleteConfirmationId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                  <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-slate-200 shadow-xl">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Confirmer la suppression</h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Êtes-vous sûr de vouloir supprimer définitivement ce produit ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDeleteConfirmationId(null)}
                        className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(deleteConfirmationId)}
                        className="px-3 py-1.5 text-xs text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-semibold cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AJOUTER / MODIFIER UN PRODUIT */}
          {activeTab === 'add-product' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Renseignez les détails techniques, tarifs, quantités minimales et téléversez vos fichiers.
                  </p>
                </div>
                {editingProduct && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Passer en mode nouvel ajout
                  </button>
                )}
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Ex: Fèves de cacao fermentées Grade A"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Category & Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {CATEGORIES_LIST.filter((c) => c !== 'Toutes les catégories').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pays d'origine ou d'expédition *
                    </label>
                    <select
                      value={prodCountry}
                      onChange={(e) => setProdCountry(e.target.value)}
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

                {/* Pricing, Currency, Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Prix unitaire de référence *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Devise *
                    </label>
                    <select
                      value={prodCurrency}
                      onChange={(e) => setProdCurrency(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Unité de vente *
                    </label>
                    <select
                      value={prodUnit}
                      onChange={(e) => setProdUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {UNITS_LIST.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* MOQ & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quantité minimale de commande (MOQ) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={prodMinOrderQty}
                      onChange={(e) => setProdMinOrderQty(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stock / Capacité disponible (facultatif)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description détaillée *
                  </label>
                  <textarea
                    rows={4}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Précisez la qualité, les normes de fabrication, les dimensions, conditionnements et certifications..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* FILE UPLOAD SECTION: Real Image Drag & Drop & Multi-Upload */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900">
                        Images du produit (Fichiers locaux ou photos) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Formats acceptés : JPG, PNG, WEBP, SVG. Max 5 Mo par image. Fichiers exécutables strictement interdits.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {prodImages.length} image{prodImages.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Upload Dropzone */}
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50 rounded-xl p-5 text-center cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageFileChange}
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-800">
                      Cliquez ou déposez vos photos de produit ici
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Prise de vue depuis appareil photo mobile ou sélection de fichier ordinateur
                    </p>
                  </div>

                  {/* Uploaded Images Gallery Preview with remove buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {prodImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                      >
                        <img
                          src={img}
                          alt={`Aperçu ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 right-1 text-center bg-slate-950/80 text-white text-[9px] font-bold rounded py-0.2">
                            Principale
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Preset B2B Samples buttons */}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-500 block mb-1">
                      Ou choisissez parmi les visuels professionnels pré-intégrés :
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setProdImages((prev) => [...prev, COCOA_IMAGE])}
                        className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer text-[11px]"
                      >
                        + Cacao / Matières premières
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImages((prev) => [...prev, INDUSTRIAL_VALVES_IMAGE])}
                        className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer text-[11px]"
                      >
                        + Robinetterie / Industrie
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImages((prev) => [...prev, SOLAR_PANELS_IMAGE])}
                        className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer text-[11px]"
                      >
                        + Modules solaires TOPCon
                      </button>
                    </div>
                  </div>
                </div>

                {/* TECHNICAL DOCUMENTS UPLOAD (PDF, Certificats, Fiches techniques) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900">
                        Fiches techniques & Documents d'accompagnement (facultatif)
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Téléversez des fiches de spécifications PDF, certificats d'analyse ou fiches de sécurité (max 10 Mo).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Ajouter un fichier PDF</span>
                    </button>
                    <input
                      type="file"
                      ref={documentInputRef}
                      onChange={handleDocumentFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="hidden"
                    />
                  </div>

                  {prodDocuments.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {prodDocuments.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="font-semibold text-slate-900 truncate">{doc.name}</span>
                            <span className="text-[11px] text-slate-500 shrink-0">({doc.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Specs: Brand, SKU, Incoterms, LeadTime */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Marque commerciale (facultatif)
                    </label>
                    <input
                      type="text"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      placeholder="Ex: Sahel Bio Pure"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Référence / SKU (facultatif)
                    </label>
                    <input
                      type="text"
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value)}
                      placeholder="Ex: BIO-CAC-2025"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Conditions de livraison / Incoterms
                    </label>
                    <input
                      type="text"
                      value={prodShippingTerms}
                      onChange={(e) => setProdShippingTerms(e.target.value)}
                      placeholder="Ex: FOB Abidjan, CIF Rotterdam, EXW"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Délai de disponibilité / préparation
                    </label>
                    <input
                      type="text"
                      value={prodLeadTime}
                      onChange={(e) => setProdLeadTime(e.target.value)}
                      placeholder="Ex: 10-15 jours ouvrés"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mots-clés / Étiquettes (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={prodTags}
                    onChange={(e) => setProdTags(e.target.value)}
                    placeholder="Bio, Export, Gros, Certifié"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    {isPreviewOpen ? 'Masquer la prévisualisation' : 'Prévisualiser la fiche'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveProduct('draft')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Enregistrer en brouillon
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveProduct('published')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      Publier le produit
                    </button>
                  </div>
                </div>

                {/* Live Preview section */}
                {isPreviewOpen && (
                  <div className="mt-4 p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-3">
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Aperçu avant publication
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4">
                      <img
                        src={prodImages[0] || COCOA_IMAGE}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase">{prodCategory}</span>
                        <h4 className="text-sm font-bold text-slate-900">{prodName || 'Sans titre'}</h4>
                        <div className="text-sm font-bold text-slate-900 tabular-nums">
                          {Number(prodPrice || 0).toLocaleString('fr-FR')} {prodCurrency} / {prodUnit}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{prodDescription}</p>
                        <div className="text-[11px] text-slate-500">
                          Origine : {prodCountry} · MOQ : {prodMinOrderQty} {prodUnit}s · Incoterms :{' '}
                          {prodShippingTerms || 'Non spécifié'}
                        </div>
                        {prodDocuments.length > 0 && (
                          <div className="text-[10px] text-slate-500 font-semibold pt-1">
                            {prodDocuments.length} document(s) technique(s) joint(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MES MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-[700px] flex flex-col sm:flex-row">
              {/* Left Column: Conversation List */}
              <div className="sm:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-3.5 border-b border-slate-200 bg-white">
                  <h3 className="text-xs font-bold text-slate-900">Conversations ({conversations.length})</h3>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {conversations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Aucune conversation active. Pour initier un échange, naviguez dans le catalogue et cliquez sur « Envoyer un message ».
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const isBuyer = currentUser.id === conv.buyerId;
                      const partner = isBuyer ? conv.supplierCompany : conv.buyerCompany;
                      const isSelected = selectedConversation?.id === conv.id;
                      const unread = isBuyer ? conv.unreadCountBuyer : conv.unreadCountSupplier;

                      return (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`p-3.5 cursor-pointer transition-colors ${
                            isSelected ? 'bg-white border-l-4 border-slate-900 shadow-xs' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-900 truncate">{partner}</span>
                            {unread > 0 && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500 text-white rounded-full">
                                {unread}
                              </span>
                            )}
                          </div>
                          {conv.productName && (
                            <p className="text-[11px] text-slate-600 font-medium truncate mb-0.5">
                              {conv.productName}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 truncate">
                            {conv.lastMessagePreview || 'Discussion initiée'}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Chat Stream */}
              <div className="flex-1 flex flex-col bg-white">
                {selectedConversation ? (
                  <>
                    <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {currentUser.id === selectedConversation.buyerId
                            ? selectedConversation.supplierCompany
                            : selectedConversation.buyerCompany}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Interlocuteur :{' '}
                          {currentUser.id === selectedConversation.buyerId
                            ? selectedConversation.supplierName
                            : selectedConversation.buyerName}
                        </p>
                      </div>
                      {selectedConversation.productName && (
                        <span className="text-[10px] font-medium bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700 truncate max-w-[200px]">
                          {selectedConversation.productName}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400">
                          Aucun message dans cette conversation.
                        </div>
                      ) : (
                        chatMessages.map((msg) => {
                          const isMine = msg.senderId === currentUser.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                            >
                              <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                                {isMine ? 'Vous' : msg.senderName} ·{' '}
                                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <div
                                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                  isMine ? 'bg-slate-900 text-white rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                                }`}
                              >
                                {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                                {msg.attachment && (
                                  <div className="mt-2 pt-1.5 border-t border-slate-200/40">
                                    {msg.attachment.type === 'image' ? (
                                      <img
                                        src={msg.attachment.url}
                                        alt={msg.attachment.name}
                                        className="max-h-40 rounded-lg object-cover cursor-pointer"
                                        onClick={() => window.open(msg.attachment.url, '_blank')}
                                      />
                                    ) : (
                                      <a
                                        href={msg.attachment.url}
                                        download={msg.attachment.name}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`flex items-center gap-2 p-1.5 rounded transition-colors ${
                                          isMine ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                        }`}
                                      >
                                        <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span className="text-[11px] truncate flex-1">{msg.attachment.name}</span>
                                        <Download className="w-3 h-3 opacity-70" />
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Pending Chat Attachment Chip */}
                    {dashboardChatAttachment && (
                      <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span className="truncate font-semibold">{dashboardChatAttachment.name}</span>
                          <span className="text-slate-500 text-[10px]">({dashboardChatAttachment.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDashboardChatAttachment(null)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <form
                      onSubmit={handleDashboardSendChat}
                      className="p-3 border-t border-slate-200 flex items-center gap-2"
                    >
                      <input
                        type="file"
                        ref={chatFileInputRef}
                        onChange={handleDashboardChatFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        title="Joindre un fichier"
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Répondre..."
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() && !dashboardChatAttachment}
                        className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Sélectionnez une conversation</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Les échanges confidentiels avec vos fournisseurs et acheteurs s'affichent ici.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MON PROFIL / MON ENTREPRISE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Mon Profil & Raison Sociale</h2>
                <p className="text-xs text-slate-500">
                  Ces informations sont visibles par vos partenaires commerciaux lors des prises de contact.
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom complet du contact
                    </label>
                    <input
                      type="text"
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Adresse e-mail (identifiant de compte)
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-100 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={profCompany}
                      onChange={(e) => setProfCompany(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Téléphone professionnel
                    </label>
                    <input
                      type="text"
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pays du siège social
                    </label>
                    <select
                      value={profCountry}
                      onChange={(e) => setProfCountry(e.target.value)}
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
                      Ville
                    </label>
                    <input
                      type="text"
                      value={profCity}
                      onChange={(e) => setProfCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Présentation de l'entreprise & Activités
                  </label>
                  <textarea
                    rows={4}
                    value={profDescription}
                    onChange={(e) => setProfDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: PARAMÈTRES */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Paramètres de compte & Préférences</h2>
                <p className="text-xs text-slate-500">
                  Gérez vos notifications, la sécurité de vos sessions et vos préférences de langue.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {/* Notification preferences */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications B2B
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationChat}
                      onChange={(e) => setNotificationChat(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900"
                    />
                    <span>Recevoir une notification lors d'un nouveau message d'un acheteur</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900"
                    />
                    <span>Recevoir un récapitulatif périodique de mes consultations</span>
                  </label>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Langue de l'interface
                </h3>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('fr')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      language === 'fr'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Français (défaut)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      language === 'en'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    English (International)
                  </button>
                </div>
              </div>

              {/* Security info */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Sécurité & Authentification
                </h3>
                <p className="text-xs text-slate-500">
                  Votre session est chiffrée et conforme aux standards de sécurité B2B. Pour changer votre mot de passe, contactez l'assistance technique.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsSuccess('Préférences enregistrées avec succès.');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Enregistrer les paramètres
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
