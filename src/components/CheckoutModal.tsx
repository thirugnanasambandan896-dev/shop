import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck, Printer, ArrowRight, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types/shop';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    placeOrder,
    setIsTrackingOpen,
    setActiveView,
  } = useShop();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmed'>('shipping');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !street || !city || !zip) return;
    setStep('payment');
  };

  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const finalShipping = deliveryMethod === 'express' ? 25 : cartShipping;
    const finalTotal = Math.round((cartSubtotal - cartDiscount + finalShipping + cartTax) * 100) / 100;

    const newOrder = placeOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone || '+1 (555) 019-2834',
      shippingAddress: {
        street,
        city,
        state: state || 'NY',
        zip,
        country,
      },
      deliveryMethod,
      paymentMethod,
      items: cart,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: finalShipping,
      tax: cartTax,
      total: finalTotal,
      notes: notes || undefined,
    });

    setCompletedOrder(newOrder);
    setStep('confirmed');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleTrackNewOrder = () => {
    onClose();
    setIsTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              {step === 'confirmed' ? 'Order Confirmed' : 'Checkout & Delivery'}
            </h2>
            <p className="text-xs text-stone-500">
              {step === 'shipping' && 'Step 1 of 2: Shipping & Contact details'}
              {step === 'payment' && 'Step 2 of 2: Delivery speed & Payment authorization'}
              {step === 'confirmed' && `Order ${completedOrder?.id} successfully created`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: Shipping Address */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.vance@studio.com"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone (for dispatch notifications)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 012-3456"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="284 Hudson Street, Apt 4B"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State / Prov</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Postal / Zip</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="10013"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, reception drop-off instructions..."
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                />
              </div>

              {/* Order total preview */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-600">
                  <span>Cart items: <strong>{cart.reduce((s, i) => s + i.quantity, 0)}</strong> · </span>
                  <span>Estimated Total: <strong>${cartTotal.toFixed(2)}</strong></span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Speed & Payment Authorization */}
          {step === 'payment' && (
            <form onSubmit={handleFinalOrder} className="space-y-5">
              {/* Delivery method choice */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Delivery Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryMethod === 'standard'
                        ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-center font-semibold text-stone-900">
                      <span>Standard Climate Neutral</span>
                      <span className="font-mono">{cartShipping === 0 ? 'Free' : `$${cartShipping}`}</span>
                    </div>
                    <p className="text-stone-500 mt-1">Delivered in 3–5 business days</p>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryMethod === 'express'
                        ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-center font-semibold text-stone-900">
                      <span>Express Air Priority</span>
                      <span className="font-mono">$25.00</span>
                    </div>
                    <p className="text-stone-500 mt-1">Delivered in 1–2 business days</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'apple_pay'
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs p-2 border border-stone-300 rounded bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">CVC Security Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full text-xs p-2 border border-stone-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-600 text-center">
                  <p className="font-semibold text-stone-900">Apple Pay Simulator Ready</p>
                  <p className="mt-1">Touch ID / Face ID simulation will authorize on order placement.</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-semibold">Cash on Delivery (COD) Policy</p>
                  <p className="mt-1">
                    Please prepare exact cash for the courier at dispatch. No additional fees apply. Customer verification will occur via SMS.
                  </p>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="border-t border-stone-200 pt-3 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Shipping Address</span>
                  <span className="font-medium text-stone-800">{street}, {city}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-900 text-sm pt-1">
                  <span>Grand Total to Pay</span>
                  <span className="font-mono tabular-nums">
                    ${(
                      cartSubtotal -
                      cartDiscount +
                      (deliveryMethod === 'express' ? 25 : cartShipping) +
                      cartTax
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-stone-600 hover:text-stone-900 underline"
                >
                  Back to shipping details
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmed / Receipt View */}
          {step === 'confirmed' && completedOrder && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/80 p-4 rounded-xl border border-emerald-200">
                <CheckCircle className="w-10 h-10 text-emerald-700 shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-950 text-base">
                    Order Received & Preparing for Shipment
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Order confirmation email sent to <strong>{completedOrder.customerEmail}</strong>
                  </p>
                </div>
              </div>

              {/* Order Receipt Details */}
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 text-xs space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-stone-400 block">Order Reference</span>
                    <strong className="font-mono text-stone-900 text-sm">{completedOrder.id}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Carrier Tracking #</span>
                    <strong className="font-mono text-stone-900 text-sm">{completedOrder.trackingNumber}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Estimated Arrival</span>
                    <strong className="text-stone-900">{completedOrder.estimatedDelivery}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Status</span>
                    <strong className="text-emerald-700">{completedOrder.status}</strong>
                  </div>
                </div>

                {/* Items Purchased List */}
                <div className="space-y-2 pt-1">
                  <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] block">
                    Itemized Order Summary
                  </span>
                  {completedOrder.items.map((item) => (
                    <div key={item.cartId} className="flex justify-between items-center text-xs">
                      <span className="text-stone-700">
                        {item.quantity}× {item.product.name}
                        {item.selectedVariant && ` (${item.selectedVariant})`}
                      </span>
                      <span className="font-mono text-stone-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-stone-200 pt-2 space-y-1 font-mono">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span>${completedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>-${completedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500">
                    <span>Shipping</span>
                    <span>${completedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Tax</span>
                    <span>${completedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-900 font-semibold text-sm pt-1 border-t border-stone-200">
                    <span>Total Paid</span>
                    <span>${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTrackNewOrder}
                  className="flex-1 py-2.5 px-4 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Track This Order Live</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="py-2.5 px-4 bg-white border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 text-stone-500 hover:text-stone-900 text-xs font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
