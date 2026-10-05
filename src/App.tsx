import React, { useState, useMemo } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { MerchantDashboard } from './components/MerchantDashboard';
import { StoryView } from './components/StoryView';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Search, SlidersHorizontal, X, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { Product } from './types/shop';

const ShopContent: React.FC = () => {
  const {
    products,
    activeView,
    setActiveView,
    selectedProduct,
    setSelectedProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isTrackingOpen,
    setIsTrackingOpen,
    wishlist,
  } = useShop();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = ['All', 'Lighting', 'Living', 'Audio', 'Apothecary', 'Objects'];

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSubtitle = p.subtitle.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesMaterials = p.materials.toLowerCase().includes(query);
        if (!matchesName && !matchesSubtitle && !matchesCategory && !matchesMaterials) {
          return false;
        }
      }

      // In stock only
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Wishlist only
      if (wishlistOnly && !wishlist.includes(p.id)) {
        return false;
      }

      // Price range
      if (priceRange === 'under-100' && p.price >= 100) return false;
      if (priceRange === '100-250' && (p.price < 100 || p.price > 250)) return false;
      if (priceRange === '250-plus' && p.price < 250) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, wishlistOnly, priceRange, sortBy, wishlist]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
    setInStockOnly(false);
    setWishlistOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 font-sans">
      {/* Top Banner (Slim dismissible promo) */}
      <aside aria-label="Announcement" className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4 text-center border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>Complimentary worldwide shipping on orders exceeding $150</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span className="text-stone-400">Use code <strong className="font-mono text-white">ATELIER15</strong> for 15% off</span>
        </div>
      </aside>

      {/* Top Bar Contract (Wordmark — 4-6 nav links — primary actions) */}
      <Navbar
        onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
        searchQuery={searchQuery}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <MerchantDashboard />
        ) : activeView === 'story' ? (
          <StoryView />
        ) : (
          <div>
            {/* Hero Campaign Showcase */}
            <HeroBanner
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onFilterCategory={(cat) => {
                setSelectedCategory(cat);
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Catalog Section */}
            <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-medium mb-1">
                    <span>Atelier Catalog</span>
                    <span aria-hidden="true">·</span>
                    <span>{products.length} Curated Objects</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-tight">
                    {wishlistOnly ? 'Saved Wishlist Items' : selectedCategory === 'All' ? 'Complete Collection' : `${selectedCategory} Editions`}
                  </h2>
                </div>

                {/* Filter Summary & Controls */}
                <div className="flex items-center gap-3">
                  {wishlistOnly && (
                    <button
                      onClick={() => setWishlistOnly(false)}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium bg-stone-100 px-3 py-1.5 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Viewing Saved Items ({wishlist.length})</span>
                    </button>
                  )}

                  {/* Sort selector */}
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span className="hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                    >
                      <option value="featured">Curated & Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Bar (Collapsible / Active) */}
              {(isSearchOpen || searchQuery) && (
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3 animate-in fade-in duration-200">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by object name, material (e.g. travertine, brass), or provenance..."
                    className="w-full text-xs bg-transparent focus:outline-none placeholder:text-stone-400"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-stone-400 hover:text-stone-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {/* Segmented Filter Control Bar (Permitted interactive segmented controls) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Category segmented tabs */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setWishlistOnly(false);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat && !wishlistOnly
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Secondary Filters: Price, In-stock, Wishlist */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Price range pills */}
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none"
                  >
                    <option value="all">Any Price</option>
                    <option value="under-100">Under $100</option>
                    <option value="100-250">$100 – $250</option>
                    <option value="250-plus">$250 and above</option>
                  </select>

                  {/* In Stock toggle */}
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      inStockOnly
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    In Stock Only
                  </button>

                  {/* Wishlist filter */}
                  <button
                    onClick={() => setWishlistOnly(!wishlistOnly)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      wishlistOnly
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlistOnly ? 'fill-white' : ''}`} />
                    <span>Saved ({wishlist.length})</span>
                  </button>
                </div>
              </div>

              {/* Product Grid (Generous 3-column desktop layout with gap-6 to gap-8) */}
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-stone-800">
                    No matching objects found
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    We could not find items matching your selected criteria. Try adjusting filters or search terms.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Artisanal Craftsmanship Section */}
            <section className="bg-stone-100/70 border-t border-stone-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                      Material Provenance & Traceability
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 leading-tight [text-wrap:balance]">
                      Direct from generational European stone masons and acoustic workshops.
                    </h2>
                    <p className="text-stone-600 text-sm leading-relaxed max-w-xl">
                      Each lamp base is waterjet cut from solid Verona travertine quarries with natural pore variations. Never reconstituted aggregate, never synthetic veneers.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveView('story')}
                        className="text-xs font-semibold text-stone-900 border-b-2 border-stone-900 pb-0.5 hover:text-stone-700 transition-colors"
                      >
                        Read the Atelier Manifesto →
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <h4 className="font-serif text-lg font-semibold text-stone-900">Verona Travertine</h4>
                      <p className="text-xs text-stone-500 mt-1">Quarried in Veneto, cut without chemical sealants.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <h4 className="font-serif text-lg font-semibold text-stone-900">Unspun Brass</h4>
                      <p className="text-xs text-stone-500 mt-1">High-copper alloy developing natural patina.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <h4 className="font-serif text-lg font-semibold text-stone-900">Smoked Oak</h4>
                      <p className="text-xs text-stone-500 mt-1">Sustainably felled Austrian timber acoustic cups.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <h4 className="font-serif text-lg font-semibold text-stone-900">Wild Hinoki</h4>
                      <p className="text-xs text-stone-500 mt-1">Cold-pressed botanical tree extract from Wakayama.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <OrderLookupModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Notification Toast */}
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
