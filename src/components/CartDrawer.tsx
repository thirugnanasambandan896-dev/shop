import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus, Tag, Check, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    activePromo,
    applyPromo,
    removePromo,
    setIsCheckoutOpen,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ isError: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoFeedback({ isError: false, message: res.message });
      setPromoInput('');
    } else {
      setPromoFeedback({ isError: true, message: res.message });
    }
    setTimeout(() => setPromoFeedback(null), 3500);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex justify-between text-xs text-stone-600 mb-1.5">
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong className="font-mono">${amountToFreeShipping.toFixed(2)}</strong> for free worldwide shipping
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Unlocked complimentary worldwide shipping!
                </span>
              )}
              <span className="font-mono text-stone-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-3">
              <ShoppingBag className="w-12 h-12 stroke-1 text-stone-300" />
              <p className="font-serif text-base text-stone-700">Your bag is empty</p>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore our curated architectural objects, lighting, and botanical scents to add to your collection.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs font-semibold text-stone-900 border-b border-stone-900 pb-0.5"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <div className="w-18 h-18 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200/80">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        Finish: {item.selectedVariant}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:text-stone-900"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono tabular-nums text-stone-900 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
            {/* Promo code entry */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-2.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ATELIER15)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-medium transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Promo feedback banner */}
              {promoFeedback && (
                <p
                  className={`text-[11px] flex items-center gap-1 ${
                    promoFeedback.isError ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {promoFeedback.isError ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  {promoFeedback.message}
                </p>
              )}

              {activePromo && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                  <span>Promo {activePromo.code} (-{activePromo.discountPercent}%)</span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-stone-500 hover:text-stone-800 text-[11px] font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-stone-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount</span>
                  <span className="font-mono tabular-nums">-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums text-stone-900">
                  {cartShipping === 0 ? 'Complimentary' : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono tabular-nums text-stone-900">${cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span className="font-mono tabular-nums">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-stone-900 text-stone-50 text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
