import React from 'react';
import { Product, User } from '../../types';
import {
  X,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Building,
  Truck,
  Clock,
  Package,
  Layers,
  AlertTriangle,
  FileText,
  Download,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onContactSupplier: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  currentUser,
  onContactSupplier,
}) => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [warningMessage, setWarningMessage] = React.useState<string | null>(null);

  if (!isOpen || !product) return null;

  const isOwnProduct = currentUser && currentUser.id === product.supplierId;

  const handleContactClick = () => {
    setWarningMessage(null);
    if (!currentUser) {
      // Need login first
      onContactSupplier(product);
      return;
    }

    if (isOwnProduct) {
      setWarningMessage(
        'Vous êtes le fournisseur de ce produit. Vous ne pouvez pas démarrer une conversation avec vous-même.'
      );
      return;
    }

    onContactSupplier(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-200">{product.category}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-300 truncate max-w-[240px] sm:max-w-md">{product.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {warningMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Top Grid: Gallery & Purchase Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-4/3 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails if multiple */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-slate-900' : 'border-slate-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Summary & Primary CTA */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{product.brand || 'Fabrication certifiée'}</span>
                  {product.sku && (
                    <>
                      <span>·</span>
                      <span>Réf : {product.sku}</span>
                    </>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Pricing Box */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {product.price.toLocaleString('fr-FR')} {product.currency}
                    </span>
                    <span className="text-sm text-slate-600 font-medium">
                      / {product.unit}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Quantité min (MOQ) :</span>{' '}
                      <span className="font-semibold text-slate-900">
                        {product.minOrderQty} {product.unit}s
                      </span>
                    </div>
                    {product.stock !== undefined && (
                      <div>
                        <span className="text-slate-500">Disponibilité :</span>{' '}
                        <span className="font-semibold text-slate-900">
                          {product.stock} {product.unit}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Logistic Specs */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      Pays d'origine : <strong className="text-slate-900">{product.countryOfOrigin}</strong>
                    </span>
                  </div>
                  {product.shippingTerms && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Incoterms / Livraison : <strong className="text-slate-900">{product.shippingTerms}</strong>
                      </span>
                    </div>
                  )}
                  {product.leadTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Délai de préparation : <strong className="text-slate-900">{product.leadTime}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PRIMARY ACTION BUTTON: Envoyez un message (replaces devis) */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleContactClick}
                  className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer active:scale-99"
                >
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>Envoyer un message au fournisseur</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Messagerie B2B privée et directe. Discutez des volumes, échantillons et tarifs sans intermédiaire.
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Description détaillée du produit
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Technical Documents & Certificates if present */}
          {product.documents && product.documents.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Fiches techniques & Documents joints ({product.documents.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    download={doc.name}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-slate-950">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-900 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Supplier Card */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  {product.supplierCompany ? product.supplierCompany.charAt(0) : 'F'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {product.supplierCompany || product.supplierName}
                    </h4>
                    {product.supplierVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Fournisseur Certifié
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{product.supplierCountry || product.countryOfOrigin}</span>
                    <span>·</span>
                    <span>Contact : {product.supplierName}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContactClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contacter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
