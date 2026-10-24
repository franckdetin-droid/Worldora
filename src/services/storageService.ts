import {
  User,
  Product,
  Conversation,
  Message,
  ProductFilterState,
  AdVideo,
  VisitorCountryStat,
  VideoComment,
  AdBanner,
  SocialLinks,
  ContactMessage,
  ApkConfig,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_AD_VIDEOS,
  INITIAL_VISITOR_STATS,
} from '../data/seedData';

const STORAGE_KEYS = {
  VERSION: 'worldora_version_v6_zero',
  USERS: 'worldora_users_v6_zero',
  PRODUCTS: 'worldora_products_v6_zero',
  CONVERSATIONS: 'worldora_conversations_v6_zero',
  MESSAGES: 'worldora_messages_v6_zero',
  CURRENT_USER_ID: 'worldora_current_user_id_v6_zero',
  AD_VIDEOS: 'worldora_ad_videos_v6_zero',
  AD_BANNERS: 'worldora_ad_banners_v6_zero',
  SOCIAL_LINKS: 'worldora_social_links_v6_zero',
  CONTACT_MESSAGES: 'worldora_contact_messages_v6_zero',
  VISITOR_STATS: 'worldora_visitor_stats_v6_zero',
  ADMIN_AUTH: 'worldora_admin_session_auth_v6',
  APK_CONFIG: 'worldora_apk_config_v6',
};

export const ADMIN_PASSWORD = 'fluxlien@gmail.com';
export const ADMIN_PRIMARY_EMAIL = 'fluxlien@gmail.com';
export const ADMIN_SECONDARY_EMAIL = 'admin@worldora.com';
export const OFFICIAL_CONTACT_EMAIL = 'ggh52167@gmail.com';

export const ZERO_USERS: User[] = [
  {
    id: 'user-admin-root',
    name: 'Direction Générale WORLDORA (Super-Admin)',
    email: ADMIN_PRIMARY_EMAIL,
    password: ADMIN_PASSWORD,
    accountType: 'both',
    companyName: 'WORLDORA Global Headquarters',
    country: 'France',
    city: 'Paris',
    description: 'Super Administrateur de la plateforme WORLDORA. Gestion de la modération, régie publicitaire vidéo, statistiques du trafic et exportateur ZIP.',
    phone: '+33 1 80 00 99 00',
    verified: true,
    isAdmin: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export const ZERO_VISITOR_STATS: VisitorCountryStat[] = [
  { country: 'France', code: 'FR', visitors: 0, percentage: 0, growth: '0%', flag: '🇫🇷' },
  { country: "Côte d'Ivoire", code: 'CI', visitors: 0, percentage: 0, growth: '0%', flag: '🇨🇮' },
  { country: 'Sénégal', code: 'SN', visitors: 0, percentage: 0, growth: '0%', flag: '🇸🇳' },
  { country: 'Maroc', code: 'MA', visitors: 0, percentage: 0, growth: '0%', flag: '🇲🇦' },
  { country: 'Allemagne', code: 'DE', visitors: 0, percentage: 0, growth: '0%', flag: '🇩🇪' },
  { country: 'Chine', code: 'CN', visitors: 0, percentage: 0, growth: '0%', flag: '🇨🇳' },
  { country: 'Autres pays (Vietnam, Espagne, Italie...)', code: 'INT', visitors: 0, percentage: 0, growth: '0%', flag: '🌐' },
];

// Initialize Storage with 0 data by default (fresh zeroed site requested by creator)
export function initializeStorage(forceZero = false): void {
  try {
    const currentVer = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (forceZero || currentVer !== 'v6_zero' || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      // Clear old legacy keys
      const keysToClean = [
        'worldora_users_v2', 'worldora_products_v2', 'worldora_conversations_v2', 'worldora_messages_v2',
        'worldora_users_v3', 'worldora_products_v3', 'worldora_conversations_v3', 'worldora_messages_v3',
        'worldora_users_v4_zero', 'worldora_products_v4_zero', 'worldora_conversations_v4_zero', 'worldora_messages_v4_zero',
        'worldora_admin_auth_v4', 'worldora_admin_auth_v3'
      ];
      keysToClean.forEach((k) => {
        try { localStorage.removeItem(k); } catch {}
      });

      // Write pristine zero slate
      localStorage.setItem(STORAGE_KEYS.VERSION, 'v6_zero');
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(ZERO_USERS));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.AD_VIDEOS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(ZERO_VISITOR_STATS));
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  } catch (err) {
    console.error('Storage initialization error:', err);
  }
}

// Reset all site data to 0 (Wipe all products, videos, messages, reset visits to 0)
export function resetAllSiteDataToZero(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VERSION, 'v6_zero');
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(ZERO_USERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.AD_VIDEOS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(ZERO_VISITOR_STATS));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  } catch (err) {
    console.error('Error resetting site data to zero:', err);
  }
}

