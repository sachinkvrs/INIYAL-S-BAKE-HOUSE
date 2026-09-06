import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

export default function FloatingWhatsApp() {
  const { branding } = useBrand();
  const { isCartOpen } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNum = branding.whatsapp || '8681078776';
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Hi Iniyal’s Bake House! I would like to order brownies."
  )}`;

  if (!visible || isCartOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-in fade-in duration-300">
      <span className="hidden sm:inline-block bg-chocolate-900/95 text-cream-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-gold-500/40 backdrop-blur-sm">
        Craving Brownies? Order here!
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-caramel-500 hover:bg-caramel-600 text-white rounded-full flex items-center justify-center shadow-warm-lg hover:shadow-warm-glow transition-all duration-300 transform hover:scale-110 active:scale-95 group relative"
        aria-label="Chat with Iniyal's Bake House on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-gold-500"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
