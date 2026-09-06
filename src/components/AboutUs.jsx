import React from 'react';
import { Heart, Sparkles, ChefHat } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export default function AboutUs() {
  const { content } = useBrand();
  const about = content.about || {};

  return (
    <section id="about-us" className="py-24 bg-cream-200 text-chocolate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Story */}
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-caramel-600 font-script text-2xl">
              <ChefHat className="w-5 h-5 text-caramel-600" />
              <span>{about.badge || "Our Kitchen Philosophy"}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-chocolate-900 uppercase">
              {about.heading || "BAKED WITH LOVE"}
            </h2>

            <div className="w-16 h-1 bg-caramel-500 rounded-full" />

            {/* Brand Quote */}
            <blockquote className="text-lg sm:text-xl font-medium text-chocolate-900 leading-relaxed italic border-l-4 border-caramel-500 pl-4 py-1">
              “{about.quote || "At Iniyal’s Bake House, we believe the best brownies are made with simple ingredients, careful preparation and lots of love. Every batch is freshly prepared to give you that homemade taste you can feel in every bite."}”
            </blockquote>

            <p className="text-chocolate-700 text-base leading-relaxed">
              {about.description || "We never cut corners or rely on artificial additives. From rich cocoa and farm butter to slow temperature control in our home kitchen, every pan of brownies is handcrafted to bring happiness directly to your doorstep."}
            </p>

            {/* Homemade Values */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-gold-500/30 shadow-sm">
                <span className="font-serif text-2xl font-bold text-caramel-600 block">100%</span>
                <span className="text-xs sm:text-sm text-chocolate-800 font-medium">Small-Batch Homemade</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gold-500/30 shadow-sm">
                <span className="font-serif text-2xl font-bold text-caramel-600 block">Fresh</span>
                <span className="text-xs sm:text-sm text-chocolate-800 font-medium">Baked on Your Order</span>
              </div>
            </div>

          </div>

          {/* Right Image Display */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Decorative Frame */}
              <div className="absolute -inset-3 rounded-3xl border-2 border-dashed border-gold-500/40 transform rotate-1 pointer-events-none" />
              
              <div className="relative overflow-hidden rounded-2xl shadow-warm-lg bg-chocolate-950 border border-gold-500/30">
                <img
                  src={about.image || "/images/about-baking.jpg"}
                  alt="Iniyal's Bake House artisanal home baking ingredients and cooling rack of brownies"
                  className="w-full h-[360px] sm:h-[450px] object-cover object-center transform hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Little Signature Accent */}
              <div className="absolute -bottom-5 right-6 bg-chocolate-900 text-cream-200 border border-gold-500/40 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                <Heart className="w-5 h-5 text-caramel-500 fill-caramel-500" />
                <span className="font-script text-xl sm:text-2xl text-gold-400">
                  From our oven to your heart
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