// Load sample mock data if admin explicitly requests it for demonstration
export function loadSampleDemoData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.AD_VIDEOS, JSON.stringify(INITIAL_AD_VIDEOS));
    localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(INITIAL_VISITOR_STATS));
  } catch (err) {
    console.error('Error loading sample data:', err);
  }
}

// Admin session authentication check (Strict session-only check - NEVER permanent in localStorage)
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(authenticated: boolean): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
    // Always remove from localStorage to guarantee no cross-session or persistent leak
    localStorage.removeItem('worldora_admin_auth_v4');
    localStorage.removeItem('worldora_admin_session_auth_v6');
  } catch {}
}

export function verifyAdminPassword(pwd: string): boolean {
  return pwd.trim() === ADMIN_PASSWORD;
}

// Helper readers and writers
function getUsers(): User[] {
  initializeStorage();
  let users: User[] = [];
  try {
    users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch {
    users = [...ZERO_USERS];
  }

  // Ensure the primary admin account fluxlien@gmail.com is present with full admin rights
  const adminIndex = users.findIndex(
    (u) =>
      u.email.toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase() ||
      u.email.toLowerCase() === ADMIN_SECONDARY_EMAIL.toLowerCase() ||
      u.isAdmin === true
  );

  if (adminIndex === -1) {
    users.unshift(ZERO_USERS[0]);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } else {
    // Synchronize admin email, password and status
    users[adminIndex] = {
      ...users[adminIndex],
      email: ADMIN_PRIMARY_EMAIL,
      password: ADMIN_PASSWORD,
      isAdmin: true,
      verified: true,
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  return users;
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getAllProducts(): Product[] {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function getAllConversations(): Conversation[] {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]');
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

function saveConversations(convs: Conversation[]): void {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
}

function getAllMessages(): Message[] {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
  } catch {
    return INITIAL_MESSAGES;
  }
}

function saveMessages(msgs: Message[]): void {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
}

// ================= AUTH SERVICE =================

export function getCurrentUser(): User | null {
  initializeStorage();
  const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  if (!currentId) return null;
  const users = getUsers();
  return users.find((u) => u.id === currentId) || null;
}

export function setCurrentUser(userId: string | null): void {
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
}

export function registerUser(userData: {
  name: string;
  email: string;
  password?: string;
  accountType: 'buyer' | 'supplier' | 'both';
  companyName: string;
  country: string;
  city: string;
  description: string;
  phone?: string;
}): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim());
  if (existing) {
    return { success: false, error: 'Une adresse e-mail similaire est déjà enregistrée sur WORLDORA.' };
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    accountType: userData.accountType,
    companyName: userData.companyName.trim(),
    country: userData.country.trim(),
    city: userData.city.trim(),
    description: userData.description.trim(),
    phone: userData.phone?.trim() || '',
    verified: false,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser.id);
  return { success: true, user: newUser };
}

export function loginUser(
  emailOrInput: string,
  password?: string
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const inputClean = emailOrInput.toLowerCase().trim();
  const passClean = password?.trim() || '';

  const isAdminEmail =
    inputClean === ADMIN_PRIMARY_EMAIL.toLowerCase() ||
    inputClean === ADMIN_SECONDARY_EMAIL.toLowerCase();

  // If targeting admin or supplying password
  if (isAdminEmail || passClean === ADMIN_PASSWORD) {
    if (passClean !== ADMIN_PASSWORD) {
      return {
        success: false,
        error: 'Accès administrateur protégé : Mot de passe requis ou incorrect.',
      };
    }

    // Password is valid: authenticate admin session
    let admin = users.find(
      (u) =>
        u.email.toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase() ||
        u.email.toLowerCase() === ADMIN_SECONDARY_EMAIL.toLowerCase() ||
        u.isAdmin === true
    );
    if (!admin) {
      admin = { ...ZERO_USERS[0] };
      users.unshift(admin);
    } else {
      admin.isAdmin = true;
      admin.password = ADMIN_PASSWORD;
      admin.email = ADMIN_PRIMARY_EMAIL;
    }
    saveUsers(users);
    setCurrentUser(admin.id);
    setAdminAuthenticated(true);
    return { success: true, user: admin };
  }

  let user = users.find((u) => u.email.toLowerCase() === inputClean);
  if (!user) {
    const demoUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === inputClean);
    if (demoUser) {
      user = { ...demoUser };
      users.push(user);
      saveUsers(users);
    } else {
      return {
        success: false,
        error: 'Aucun compte trouvé avec cet e-mail. Inscrivez-vous pour créer votre compte professionnel.',
      };
    }
  }

  setCurrentUser(user.id);
  return { success: true, user };
}

export function logoutUser(): void {
  setCurrentUser(null);
  setAdminAuthenticated(false);
}

export function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: 'Utilisateur introuvable.' };
  }
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return { success: true, user: users[index] };
}

