import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Heart, Shield } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useBrand } from '../context/BrandContext';

export default function Footer() {
  const { branding, content } = useBrand();
  const navigate = useNavigate();
  const footerData = content.footer || {};

  // Secret 8-click admin trigger
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [secretToast, setSecretToast] = useState('');

  const handleLogoClick = (e) => {
    const now = Date.now();
    const count = (now - lastClickTime < 3000) ? logoClicks + 1 : 1;
    setLastClickTime(now);
    setLogoClicks(count);

    if (count >= 8) {
      e.preventDefault();
      setLogoClicks(0);
      setSecretToast('🔓 Opening Admin Panel...');
      setTimeout(() => {
        setSecretToast('');
        navigate('/admin');
      }, 400);
    } else if (count >= 4) {
      setSecretToast(`${8 - count} more clicks to open Admin`);
      setTimeout(() => {
        setSecretToast(prev => (prev.includes('clicks') ? '' : prev));
      }, 1500);
    }
  };

  const whatsappNum = branding.whatsapp || '8681078776';
  const phoneNum = branding.phone || '8681078776';
  const instagramHandle = branding.instagram || '@iniyals_bakehouse';
  const instagramUrl = branding.instagram_url || 'https://instagram.com/iniyals_bakehouse';

  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Hi Iniyal’s Bake House! I would like to order brownies."
  )}`;

  return (
    <>
      {secretToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-chocolate-950 text-gold-400 border border-gold-500/60 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Shield className="w-3.5 h-3.5 text-caramel-400" />
          <span>{secretToast}</span>
        </div>
      )}

      <footer className="bg-chocolate-950 text-cream-200 border-t border-chocolate-800 pt-16 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-chocolate-800/80">
            
            {/* Brand Info with secret trigger */}
            <div className="lg:col-span-5 space-y-4">
              <div 
                onClick={handleLogoClick}
                className="flex items-center gap-3 cursor-pointer select-none group"
                title="Click 8 times to open Admin Panel"
              >
                <img
                  src={branding.footer_logo_url || branding.logo_url || '/images/brand-logo.jpg'}
                  alt={`${branding.brand_name || "Iniyal's Bake House"} Logo`}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold-500 shadow-md group-hover:scale-105 active:scale-95 transition-transform"
                />
                <div>
                  <span className="font-serif text-xl font-bold tracking-wider text-cream-100 block uppercase group-hover:text-gold-400 transition-colors">
                    {branding.brand_name || 'INIYAL’S BAKE HOUSE'}
                  </span>
                  <span className="font-script text-base text-gold-400">
                    {branding.tagline || 'Good ingredients. Pure love. Perfect brownies.'}
                  </span>
                </div>
              </div>

              <p className="text-cream-400 text-sm leading-relaxed max-w-sm pt-2">
                {footerData.quote || "“Brownies that bring smiles.” Freshly baked homemade chocolate indulgence crafted with love for all your moments."}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-chocolate-900 border border-chocolate-800 flex items-center justify-center text-cream-300 hover:text-white hover:bg-caramel-500 hover:border-caramel-500 transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-chocolate-900 border border-chocolate-800 flex items-center justify-center text-cream-300 hover:text-white hover:bg-caramel-500 hover:border-caramel-500 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href={`tel:+91${phoneNum}`}
                  className="w-10 h-10 rounded-full bg-chocolate-900 border border-chocolate-800 flex items-center justify-center text-cream-300 hover:text-white hover:bg-caramel-500 hover:border-caramel-500 transition-all duration-300"
                  aria-label="Phone"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-serif text-lg font-bold text-cream-100 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#home" className="text-cream-400 hover:text-gold-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#menu" className="text-cream-400 hover:text-gold-400 transition-colors">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#about-us" className="text-cream-400 hover:text-gold-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-cream-400 hover:text-gold-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="font-serif text-lg font-bold text-cream-100 uppercase tracking-wider">
                Order Inquiries
              </h4>
              <div className="space-y-3 text-sm text-cream-400">
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-caramel-400 shrink-0" />
                  <a href={`tel:+91${phoneNum}`} className="hover:text-gold-400 transition-colors">
                    {phoneNum}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <InstagramIcon className="w-4 h-4 text-caramel-400 shrink-0" />
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-400 transition-colors"
                  >
                    {instagramHandle}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-caramel-400 shrink-0" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-400 transition-colors"
                  >
                    WhatsApp Ordering
                  </a>
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-500 gap-4">
            <p>© {new Date().getFullYear()} {branding.brand_name || 'INIYAL’S BAKE HOUSE'}. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Freshly baked with</span>
              <Heart className="w-3.5 h-3.5 text-caramel-500 fill-caramel-500 inline" />
              <span>and pure ingredients</span>
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
