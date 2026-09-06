import React from 'react';
import { ShoppingBag, Star, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

export default function FeaturedProduct() {
  const { branding, content } = useBrand();
  const { addToCart } = useCart();
  const feat = content.featured || {};

  const whatsappNum = branding.whatsapp || '8681078776';
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Hi Iniyal’s Bake House! I would like to order your signature Fudgy Brownie."
  )}`;

  return (
    <section className="py-24 bg-chocolate-950 text-cream-100 relative overflow-hidden border-y border-chocolate-800">
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-caramel-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-chocolate-900/90 rounded-3xl border border-gold-500/30 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Large Visual (Close-Up Photograph) */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[500px] w-full overflow-hidden">
              <img
                src={feat.image || "/images/featured-brownie.jpg"}
                alt="Signature Fudgy Brownie sliced open showing molten chocolate center and crackly top"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-chocolate-900/80 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900 via-transparent to-transparent lg:hidden" />

              {/* Bestseller Badge */}
              <div className="absolute top-6 left-6 bg-caramel-500 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-white text-white" />
                <span>SIGNATURE RECIPE</span>
              </div>
            </div>

            {/* Right Copy & Details */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              
              <div className="flex items-center gap-2 text-gold-400 font-script text-2xl mb-1">
                <Sparkles className="w-5 h-5 text-caramel-400" />
                <span>{feat.subtext || "Customer Favorite"}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-cream-200 uppercase leading-tight">
                {feat.heading || "THE ONE EVERYONE LOVES"}
              </h2>

              <div className="w-12 h-1 bg-caramel-500 my-4 rounded-full" />

              <p className="text-cream-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                {feat.description || "Dense, rich, fudgy and loaded with chocolate flavour. Our signature brownie is baked to give you that perfect crackly top and irresistible soft center."}
              </p>

              {/* Sensorial Feature Checkmarks */}
              <div className="space-y-2.5 mb-8 text-sm text-cream-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                  <span>Ultra-crackly, paper-thin top crust</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                  <span>Velvety fudgy molten chocolate core</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                  <span>Baked fresh in artisanal small batches</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => addToCart({
                    id: 1,
                    name: 'Fudgy Brownie (Signature)',
                    image: feat.image || "/images/featured-brownie.jpg",
                    pricing: {
                      '250g': { label: '250 g', price: 200 },
                      '500g': { label: '500 g', price: 350 },
                      '1kg': { label: '1 kg', price: 680 },
                    }
                  }, '500g')}
                  className="px-6 py-3.5 bg-chocolate-800 hover:bg-chocolate-700 text-cream-100 font-bold tracking-wider rounded-full border border-gold-500/40 shadow-md hover:shadow-warm transition-all duration-300 text-center text-xs sm:text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-400" />
                  <span>ADD TO CART</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-caramel-500 hover:bg-caramel-600 text-white font-bold tracking-wider rounded-full shadow-warm-lg hover:shadow-warm-glow transition-all duration-300 text-center text-xs sm:text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{feat.cta || "ORDER NOW"}</span>
                </a>
                
                <span className="text-xs text-gold-400 text-center sm:text-left sm:ml-1">
                  Starting at ₹200
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