// ================= PRODUCT SERVICE =================

export function getPublicProducts(filters?: ProductFilterState): Product[] {
  const all = getAllProducts();
  // RULE: Only published products are visible in public catalog!
  let filtered = all.filter((p) => p.status === 'published');

  if (filters) {
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.supplierCompany && p.supplierCompany.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (filters.category && filters.category !== 'Toutes les catégories') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.country && filters.country !== 'Tous les pays') {
      filtered = filtered.filter((p) => p.countryOfOrigin === filters.country);
    }

    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      filtered = filtered.filter((p) => p.price >= (filters.minPrice ?? 0));
    }

    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      filtered = filtered.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
    }

    if (filters.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'moq-asc') {
      filtered.sort((a, b) => a.minOrderQty - b.minOrderQty);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
}

export function getProductById(id: string): Product | null {
  const all = getAllProducts();
  return all.find((p) => p.id === id) || null;
}

export function getAllProductsAdmin(): Product[] {
  return getAllProducts();
}

export function getSupplierProducts(supplierId: string): Product[] {
  const all = getAllProducts();
  return all
    .filter((p) => p.supplierId === supplierId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  currentUserId: string
): { success: boolean; product?: Product; error?: string } {
  if (!currentUserId) {
    return { success: false, error: 'Vous devez être connecté pour publier un produit.' };
  }

  const users = getUsers();
  const supplier = users.find((u) => u.id === currentUserId);
  if (!supplier) {
    return { success: false, error: 'Fournisseur non trouvé.' };
  }

  // Field validations
  if (!productData.name || productData.name.trim() === '') {
    return { success: false, error: 'Le nom du produit est requis.' };
  }
  if (!productData.category || productData.category.trim() === '') {
    return { success: false, error: 'La catégorie est requise.' };
  }
  if (!productData.description || productData.description.trim() === '') {
    return { success: false, error: 'La description détaillée est requise.' };
  }
  if (productData.price === undefined || productData.price < 0 || isNaN(productData.price)) {
    return { success: false, error: 'Veuillez saisir un prix valide et non négatif.' };
  }
  if (!productData.currency) {
    return { success: false, error: 'La devise du prix est requise.' };
  }
  if (!productData.unit) {
    return { success: false, error: 'L’unité de vente est requise.' };
  }
  if (!productData.countryOfOrigin) {
    return { success: false, error: 'Le pays d’origine est requis.' };
  }
  if (!productData.minOrderQty || productData.minOrderQty < 1) {
    return { success: false, error: 'La quantité minimale de commande (MOQ) doit être d’au moins 1.' };
  }
  if (!productData.images || productData.images.length === 0) {
    return { success: false, error: 'Au moins une image de produit est obligatoire.' };
  }

  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    supplierId: supplier.id,
    supplierName: supplier.name,
    supplierCompany: supplier.companyName,
    supplierCountry: supplier.country,
    supplierVerified: supplier.verified || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const products = getAllProducts();
  products.unshift(newProduct);
  saveProducts(products);
  return { success: true, product: newProduct };
}

export function updateProduct(
  productId: string,
  updates: Partial<Product>,
  currentUserId: string
): { success: boolean; product?: Product; error?: string } {
  if (!currentUserId) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return { success: false, error: 'Produit introuvable.' };
  }

  const users = getUsers();
  const currentUser = users.find((u) => u.id === currentUserId);
  const isOwner = products[index].supplierId === currentUserId;
  const isAdmin = currentUser?.isAdmin;

  if (!isOwner && !isAdmin) {
    return { success: false, error: 'Autorisation refusée : vous ne pouvez modifier que vos propres produits.' };
  }

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveProducts(products);
  return { success: true, product: products[index] };
}

