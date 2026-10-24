/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Product, Conversation, AdVideo } from './types';
import {
  getCurrentUser,
  getPublicProducts,
  getTotalUnreadCount,
  logoutUser,
  getOrCreateConversation,
  initializeStorage,
  getAdVideos,
  getProductById,
} from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { Footer } from './components/layout/Footer';
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { ChatModal } from './components/chat/ChatModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { AdminStandalonePage } from './components/admin/AdminStandalonePage';
import { B2BVideoFeed } from './components/videos/B2BVideoFeed';
import { ContactView } from './components/contact/ContactView';

// Helper to check if current URL points to admin (/admin, #admin, ?admin)
const checkIsAdminUrl = (): boolean => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.endsWith('/admin') ||
    path.endsWith('/admin/') ||
    hash === '#admin' ||
    hash.endsWith('/admin') ||
    search.includes('admin')
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [adVideos, setAdVideos] = useState<AdVideo[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [currentView, setCurrentView] = useState<
    'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product' | 'contact'
  >(() => (checkIsAdminUrl() ? 'admin' : 'catalog'));
  const [dashboardTab, setDashboardTab] = useState<
    'overview' | 'products' | 'add-product' | 'messages' | 'profile' | 'settings'
  >('overview');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectNotice, setAuthRedirectNotice] = useState<string | null>(null);
  const [pendingContactProduct, setPendingContactProduct] = useState<Product | null>(null);

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Initialize and load data
  const refreshAppData = () => {
    initializeStorage();
    const user = getCurrentUser();
    setCurrentUser(user);
    const pubProducts = getPublicProducts();
    setProducts(pubProducts);
    const videos = getAdVideos();
    setAdVideos(videos);
    if (user) {
      setUnreadCount(getTotalUnreadCount(user.id));
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    refreshAppData();

    if (checkIsAdminUrl()) {
      setCurrentView('admin');
    }

    const handleUrlChange = () => {
      if (checkIsAdminUrl()) {
        setCurrentView('admin');
      } else {
        setCurrentView((prev) => (prev === 'admin' ? 'catalog' : prev));
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // When user logs in
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setUnreadCount(getTotalUnreadCount(user.id));
    setIsAuthModalOpen(false);

    // If user is Admin, switch directly to admin view
    if (user.isAdmin) {
      setCurrentView('admin');
      try {
        window.history.pushState(null, '', '/admin');
      } catch {
        window.location.hash = '#admin';
      }
      return;
    }

    // If there was a pending contact action, execute it right away!
    if (pendingContactProduct) {
      const prod = pendingContactProduct;
      setPendingContactProduct(null);
      setAuthRedirectNotice(null);

      if (user.id === prod.supplierId) {
        alert('Vous êtes le fournisseur de ce produit. Vous ne pouvez pas démarrer une conversation avec vous-même.');
        return;
      }

      const convRes = getOrCreateConversation(user.id, prod.supplierId, prod.id);
      if (convRes.success && convRes.conversation) {
        setActiveConversation(convRes.conversation);
        setIsChatModalOpen(true);
        if (selectedProduct) setSelectedProduct(null);
      }
    }
  };

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUnreadCount(0);
    setCurrentView('catalog');
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
  };

  // Contact supplier CTA handler
  const handleContactSupplier = (product: Product) => {
    if (!currentUser) {
      setPendingContactProduct(product);
      setAuthRedirectNotice('Connectez-vous pour contacter ce fournisseur.');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.id === product.supplierId) {
      alert('Vous êtes le fournisseur de ce produit. Vous ne pouvez pas démarrer une conversation avec vous-même.');
      return;
    }

    const res = getOrCreateConversation(currentUser.id, product.supplierId, product.id);
    if (res.success && res.conversation) {
      setActiveConversation(res.conversation);
      setIsChatModalOpen(true);
      setSelectedProduct(null);
    } else {
      alert(res.error || 'Erreur lors de l’ouverture de la messagerie.');
    }
  };

  // Contact supplier directly by supplierId and optional productId (e.g. from Video Ad)
  const handleContactSupplierById = (supplierId: string, productId?: string) => {
    if (!currentUser) {
      setAuthRedirectNotice('Connectez-vous pour contacter ce sponsor.');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.id === supplierId) {
      alert('Vous êtes le propriétaire de cette annonce publicitaire.');
      return;
    }

    const res = getOrCreateConversation(currentUser.id, supplierId, productId);
    if (res.success && res.conversation) {
      setActiveConversation(res.conversation);
      setIsChatModalOpen(true);
    } else {
      alert(res.error || 'Erreur lors de l’ouverture de la messagerie.');
    }
  };

  // Navigation controller
  const handleNavigate = (
    view: 'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product' | 'contact'
  ) => {
    if (view === 'contact') {
      setCurrentView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'admin') {
      setCurrentView('admin');
      try {
        window.history.pushState(null, '', '/admin');
      } catch {
        window.location.hash = '#admin';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'catalog') {
      setCurrentView('catalog');
      try {
        window.history.pushState(null, '', '/');
      } catch {
        window.location.hash = '';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'videos') {
      setCurrentView('videos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Require auth for dashboard, messages, add-product
    if (!currentUser) {
      setAuthRedirectNotice(
        view === 'add-product'
          ? 'Connectez-vous pour publier un produit.'
          : view === 'messages'
          ? 'Connectez-vous pour accéder à vos conversations privées.'
          : 'Connectez-vous pour accéder à votre tableau de bord.'
      );
      setIsAuthModalOpen(true);
      return;
    }

    if (view === 'messages') {
      setDashboardTab('messages');
      setCurrentView('dashboard');
    } else if (view === 'add-product') {
      setDashboardTab('add-product');
      setCurrentView('dashboard');
    } else {
      setDashboardTab('overview');
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= DEDICATED STANDALONE ADMIN PAGE =================
  // If user is on /admin or #admin, render its own dedicated separate page
  if (currentView === 'admin') {
    return (
      <AdminStandalonePage
        currentUser={currentUser}
        onNavigatePublic={() => handleNavigate('catalog')}
        onViewProductDetail={(p) => setSelectedProduct(p)}
        onDataReset={refreshAppData}
      />
    );
  }

  // ================= PUBLIC MARKETPLACE LAYOUT =================
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        unreadCount={unreadCount}
        onOpenAuth={(notice) => {
          setAuthRedirectNotice(notice || null);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'catalog' && (
          <CatalogView
            products={products}
            adVideos={adVideos}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onContactSupplier={handleContactSupplier}
            onContactSupplierById={handleContactSupplierById}
            onNavigateAddProduct={() => handleNavigate('add-product')}
            onNavigateVideos={() => handleNavigate('videos')}
          />
        )}

        {currentView === 'videos' && (
          <B2BVideoFeed
            ads={adVideos}
            onContactSupplier={(supplierId, prodId) => handleContactSupplierById(supplierId, prodId)}
            onViewProduct={(prodId) => {
              const target = getProductById(prodId);
              if (target) setSelectedProduct(target);
            }}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            onLogout={handleLogout}
            onViewProductDetail={(p) => setSelectedProduct(p)}
            initialTab={dashboardTab}
            onNavigateCatalog={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'contact' && (
          <ContactView onNavigateCatalog={() => handleNavigate('catalog')} />
        )}
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Bottom Tab Bar for Mobile & Android WebView */}
      <MobileTabBar
        currentUser={currentUser}
        unreadCount={unreadCount}
        currentView={currentView === 'dashboard' ? dashboardTab : currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => {
          setAuthRedirectNotice('Connectez-vous à votre compte WORLDORA.');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        currentUser={currentUser}
        onContactSupplier={handleContactSupplier}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingContactProduct(null);
          setAuthRedirectNotice(null);
        }}
        onSuccess={handleAuthSuccess}
        redirectNotice={authRedirectNotice || undefined}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setActiveConversation(null);
          refreshAppData();
        }}
        conversation={activeConversation}
        currentUser={currentUser}
        onRefreshConversations={refreshAppData}
      />
    </div>
  );
}
