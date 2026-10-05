import React, { useState } from 'react';
import { X, Heart, Shield, RotateCcw, Truck, Star, Check, Plus, Minus } from 'lucide-react';
import { Product } from '../types/shop';
import { useShop } from '../context/ShopContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, addReview } = useShop();

  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length > 0 ? product.variants[0].name : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedVariant || undefined);
    onClose();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;
    addReview(product.id, {
      author: authorName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setAuthorName('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery / Visual Column */}
          <div className="bg-stone-100 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-inner bg-stone-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Quick Guarantees */}
            <div className="mt-6 pt-6 border-t border-stone-200/80 space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700 shrink-0" />
                <span>Complimentary insured shipping on orders over $150</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-stone-700 shrink-0" />
                <span>10-Year craftsmanship & material authenticity guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-stone-700 shrink-0" />
                <span>30-Day home trial with carbon-neutral return shipping</span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Origin kicker */}
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1.5">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.origin}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-stone-500 mt-1">
                {product.subtitle}
              </p>

              {/* Price & Rating Bar */}
              <div className="mt-4 flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-stone-900 font-mono tabular-nums">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono tabular-nums font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </button>
              </div>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Material / Finish: <span className="text-stone-500 normal-case">{selectedVariant}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant.name)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          selectedVariant === variant.name
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Indicator */}
              <div className="mt-4 text-xs">
                {product.stock > 5 ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    In Stock ({product.stock} units ready to dispatch)
                  </span>
                ) : product.stock > 0 ? (
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    Limited Run — Only {product.stock} pieces remaining
                  </span>
                ) : (
                  <span className="text-rose-600">Currently Sold Out</span>
                )}
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || product.stock <= 0}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-mono font-medium tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-6 bg-stone-900 text-stone-50 text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Bag — ${(product.price * quantity).toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className="p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isSaved ? 'fill-stone-900 text-stone-900' : 'text-stone-600'
                    }`}
                  />
                </button>
              </div>

              {/* Informational Tabs (Details / Specifications / Reviews) */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex gap-4 border-b border-stone-200 text-xs font-medium pb-2">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 transition-colors relative ${
                      activeTab === 'details'
                        ? 'text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Description
                    {activeTab === 'details' && (
                      <span className="absolute bottom-[-9px] left-0 w-full h-[1.5px] bg-stone-900" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-1 transition-colors relative ${
                      activeTab === 'specs'
                        ? 'text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Specifications & Care
                    {activeTab === 'specs' && (
                      <span className="absolute bottom-[-9px] left-0 w-full h-[1.5px] bg-stone-900" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-1 transition-colors relative ${
                      activeTab === 'reviews'
                        ? 'text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Reviews ({product.reviews.length})
                    {activeTab === 'reviews' && (
                      <span className="absolute bottom-[-9px] left-0 w-full h-[1.5px] bg-stone-900" />
                    )}
                  </button>
                </div>

                <div className="pt-4 text-xs text-stone-600 leading-relaxed min-h-[140px]">
                  {activeTab === 'details' && (
                    <p>{product.description}</p>
                  )}

                  {activeTab === 'specs' && (
                    <dl className="space-y-2">
                      <div className="flex justify-between border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">Materials</dt>
                        <dd className="font-medium text-stone-800 text-right">{product.materials}</dd>
                      </div>
                      <div className="flex justify-between border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">Dimensions / Weight</dt>
                        <dd className="font-medium text-stone-800 text-right">{product.dimensions}</dd>
                      </div>
                      <div className="flex justify-between border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">Provenance</dt>
                        <dd className="font-medium text-stone-800 text-right">{product.origin}</dd>
                      </div>
                      <div className="flex justify-between pt-1">
                        <dt className="text-stone-500">Care Instructions</dt>
                        <dd className="font-medium text-stone-800 text-right max-w-[200px]">{product.care}</dd>
                      </div>
                    </dl>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">
                          {product.reviews.length} Verified Customer Reviews
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="text-xs font-semibold text-stone-900 underline hover:text-stone-700"
                        >
                          {showReviewForm ? 'Cancel Review' : '+ Write a Review'}
                        </button>
                      </div>

                      {showReviewForm && (
                        <form
                          onSubmit={handleReviewSubmit}
                          className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2.5"
                        >
                          <div>
                            <label className="block text-[11px] font-medium text-stone-700">Your Name</label>
                            <input
                              type="text"
                              required
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              placeholder="e.g. Clara M."
                              className="w-full text-xs p-1.5 border border-stone-300 rounded bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-stone-700">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  className="p-0.5 text-stone-400 hover:text-amber-500"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= reviewRating
                                        ? 'fill-amber-500 text-amber-500'
                                        : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-stone-700">Feedback</label>
                            <textarea
                              required
                              rows={2}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Describe material tactile feel, build, or finish..."
                              className="w-full text-xs p-1.5 border border-stone-300 rounded bg-white"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800"
                          >
                            Post Review
                          </button>
                        </form>
                      )}

                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {product.reviews.map((rev) => (
                          <div key={rev.id} className="border-b border-stone-100 pb-2.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-stone-800">{rev.author}</span>
                              <span className="text-stone-400 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex text-amber-500 my-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rev.rating
                                      ? 'fill-amber-500 text-amber-500'
                                      : 'text-stone-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-stone-600 text-xs italic">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
