import React, { useState } from 'react';
import { Heart, Plus, Eye, Check } from 'lucide-react';
import { Product } from '../types/shop';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useShop();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Slot (4:3 ratio) with hover interactions */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          /* Styled Fallback container */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 text-stone-400">
            <span className="font-serif italic text-stone-500 text-lg">{product.name}</span>
            <span className="text-xs uppercase tracking-wider mt-1">{product.category}</span>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Subtle text badge */}
          {product.isNew ? (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-stone-900 text-white rounded">
              New Arrival
            </span>
          ) : product.stock <= 5 && product.stock > 0 ? (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-amber-800 text-amber-50 rounded">
              Only {product.stock} Left
            </span>
          ) : product.stock === 0 ? (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-stone-200 text-stone-600 rounded">
              Sold Out
            </span>
          ) : (
            <span />
          )}

          {/* Wishlist toggle */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label="Save to Wishlist"
            className="pointer-events-auto p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 hover:text-stone-900 hover:bg-white shadow-sm transition-transform active:scale-95"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-stone-900 text-stone-900' : 'text-stone-600'
              }`}
            />
          </button>
        </div>

        {/* Hover Quick Action Tray */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900/95 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-stone-900 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            aria-label="Quick View Details"
            className="p-2 bg-white/95 backdrop-blur-sm text-stone-800 rounded-lg hover:bg-white shadow-md transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Clean unboxed metadata with dot separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.origin.split(',')[0]}</span>
          </div>

          <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mt-1">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Rating Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-stone-900 font-mono tabular-nums text-base">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-500 font-mono tabular-nums">
            <span className="text-amber-600 font-semibold">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
};
