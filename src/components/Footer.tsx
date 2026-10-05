import React from 'react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveView, setIsTrackingOpen } = useShop();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl tracking-tight text-stone-100">
              ATELIER & CO.
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Curating tactile architectural lighting, acoustic hardware, unpolished natural stone, and cold-pressed botanical essences for intentional living environments.
            </p>
            <div className="pt-2 flex items-center gap-4 text-stone-400">
              <span className="text-stone-500">Studios:</span>
              <span>Verona</span>
              <span aria-hidden="true">·</span>
              <span>Kyoto</span>
              <span aria-hidden="true">·</span>
              <span>Copenhagen</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-stone-200 text-[11px]">
              Storefront
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  Featured Editions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-stone-200 transition-colors"
                >
                  Live Order Dispatch Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('story')}
                  className="hover:text-stone-200 transition-colors"
                >
                  Artisanal Manifesto
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-stone-200 transition-colors text-amber-300"
                >
                  Merchant Management Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-stone-200 text-[11px]">
              Collections
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Living & Tactile Ceramics</li>
              <li>Architectural Lighting</li>
              <li>Planar Studio Audio</li>
              <li>Botanical Apothecary</li>
              <li>Heirloom Brass Objects</li>
            </ul>
          </div>

          {/* Customer Service & Guarantees */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-stone-200 text-[11px]">
              Customer Concierge
            </h4>
            <p className="text-stone-400 text-xs">
              Direct workshop assistance:<br />
              <span className="text-stone-200 font-mono">concierge@atelier-co.store</span>
            </p>
            <p className="text-stone-500 text-[11px] pt-1">
              Mon–Fri 08:00–18:00 CET<br />
              30-day home trial on all architectural lighting
            </p>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Atelier & Co. All rights reserved. Registered trademark.</p>
          <div className="flex items-center gap-6">
            <span>Climate-Neutral Freight</span>
            <span>Zero-Plastics Archival Packing</span>
            <span>Master Artisan Guild</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
