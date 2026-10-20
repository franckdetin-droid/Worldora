import {
  User,
  Product,
  Conversation,
  Message,
  ProductFilterState,
  AdVideo,
  VisitorCountryStat,
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
  USERS: 'worldora_users_v2',
  PRODUCTS: 'worldora_products_v2',
  CONVERSATIONS: 'worldora_conversations_v2',
  MESSAGES: 'worldora_messages_v2',
  CURRENT_USER_ID: 'worldora_current_user_id_v2',
  AD_VIDEOS: 'worldora_ad_videos_v2',
  VISITOR_STATS: 'worldora_visitor_stats_v2',
};

// Initialize Storage with seed data if not present
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AD_VIDEOS)) {
    localStorage.setItem(STORAGE_KEYS.AD_VIDEOS, JSON.stringify(INITIAL_AD_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VISITOR_STATS)) {
    localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(INITIAL_VISITOR_STATS));
  }
}

export const ADMIN_PASSWORD = 'fluxlien@gmail.com';
export const ADMIN_PRIMARY_EMAIL = 'fluxlien@gmail.com';
export const ADMIN_SECONDARY_EMAIL = 'admin@worldora.com';

// Helper readers and writers
function getUsers(): User[] {
  initializeStorage();
  let users: User[] = [];
  try {
    users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch {
    users = [...INITIAL_USERS];
  }

  // Ensure the primary admin account fluxlien@gmail.com is present with full admin rights
  const adminIndex = users.findIndex(
    (u) =>
      u.email.toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase() ||
      u.email.toLowerCase() === ADMIN_SECONDARY_EMAIL.toLowerCase() ||
      u.isAdmin === true
  );

  if (adminIndex === -1) {
    const adminUser: User = {
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
    };
    users.unshift(adminUser);
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

  // Check if admin password 'fluxlien@gmail.com' is entered or admin email is used
  const isAdminPasswordMatch = passClean === ADMIN_PASSWORD || inputClean === ADMIN_PASSWORD;
  const isAdminEmailMatch =
    inputClean === ADMIN_PRIMARY_EMAIL.toLowerCase() ||
    inputClean === ADMIN_SECONDARY_EMAIL.toLowerCase();

  if (isAdminPasswordMatch || isAdminEmailMatch) {
    let admin = users.find(
      (u) =>
        u.email.toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase() ||
        u.email.toLowerCase() === ADMIN_SECONDARY_EMAIL.toLowerCase() ||
        u.isAdmin === true
    );
    if (!admin) {
      admin = {
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
      };
      users.unshift(admin);
    } else {
      admin.isAdmin = true;
      admin.password = ADMIN_PASSWORD;
    }
    saveUsers(users);
    setCurrentUser(admin.id);
    return { success: true, user: admin };
  }

  const user = users.find((u) => u.email.toLowerCase() === inputClean);
  if (!user) {
    return {
      success: false,
      error: 'Aucun compte trouvé avec cet e-mail. Pour l’administrateur, utilisez le mot de passe : fluxlien@gmail.com',
    };
  }

  setCurrentUser(user.id);
  return { success: true, user };
}

export function logoutUser(): void {
  setCurrentUser(null);
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
