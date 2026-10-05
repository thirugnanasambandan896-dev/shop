import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onFilterCategory: (cat: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onFilterCategory }) => {
  return (
    <section className="relative overflow-hidden bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Headline Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-medium">
              <span>Collection 2026</span>
              <span aria-hidden="true">·</span>
              <span>Architectural Living</span>
              <span aria-hidden="true">·</span>
              <span>Limited Editions</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.15] tracking-tight [text-wrap:balance]">
              Tactile design objects crafted for modern sanctuaries.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              From unlacquered solid brass and unpolished Italian travertine to custom acoustic planar drivers, each piece is engineered with enduring materials and slow artisanal care.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-3 bg-stone-900 text-stone-50 text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>Explore Curated Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onFilterCategory('Lighting')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-stone-800 text-sm font-medium rounded-lg hover:bg-stone-50 border border-stone-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Lighting Editions</span>
              </button>
            </div>

            {/* Adjacent Proof & Provenance Trust Marks */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-xs text-stone-600">
              <div>
                <p className="font-semibold text-stone-900">Complimentary</p>
                <p className="text-stone-500">Shipping over $150</p>
              </div>
              <div>
                <p className="font-semibold text-stone-900">10-Year</p>
                <p className="text-stone-500">Material Guarantee</p>
              </div>
              <div>
                <p className="font-semibold text-stone-900">100% Verified</p>
                <p className="text-stone-500">European Provenance</p>
              </div>
            </div>
          </div>

          {/* Hero Photography Container (16:9 aspect ratio) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 bg-stone-200 aspect-[16/10]">
              <img
                src="/src/assets/images/hero_curated_living_1791180832896.jpg"
                alt="Architectural modern living interior with travertine pedestal and morning sunlight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-mono tracking-wider uppercase text-stone-200">
                  Villa Bellevue Interior Suite · 01
                </span>
                <span className="font-serif italic text-stone-300">
                  Verona Travertine
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
