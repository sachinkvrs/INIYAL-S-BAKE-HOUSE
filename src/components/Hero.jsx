import React from 'react';
import { ArrowDown, Sparkles, Heart, Clock, ShieldCheck } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export default function Hero() {
  const { branding, content } = useBrand();
  const heroData = content.hero || {};

  const whatsappNum = branding.whatsapp || '8681078776';
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Hi Iniyal’s Bake House! I would like to order brownies."
  )}`;

  return (
    <section 
      id="home" 
      className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-chocolate-950 via-chocolate-900 to-chocolate-950 text-cream-100 flex items-center overflow-hidden"
    >
      {/* Subtle warm background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D9B27C_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-caramel-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Artisanal Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chocolate-800/80 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-medium shadow-inner tracking-wide">
              <Sparkles className="w-4 h-4 text-caramel-400" />
              <span>{heroData.badgeText || "Artisanal Homemade Brownies"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-cream-200 leading-[1.08]">
              {heroData.heading1 || "HOMEMADE"} <br />
              <span className="text-gold-500 font-extrabold italic">
                {heroData.headingHighlight || "BROWNIES"}
              </span> <br />
              {heroData.heading2 || "MADE WITH LOVE"}
            </h1>

            {/* Subtitle */}
            <p className="text-cream-300 text-lg sm:text-xl font-normal max-w-xl leading-relaxed">
              {heroData.subtext || "Rich, fudgy and freshly baked brownies made with quality ingredients."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-caramel-500 hover:bg-caramel-600 text-white font-bold tracking-wider rounded-full shadow-warm-lg hover:shadow-warm-glow transition-all duration-300 text-center text-sm sm:text-base transform hover:-translate-y-1 active:translate-y-0"
              >
                {heroData.ctaPrimary || "ORDER NOW"}
              </a>
              <a
                href="#menu"
                className="w-full sm:w-auto px-8 py-4 bg-chocolate-800/80 hover:bg-chocolate-800 text-cream-200 hover:text-gold-400 font-semibold tracking-wider rounded-full border border-gold-500/30 transition-all duration-300 text-center text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <span>{heroData.ctaSecondary || "VIEW MENU"}</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-chocolate-800/80 w-full grid grid-cols-3 gap-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Clock className="w-5 h-5 text-caramel-400 shrink-0" />
                <span className="text-xs sm:text-sm text-cream-300 font-medium">Fresh Baked on Order</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-caramel-400 shrink-0" />
                <span className="text-xs sm:text-sm text-cream-300 font-medium">Pure Ingredients</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Heart className="w-5 h-5 text-caramel-400 shrink-0" />
                <span className="text-xs sm:text-sm text-cream-300 font-medium">100% Homemade</span>
              </div>
            </div>

          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-caramel-500/15 rounded-3xl blur-2xl transform scale-95" />

            {/* Hero Image Container */}
            <div className="relative z-10 w-full max-w-lg lg:max-w-xl group">
              <div className="relative overflow-hidden rounded-2xl border-4 border-gold-500/30 shadow-2xl bg-chocolate-950">
                <img
                  src={heroData.heroImage || "/images/hero-brownie.jpg"}
                  alt="Decadent stack of freshly baked chocolate brownies with glossy crackly top, fudgy center and chocolate chunks"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/70 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Chef's Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:left-4 bg-chocolate-900/95 border border-gold-500/50 rounded-xl p-3 sm:p-4 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-caramel-500/20 flex items-center justify-center text-caramel-400 font-serif font-bold text-lg">
                  ★
                </div>
                <div>
                  <p className="text-xs text-gold-400 font-medium uppercase tracking-wider">Our Promise</p>
                  <p className="text-xs sm:text-sm font-semibold text-cream-200">No Preservatives • Pure Cocoa</p>
                </div>
              </div>

              {/* Floating Aroma Pill */}
              <div className="absolute -top-4 -right-2 sm:-top-5 sm:right-4 bg-caramel-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg transform rotate-2">
                Fresh From The Oven
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
