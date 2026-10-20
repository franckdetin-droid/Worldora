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
  loginUser,
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
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminAccessModal } from './components/admin/AdminAccessModal';
import { B2BVideoFeed } from './components/videos/B2BVideoFeed';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [adVideos, setAdVideos] = useState<AdVideo[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [currentView, setCurrentView] = useState<
    'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product'
  >('catalog');
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
    if (window.location.hash === '#admin' || window.location.search.includes('admin=1')) {
      const adminRes = loginUser('admin@worldora.com');
      if (adminRes.success && adminRes.user) {
        setCurrentUser(adminRes.user);
        setUnreadCount(getTotalUnreadCount(adminRes.user.id));
      }
      setCurrentView('admin');
    }
  }, []);

  // When user logs in
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setUnreadCount(getTotalUnreadCount(user.id));
    setIsAuthModalOpen(false);

    // If user is Admin and logged in from an admin intent, switch to admin view
    if (user.isAdmin && (currentView === 'admin' || authRedirectNotice?.includes('administrateur'))) {
      setCurrentView('admin');
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
    view: 'catalog' | 'videos' | 'dashboard' | 'admin' | 'messages' | 'add-product'
  ) => {
    if (view === 'catalog') {
      setCurrentView('catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'videos') {
      setCurrentView('videos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Admin route: Immediate direct access for the creator
    if (view === 'admin') {
      if (!currentUser || !currentUser.isAdmin) {
        const adminRes = loginUser('admin@worldora.com');
        if (adminRes.success && adminRes.user) {
          setCurrentUser(adminRes.user);
          setUnreadCount(getTotalUnreadCount(adminRes.user.id));
        }
      }
      setCurrentView('admin');
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

        {currentView === 'admin' && (
          <AdminDashboardView
            currentUser={
              currentUser && currentUser.isAdmin
                ? currentUser
                : {
                    id: 'user-admin-root',
                    name: 'Direction Générale WORLDORA',
                    email: 'admin@worldora.com',
                    accountType: 'both',
                    companyName: 'WORLDORA Global Headquarters',
                    country: 'France',
                    city: 'Paris',
                    description: 'Super Administrateur de la plateforme WORLDORA.',
                    verified: true,
                    isAdmin: true,
                    createdAt: '2025-01-01T00:00:00Z',
                  }
            }
            onLogout={handleLogout}
            onNavigateCatalog={() => setCurrentView('catalog')}
            onViewProductDetail={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            onLogout={handleLogout}
            onViewProductDetail={(p) => setSelectedProduct(p)}
            initialTab={dashboardTab}
            onNavigateCatalog={() => setCurrentView('catalog')}
            onNavigateAdmin={() => handleNavigate('admin')}
          />
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