export function deleteProduct(
  productId: string,
  currentUserId: string
): { success: boolean; error?: string } {
  if (!currentUserId) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return { success: false, error: 'Produit introuvable.' };
  }

  const users = getUsers();
  const currentUser = users.find((u) => u.id === currentUserId);
  const isOwner = products[index].supplierId === currentUserId;
  const isAdmin = currentUser?.isAdmin;

  if (!isOwner && !isAdmin) {
    return { success: false, error: 'Autorisation refusée : vous ne pouvez supprimer que vos propres produits.' };
  }

  products.splice(index, 1);
  saveProducts(products);
  return { success: true };
}

// ================= MESSAGING & CONVERSATION SERVICE =================

export function getUserConversations(userId: string): Conversation[] {
  if (!userId) return [];
  const convs = getAllConversations();
  return convs
    .filter((c) => c.buyerId === userId || c.supplierId === userId)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getOrCreateConversation(
  buyerId: string,
  supplierId: string,
  productId?: string
): { success: boolean; conversation?: Conversation; error?: string } {
  if (!buyerId) {
    return { success: false, error: 'Connectez-vous pour contacter ce fournisseur.' };
  }

  if (buyerId === supplierId) {
    return {
      success: false,
      error: 'Vous ne pouvez pas démarrer une conversation avec vous-même au sujet de votre propre produit.',
    };
  }

  const users = getUsers();
  const buyer = users.find((u) => u.id === buyerId);
  const supplier = users.find((u) => u.id === supplierId);

  if (!buyer || !supplier) {
    return { success: false, error: 'Utilisateur ou fournisseur introuvable.' };
  }

  const convs = getAllConversations();

  const existing = convs.find(
    (c) =>
      c.buyerId === buyerId &&
      c.supplierId === supplierId &&
      (productId ? c.productId === productId : true)
  );

  if (existing) {
    return { success: true, conversation: existing };
  }

  let product: Product | null = null;
  if (productId) {
    product = getProductById(productId);
  }

  const newConv: Conversation = {
    id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    buyerId: buyer.id,
    buyerName: buyer.name,
    buyerCompany: buyer.companyName,
    supplierId: supplier.id,
    supplierName: supplier.name,
    supplierCompany: supplier.companyName,
    productId: product?.id,
    productName: product?.name,
    productImage: product?.images?.[0],
    productPrice: product?.price,
    productCurrency: product?.currency,
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: 'Conversation initiée',
    unreadCountBuyer: 0,
    unreadCountSupplier: 0,
  };

  convs.unshift(newConv);
  saveConversations(convs);
  return { success: true, conversation: newConv };
}

export function getConversationMessages(
  conversationId: string,
  currentUserId: string
): { success: boolean; messages?: Message[]; error?: string } {
  if (!currentUserId) {
    return { success: false, error: 'Accès non autorisé : utilisateur non connecté.' };
  }

  const convs = getAllConversations();
  const conversation = convs.find((c) => c.id === conversationId);
  if (!conversation) {
    return { success: false, error: 'Conversation introuvable.' };
  }

  const users = getUsers();
  const currentUser = users.find((u) => u.id === currentUserId);
  const isParticipant = conversation.buyerId === currentUserId || conversation.supplierId === currentUserId;

  if (!isParticipant && !currentUser?.isAdmin) {
    return { success: false, error: 'Accès non autorisé : vous ne faites pas partie de cette conversation.' };
  }

  const messages = getAllMessages();
  const convMessages = messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return { success: true, messages: convMessages };
}

export function sendChatMessage(
  conversationId: string,
  senderId: string,
  content: string,
  attachment?: Message['attachment']
): { success: boolean; message?: Message; error?: string } {
  if (!senderId) {
    return { success: false, error: 'Connectez-vous pour envoyer un message.' };
  }

  const cleanContent = content.trim();
  if (!cleanContent && !attachment) {
    return { success: false, error: 'Le message ne peut pas être vide.' };
  }
  if (cleanContent.length > 3000) {
    return { success: false, error: 'Le message dépasse la limite maximale de 3000 caractères.' };
  }

  const convs = getAllConversations();
  const convIndex = convs.findIndex((c) => c.id === conversationId);
  if (convIndex === -1) {
    return { success: false, error: 'Conversation introuvable.' };
  }

  const conversation = convs[convIndex];
  if (conversation.buyerId !== senderId && conversation.supplierId !== senderId) {
    return { success: false, error: 'Accès refusé : vous n’êtes pas autorisé à envoyer de message dans cette conversation.' };
  }

  const users = getUsers();
  const sender = users.find((u) => u.id === senderId);
  const senderName = sender?.name || 'Utilisateur';

  const previewText = cleanContent
    ? (cleanContent.length > 60 ? cleanContent.substring(0, 57) + '...' : cleanContent)
    : `[Fichier joint: ${attachment?.name}]`;

  const newMessage: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    senderId,
    senderName,
    content: cleanContent,
    attachment,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const messages = getAllMessages();
  messages.push(newMessage);
  saveMessages(messages);

  const isSenderBuyer = senderId === conversation.buyerId;
  convs[convIndex] = {
    ...conversation,
    lastMessageAt: newMessage.createdAt,
    lastMessagePreview: previewText,
    unreadCountBuyer: isSenderBuyer ? conversation.unreadCountBuyer : (conversation.unreadCountBuyer || 0) + 1,
    unreadCountSupplier: !isSenderBuyer ? conversation.unreadCountSupplier : (conversation.unreadCountSupplier || 0) + 1,
  };
  saveConversations(convs);

  return { success: true, message: newMessage };
}

export function markConversationAsRead(conversationId: string, currentUserId: string): void {
  const convs = getAllConversations();
  const convIndex = convs.findIndex((c) => c.id === conversationId);
  if (convIndex === -1) return;

  const conv = convs[convIndex];
  if (conv.buyerId !== currentUserId && conv.supplierId !== currentUserId) return;

  if (conv.buyerId === currentUserId) {
    convs[convIndex].unreadCountBuyer = 0;
  } else {
    convs[convIndex].unreadCountSupplier = 0;
  }
  saveConversations(convs);

  const messages = getAllMessages();
  let modified = false;
  messages.forEach((m) => {
    if (m.conversationId === conversationId && m.senderId !== currentUserId && !m.read) {
      m.read = true;
      modified = true;
    }
  });
  if (modified) {
    saveMessages(messages);
  }
}

export function getTotalUnreadCount(userId: string): number {
  if (!userId) return 0;
  const convs = getUserConversations(userId);
  return convs.reduce((acc, c) => {
    if (c.buyerId === userId) return acc + (c.unreadCountBuyer || 0);
    if (c.supplierId === userId) return acc + (c.unreadCountSupplier || 0);
    return acc;
  }, 0);
}

// ================= AD VIDEO MANAGEMENT =================

export function getAdVideos(onlyActive = false): AdVideo[] {
  initializeStorage();
  try {
    const list: AdVideo[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.AD_VIDEOS) || '[]');
    if (onlyActive) {
      return list.filter((ad) => ad.status === 'active');
    }
    return list;
  } catch {
    return INITIAL_AD_VIDEOS;
  }
}

