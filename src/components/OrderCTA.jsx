import React from 'react';
import { MessageCircle, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export default function OrderCTA() {
  const { branding, content } = useBrand();
  const ctaData = content.order_cta || {};

  const whatsappNum = branding.whatsapp || '8681078776';
  const phoneNum = branding.phone || '8681078776';

  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Hi Iniyal’s Bake House! I would like to order brownies."
  )}`;

  return (
    <section id="order" className="py-24 bg-gradient-to-b from-chocolate-900 to-chocolate-950 text-cream-100 relative overflow-hidden">
      {/* Warm Background Highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-caramel-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-chocolate-850 border-2 border-gold-500/40 rounded-3xl p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chocolate-800 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-4 h-4 text-caramel-400" />
            <span>{ctaData.badge || "Fresh Batches Daily"}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-200 uppercase mb-4">
            {ctaData.heading || "CRAVING BROWNIES?"}
          </h2>

          <p className="text-cream-300 text-lg sm:text-2xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            {ctaData.text || "Your next chocolate craving is just one order away."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-base sm:text-lg tracking-wider rounded-full shadow-warm-lg hover:shadow-warm-glow transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{ctaData.cta || "ORDER NOW"}</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href={`tel:+91${phoneNum}`}
              className="w-full sm:w-auto px-8 py-5 bg-chocolate-800/90 hover:bg-chocolate-700 text-cream-200 hover:text-white font-semibold text-base sm:text-lg rounded-full border border-gold-500/40 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5 text-gold-400" />
              <span>Call: {phoneNum}</span>
            </a>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-cream-400">
            {ctaData.subtext || "Pre-orders welcome • Delivered fresh & secure • Custom gifting options available"}
          </p>

        </div>
      </div>
    </section>
  );
}
