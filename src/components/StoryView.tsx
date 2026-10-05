import React from 'react';
import { ArrowLeft, Compass, Shield, Feather, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const StoryView: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
      <button
        onClick={() => setActiveView('store')}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Storefront</span>
      </button>

      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
          <span>The Atelier Manifesto</span>
          <span aria-hidden="true">·</span>
          <span>Founded 2021</span>
          <span aria-hidden="true">·</span>
          <span>Verona · Kyoto · Copenhagen</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 leading-[1.15] tracking-tight [text-wrap:balance]">
          In pursuit of quiet permanence and the tactile honesty of raw matter.
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-stone-600 max-w-2xl">
          &ldquo;We do not build disposable luxury. We collaborate with generational stone-cutters, brass turners, and acoustic engineers to create objects that mature with quiet grace.&rdquo;
        </p>
      </div>

      {/* Visual Showcase */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200">
        <img
          src="/src/assets/images/hero_curated_living_1791180832896.jpg"
          alt="Artisanal living workshop with warm sunlight and natural materials"
          referrerPolicy="no-referrer"
          className="w-full h-80 sm:h-96 object-cover"
        />
      </div>

      {/* Editorial Chapters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold text-stone-400">01</span>
          <h3 className="font-serif text-xl font-semibold text-stone-900">
            Unlacquered Brass & Stone
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All brass fixtures are left raw without chemical artificial lacquers. Over seasons of morning rituals, the metal naturally patinas with human touch, recording time rather than decaying.
          </p>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold text-stone-400">02</span>
          <h3 className="font-serif text-xl font-semibold text-stone-900">
            Sovereign Acoustics
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our audio objects balance open-back planar dynamics with sustainably felled smoked European oak. No plastic enclosures, no planned obsolescence, only replaceable lambskin and pure copper conductors.
          </p>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold text-stone-400">03</span>
          <h3 className="font-serif text-xl font-semibold text-stone-900">
            Carbon-Zero Fulfillment
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every shipment is encased in unbleached mold-formed cellulose and shipped through verified carbon-offset sea and electric freight networks.
          </p>
        </div>
      </div>

      {/* Workshop Quote Banner */}
      <div className="bg-stone-100 p-8 rounded-2xl border border-stone-200 text-center space-y-4">
        <p className="font-serif text-2xl text-stone-900 max-w-xl mx-auto">
          &ldquo;True design does not demand attention; it settles into your space like morning light.&rdquo;
        </p>
        <p className="text-xs text-stone-500 uppercase tracking-widest">
          Nikolai Rostrup · Lead Architectural Director
        </p>
      </div>
    </div>
  );
};