export function saveAdVideos(ads: AdVideo[]): void {
  localStorage.setItem(STORAGE_KEYS.AD_VIDEOS, JSON.stringify(ads));
}

export function createAdVideo(adData: Omit<AdVideo, 'id' | 'views' | 'clicks' | 'createdAt'>): {
  success: boolean;
  ad?: AdVideo;
  error?: string;
} {
  if (!adData.title || !adData.videoUrl) {
    return { success: false, error: 'Le titre et l’URL/fichier vidéo sont obligatoires.' };
  }

  const ads = getAdVideos();
  const newAd: AdVideo = {
    ...adData,
    id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    views: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  ads.unshift(newAd);
  saveAdVideos(ads);
  return { success: true, ad: newAd };
}

export function updateAdVideo(id: string, updates: Partial<AdVideo>): { success: boolean; ad?: AdVideo; error?: string } {
  const ads = getAdVideos();
  const index = ads.findIndex((a) => a.id === id);
  if (index === -1) {
    return { success: false, error: 'Vidéo publicitaire introuvable.' };
  }
  ads[index] = { ...ads[index], ...updates };
  saveAdVideos(ads);
  return { success: true, ad: ads[index] };
}

export function deleteAdVideo(id: string): { success: boolean; error?: string } {
  const ads = getAdVideos();
  const filtered = ads.filter((a) => a.id !== id);
  saveAdVideos(filtered);
  return { success: true };
}

export function incrementVideoViews(id: string): void {
  const ads = getAdVideos();
  const index = ads.findIndex((a) => a.id === id);
  if (index !== -1) {
    ads[index].views = (ads[index].views || 0) + 1;
    saveAdVideos(ads);
  }
}

export function incrementVideoClicks(id: string): void {
  const ads = getAdVideos();
  const index = ads.findIndex((a) => a.id === id);
  if (index !== -1) {
    ads[index].clicks = (ads[index].clicks || 0) + 1;
    saveAdVideos(ads);
  }
}

// ================= VIDEO LIKES & COMMENTS =================

export function toggleVideoLike(videoId: string, userIdentifier = 'anonymous'): {
  success: boolean;
  likes: number;
  isLiked: boolean;
} {
  const ads = getAdVideos();
  const index = ads.findIndex((a) => a.id === videoId);
  if (index === -1) {
    return { success: false, likes: 0, isLiked: false };
  }

  const ad = ads[index];
  const likedBy = ad.likedBy || [];
  const alreadyLiked = likedBy.includes(userIdentifier);

  let newLikedBy: string[];
  let newLikes: number;

  if (alreadyLiked) {
    newLikedBy = likedBy.filter((id) => id !== userIdentifier);
    newLikes = Math.max(0, (ad.likes || 1) - 1);
  } else {
    newLikedBy = [...likedBy, userIdentifier];
    newLikes = (ad.likes || 0) + 1;
  }

  ads[index] = {
    ...ad,
    likes: newLikes,
    likedBy: newLikedBy,
  };
  saveAdVideos(ads);

  return { success: true, likes: newLikes, isLiked: !alreadyLiked };
}

export function isVideoLikedByUser(videoId: string, userIdentifier = 'anonymous'): boolean {
  const ads = getAdVideos();
  const ad = ads.find((a) => a.id === videoId);
  if (!ad || !ad.likedBy) return false;
  return ad.likedBy.includes(userIdentifier);
}

export function addVideoComment(
  videoId: string,
  commentData: { userName: string; userCompany?: string; content: string }
): { success: boolean; comment?: VideoComment; error?: string } {
  if (!commentData.content || !commentData.content.trim()) {
    return { success: false, error: 'Le commentaire ne peut pas être vide.' };
  }

  const ads = getAdVideos();
  const index = ads.findIndex((a) => a.id === videoId);
  if (index === -1) {
    return { success: false, error: 'Vidéo introuvable.' };
  }

  const newComment: VideoComment = {
    id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    videoId,
    userName: commentData.userName.trim() || 'Acheteur Vérifié',
    userCompany: commentData.userCompany?.trim() || undefined,
    content: commentData.content.trim(),
    createdAt: new Date().toISOString(),
  };

  const currentComments = ads[index].comments || [];
  ads[index] = {
    ...ads[index],
    comments: [newComment, ...currentComments],
  };
  saveAdVideos(ads);

  return { success: true, comment: newComment };
}

export function getVideoComments(videoId: string): VideoComment[] {
  const ads = getAdVideos();
  const ad = ads.find((a) => a.id === videoId);
  return ad?.comments || [];
}

// ================= DYNAMIC SCROLLING AD BANNERS =================

export const DEFAULT_AD_BANNERS: AdBanner[] = [
  {
    id: 'banner-top-1',
    title: '🌾 Filière Cacao & Café d’Origine Certifiée',
    subtitle: 'Approvisionnez vos unités de transformation auprès des coopératives agréées de Côte d’Ivoire et du Cameroun.',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=1200',
    badgeText: 'FOURNISSEUR DU MOIS',
    ctaText: 'Contacter le fournisseur export',
    linkType: 'contact',
    position: 'top',
    status: 'active',
    clicks: 142,
    impressions: 1250,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'banner-top-2',
    title: '⚙️ Équipements Industriels & Vannes Inox Haute Pression',
    subtitle: 'Fabrication européenne certifiée ISO 9001 - Expédition maritime et aérienne express CIF / FOB.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    badgeText: 'USINE AUDITÉE WORLDORA',
    ctaText: 'Consulter le catalogue usine',
    linkType: 'product',
    position: 'top',
    status: 'active',
    clicks: 98,
    impressions: 980,
    createdAt: '2025-01-02T00:00:00Z',
  },
  {
    id: 'banner-mid-1',
    title: '☀️ Centrales Solaires & Onduleurs Industriels 50kW - 1MW',
    subtitle: 'Solutions énergétiques complètes pour sites miniers, usines et exploitations agro-industrielles.',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=1200',
    badgeText: 'INNOVATION ÉNERGIE',
    ctaText: 'Demander un chiffrage de projet',
    linkType: 'contact',
    position: 'middle',
    status: 'active',
    clicks: 74,
    impressions: 610,
    createdAt: '2025-01-03T00:00:00Z',
  },
  {
    id: 'banner-mid-2',
    title: '🚢 Lignes de Fret & Logistique Maritime Groupage B2B',
    subtitle: 'Tarifs préférentiels pour conteneurs 20ft et 40ft au départ d’Europe, d’Asie et d’Afrique.',
    imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=1200',
    badgeText: 'LOGISTIQUE MONDIALE',
    ctaText: 'Voir les départs programmés',
    linkType: 'external',
    targetUrl: '#how-it-works',
    position: 'middle',
    status: 'active',
    clicks: 53,
    impressions: 480,
    createdAt: '2025-01-04T00:00:00Z',
  },
];

export function getAdBanners(position?: 'top' | 'middle', onlyActive = false): AdBanner[] {
  initializeStorage();
  let banners: AdBanner[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AD_BANNERS);
    if (stored) {
      banners = JSON.parse(stored);
    } else {
      banners = [...DEFAULT_AD_BANNERS];
      localStorage.setItem(STORAGE_KEYS.AD_BANNERS, JSON.stringify(banners));
    }
  } catch {
    banners = [...DEFAULT_AD_BANNERS];
  }

  if (position) {
    banners = banners.filter((b) => b.position === position);
  }
  if (onlyActive) {
    banners = banners.filter((b) => b.status === 'active');
  }
  return banners;
}

