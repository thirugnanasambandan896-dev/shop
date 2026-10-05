import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Home, PackageCheck, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types/shop';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const { orders, getOrderById, lastPlacedOrder } = useShop();
  const [searchInput, setSearchInput] = useState(lastPlacedOrder ? lastPlacedOrder.id : '');
  const [foundOrder, setFoundOrder] = useState<Order | null>(lastPlacedOrder || null);
  const [hasSearched, setHasSearched] = useState(Boolean(lastPlacedOrder));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const ord = getOrderById(searchInput);
    setFoundOrder(ord || null);
    setHasSearched(true);
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return 1;
      case 'Packed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 1;

  const steps = [
    { title: 'Order Confirmed', desc: 'Craftsmanship verified & scheduled', icon: Clock },
    { title: 'Hand-Packed', desc: 'Protected in archival custom casing', icon: PackageCheck },
    { title: 'In Transit', desc: 'Climate-neutral air / road dispatch', icon: Truck },
    { title: 'Delivered', desc: 'Delivered to recipient address', icon: Home },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Track Your Shipment
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter your Atelier reference code to view real-time courier dispatch progress
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg transition-colors"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order # (e.g. ORD-8941, ORD-8938)"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Lookup
            </button>
          </form>

          {/* Quick Demo Pickers */}
          {orders.length > 0 && (
            <div className="text-xs text-stone-500 flex items-center gap-2 flex-wrap">
              <span>Recent test references:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => {
                    setSearchInput(o.id);
                    setFoundOrder(o);
                    setHasSearched(true);
                  }}
                  className="font-mono px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] transition-colors"
                >
                  {o.id} ({o.status})
                </button>
              ))}
            </div>
          )}

          {/* Tracking Result View */}
          {foundOrder ? (
            <div className="space-y-6">
              {/* Order Meta Header */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block">Reference ID</span>
                  <span className="font-mono text-sm font-semibold text-stone-900">{foundOrder.id}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Carrier Tracking</span>
                  <span className="font-mono text-stone-800">{foundOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Estimated Arrival</span>
                  <span className="font-medium text-stone-800">{foundOrder.estimatedDelivery}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Recipient</span>
                  <span className="font-medium text-stone-800">{foundOrder.customerName}</span>
                </div>
              </div>

              {/* Visual Timeline Stepper */}
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 -z-0" />
                  <div
                    className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-stone-900 transition-all duration-500 -z-0"
                    style={{
                      width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)}%`,
                    }}
                  />

                  {steps.map((st, index) => {
                    const stepNumber = index + 1;
                    const isDone = currentStep >= stepNumber;
                    const isCurrent = currentStep === stepNumber;
                    const Icon = st.icon;

                    return (
                      <div key={st.title} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                            isDone
                              ? 'bg-stone-900 text-white'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-stone-100' : ''}`}
                        >
                          {isDone && !isCurrent ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold mt-2 text-center ${isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                          {st.title}
                        </span>
                        <span className="text-[10px] text-stone-500 text-center hidden sm:block max-w-[100px]">
                          {st.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border-t border-stone-200 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Shipment Contents
                </h4>
                <div className="space-y-2">
                  {foundOrder.items.map((it) => (
                    <div key={it.cartId} className="flex justify-between items-center text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-stone-200 overflow-hidden shrink-0">
                          <img
                            src={it.product.image}
                            alt={it.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">{it.product.name}</p>
                          {it.selectedVariant && (
                            <p className="text-[11px] text-stone-500">Finish: {it.selectedVariant}</p>
                          )}
                        </div>
                      </div>
                      <div className="font-mono text-stone-800 font-medium">
                        Qty: {it.quantity} · ${(it.product.price * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address */}
              <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-800">Dispatch Destination:</span>{' '}
                {foundOrder.shippingAddress.street}, {foundOrder.shippingAddress.city},{' '}
                {foundOrder.shippingAddress.zip}, {foundOrder.shippingAddress.country}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-8 text-stone-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-semibold text-stone-800 text-sm">No order found with reference &quot;{searchInput}&quot;</p>
              <p className="text-xs max-w-sm mx-auto">
                Please double-check the order code received on your receipt or email (e.g. ORD-8941).
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
