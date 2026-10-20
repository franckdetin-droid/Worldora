import React from 'react';
import { Product } from '../../types';
import { MapPin, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onContactSupplier?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            Image non disponible
          </div>
        )}

        {/* Origin tag */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-300" />
          <span>{product.countryOfOrigin}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Supplier */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <span className="truncate">{product.category}</span>
            {product.supplierVerified && (
              <span className="flex items-center gap-0.5 text-emerald-700 text-[11px] font-medium shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>Vérifié</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-slate-800 transition-colors">
            {product.name}
          </h3>

          {/* Company */}
          <p className="text-xs text-slate-600 mt-1 truncate">
            {product.supplierCompany || product.supplierName}
          </p>
        </div>

        {/* Pricing and MOQ Footer */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-baseline justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900 tabular-nums">
              {product.price.toLocaleString('fr-FR')} {product.currency}
              <span className="text-xs font-normal text-slate-500 ml-1">/ {product.unit}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              MOQ : {product.minOrderQty} {product.unit}s
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-950 transition-colors shrink-0">
            Détails →
          </span>
        </div>
      </div>
    </div>
  );
};
