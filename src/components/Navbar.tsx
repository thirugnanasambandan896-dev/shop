import React from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavbarProps {
  onSearchClick: () => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsTrackingOpen,
  } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveView('store')}
            className="text-left group focus-visible:outline-none"
          >
            <span className="font-serif text-2xl tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
              ATELIER & CO.
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean unboxed text links) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveView('store')}
            className={`transition-colors relative py-1 ${
              activeView === 'store'
                ? 'text-stone-900 font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Storefront
            {activeView === 'store' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-900" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveView('store');
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-stone-500 hover:text-stone-900 transition-colors py-1"
          >
            Collections
          </button>

          <button
            onClick={() => setIsTrackingOpen(true)}
            className="text-stone-500 hover:text-stone-900 transition-colors py-1 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Track Order
          </button>

          <button
            onClick={() => setActiveView('story')}
            className={`transition-colors relative py-1 ${
              activeView === 'story'
                ? 'text-stone-900 font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Artisanal Manifesto
            {activeView === 'story' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-900" />
            )}
          </button>

          {/* Mode Switcher: Store Manager Hub */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
            className={`transition-colors py-1 flex items-center gap-1.5 text-xs font-semibold ${
              activeView === 'admin'
                ? 'text-amber-800'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Toggle Shopkeeper & Inventory Management"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {activeView === 'admin' ? 'Exit Manager' : 'Shop Manager'}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onSearchClick}
            aria-label="Search catalog"
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-md hover:bg-stone-100"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Wishlist count */}
          <div className="relative">
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Wishlist"
              className="p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-md hover:bg-stone-100 relative"
            >
              <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? 'fill-stone-900 text-stone-900' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-stone-900" />
              )}
            </button>
          </div>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-stone-50 rounded-lg hover:bg-stone-800 transition-colors text-xs font-medium cursor-pointer"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono tabular-nums text-stone-300">
              ({cartCount})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