export function saveAdBanners(banners: AdBanner[]): void {
  localStorage.setItem(STORAGE_KEYS.AD_BANNERS, JSON.stringify(banners));
}

export function createAdBanner(bannerData: Omit<AdBanner, 'id' | 'clicks' | 'impressions' | 'createdAt'>): {
  success: boolean;
  banner?: AdBanner;
  error?: string;
} {
  if (!bannerData.title.trim()) {
    return { success: false, error: 'Le titre de la bannière est obligatoire.' };
  }
  if (!bannerData.imageUrl.trim()) {
    return { success: false, error: 'L’image de la bannière est obligatoire.' };
  }

  const banners = getAdBanners();
  const newBanner: AdBanner = {
    ...bannerData,
    id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    clicks: 0,
    impressions: 0,
    createdAt: new Date().toISOString(),
  };

  banners.unshift(newBanner);
  saveAdBanners(banners);
  return { success: true, banner: newBanner };
}

export function updateAdBanner(id: string, updates: Partial<AdBanner>): { success: boolean; banner?: AdBanner; error?: string } {
  const banners = getAdBanners();
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) {
    return { success: false, error: 'Bannière publicitaire introuvable.' };
  }
  banners[index] = { ...banners[index], ...updates };
  saveAdBanners(banners);
  return { success: true, banner: banners[index] };
}

