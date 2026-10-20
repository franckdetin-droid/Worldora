export type AccountType = 'buyer' | 'supplier' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  accountType: AccountType;
  companyName: string;
  country: string;
  city: string;
  description: string;
  phone?: string;
  verified?: boolean;
  isAdmin?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type ProductStatus = 'published' | 'draft';

export interface ProductDocument {
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface Product {
  id: string;
  supplierId: string;
  supplierName?: string;
  supplierCompany?: string;
  supplierCountry?: string;
  supplierVerified?: boolean;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  minOrderQty: number; // MOQ
  images: string[];
  documents?: ProductDocument[];
  countryOfOrigin: string;
  brand?: string;
  sku?: string;
  stock?: number;
  leadTime?: string;
  shippingTerms?: string;
  tags?: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  supplierId: string;
  supplierName: string;
  supplierCompany: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  productCurrency?: string;
  createdAt: string;
  lastMessageAt: string;
  lastMessagePreview?: string;
  unreadCountBuyer: number;
  unreadCountSupplier: number;
}

export interface MessageAttachment {
  name: string;
  url: string;
  size: string;
  type: string; // 'image' | 'pdf' | 'document'
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachment?: MessageAttachment;
  createdAt: string;
  read: boolean;
}

export interface AdVideo {
  id: string;
  title: string;
  brandName: string;
  category: string;
  country: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description?: string;
  ctaText: string;
  ctaType: 'contact_supplier' | 'view_product' | 'external_url';
  targetProductId?: string;
  targetSupplierId?: string;
  targetUrl?: string;
  status: 'active' | 'paused';
  views: number;
  clicks: number;
  createdAt: string;
}

export interface VisitorCountryStat {
  country: string;
  code: string;
  visitors: number;
  percentage: number;
  growth: string;
  flag: string;
}

export interface ProductFilterState {
  search: string;
  category: string;
  country: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'moq-asc';
}