export function deleteAdBanner(id: string): { success: boolean; error?: string } {
  const banners = getAdBanners();
  const filtered = banners.filter((b) => b.id !== id);
  saveAdBanners(filtered);
  return { success: true };
}

export function incrementBannerClicks(id: string): void {
  const banners = getAdBanners();
  const index = banners.findIndex((b) => b.id === id);
  if (index !== -1) {
    banners[index].clicks = (banners[index].clicks || 0) + 1;
    saveAdBanners(banners);
  }
}

export function incrementBannerImpressions(id: string): void {
  const banners = getAdBanners();
  const index = banners.findIndex((b) => b.id === id);
  if (index !== -1) {
    banners[index].impressions = (banners[index].impressions || 0) + 1;
    saveAdBanners(banners);
  }
}

// ================= VISITOR ANALYTICS & ADMIN TOOLS =================

export function getVisitorCountryStats(): VisitorCountryStat[] {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITOR_STATS) || '[]');
  } catch {
    return INITIAL_VISITOR_STATS;
  }
}

export function getAllUsersAdmin(): User[] {
  return getUsers();
}

export function toggleUserVerification(userId: string): { success: boolean; verified?: boolean; error?: string } {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return { success: false, error: 'Utilisateur introuvable.' };
  users[index].verified = !users[index].verified;
  saveUsers(users);
  return { success: true, verified: users[index].verified };
}

export function toggleProductStatusAdmin(productId: string): { success: boolean; status?: Product['status']; error?: string } {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return { success: false, error: 'Produit introuvable.' };
  products[index].status = products[index].status === 'published' ? 'draft' : 'published';
  saveProducts(products);
  return { success: true, status: products[index].status };
}

// ================= SOCIAL MEDIA LINKS & CONTACT =================

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: 'https://facebook.com/worldora.b2b',
  tiktok: 'https://tiktok.com/@worldora.b2b',
  instagram: 'https://instagram.com/worldora.b2b',
  youtube: 'https://youtube.com/@worldora-trade',
};

export function getSocialLinks(): SocialLinks {
  initializeStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SOCIAL_LINKS);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_SOCIAL_LINKS;
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export function saveSocialLinks(links: SocialLinks): void {
  localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(links));
}

export function getContactMessages(): ContactMessage[] {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES) || '[]');
  } catch {
    return [];
  }
}

export function saveContactMessages(msgs: ContactMessage[]): void {
  localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(msgs));
}

export function sendContactMessage(msgData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { success: boolean; message?: ContactMessage; error?: string } {
  if (!msgData.name.trim() || !msgData.email.trim() || !msgData.message.trim()) {
    return { success: false, error: 'Veuillez remplir votre nom, e-mail et votre message.' };
  }

  const messages = getContactMessages();
  const newMsg: ContactMessage = {
    id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: msgData.name.trim(),
    email: msgData.email.trim(),
    phone: msgData.phone?.trim(),
    subject: msgData.subject?.trim() || 'Demande d’information WORLDORA',
    message: msgData.message.trim(),
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  messages.unshift(newMsg);
  saveContactMessages(messages);
  return { success: true, message: newMsg };
}

export function markContactMessageStatus(id: string, status: ContactMessage['status']): void {
  const messages = getContactMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    messages[index].status = status;
    saveContactMessages(messages);
  }
}

// ================= ANDROID APK CONFIGURATION =================

export const DEFAULT_APK_CONFIG: ApkConfig = {
  downloadUrl: '',
  version: '1.0.0',
  fileName: 'worldora-b2b.apk',
  enabled: true,
  updatedAt: new Date().toISOString(),
};

export function getApkConfig(): ApkConfig {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APK_CONFIG);
    if (raw) {
      return { ...DEFAULT_APK_CONFIG, ...JSON.parse(raw) };
    }
    return DEFAULT_APK_CONFIG;
  } catch {
    return DEFAULT_APK_CONFIG;
  }
}

export function saveApkConfig(update: Partial<ApkConfig>): ApkConfig {
  const current = getApkConfig();
  const next: ApkConfig = {
    ...current,
    ...update,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.APK_CONFIG, JSON.stringify(next));
  return next;
}

export function triggerApkDownload(): { success: boolean; message: string; url?: string } {
  const config = getApkConfig();
  const url = config.downloadUrl?.trim();

  if (url) {
    // If a custom APK link was set by the admin (URL or data URI)
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = config.fileName || 'worldora-b2b.apk';
    if (!url.startsWith('data:') && !url.startsWith('/')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    return {
      success: true,
      url,
      message: `Téléchargement de l'APK WORLDORA ${config.version || ''} lancé !`,
    };
  }

  // Fallback: If admin hasn't set a custom URL yet
  const fallbackBlob = new Blob([
    `WORLDORA Android App Release Package\nVersion: ${config.version || '1.0.0'}\nPackage: com.worldora.b2b\nDate: ${new Date().toISOString()}\n\nNote: L'administrateur peut configurer le lien direct du binaire APK dans le tableau de bord Admin.`
  ], { type: 'application/octet-stream' });
  const fallbackUrl = URL.createObjectURL(fallbackBlob);
  const a = document.createElement('a');
  a.href = fallbackUrl;
  a.download = config.fileName || 'worldora-b2b.apk';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(fallbackUrl), 2000);

  return {
    success: true,
    message: "Fichier d'installation initié. L'administrateur peut remplacer le lien de téléchargement direct depuis le panneau Admin.",
  };
}

