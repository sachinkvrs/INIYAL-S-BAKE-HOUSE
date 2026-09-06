import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X, Phone, MessageCircle, ShoppingBag, Shield } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { branding } = useBrand();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Secret 8-click admin trigger
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [secretToast, setSecretToast] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    const now = Date.now();
    // If more than 3 seconds elapsed between clicks, reset counter to 1
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
      // Show subtle countdown badge
      setSecretToast(`${8 - count} more clicks to open Admin`);
      setTimeout(() => {
        setSecretToast(prev => (prev.includes('clicks') ? '' : prev));
      }, 1500);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'About Us', href: '#about-us' },
    { name: 'Occasions', href: '#occasions' },
    { name: 'Contact', href: '#contact' },
  ];

  const defaultWhatsappMsg = encodeURIComponent("Hi Iniyal’s Bake House! I would like to order brownies.");
  const whatsappNum = branding.whatsapp || '8681078776';
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${defaultWhatsappMsg}`;
  const phoneNum = branding.phone || '8681078776';

  return (
    <>
      {/* Secret Toast popup when clicking logo */}
      {secretToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-chocolate-950 text-gold-400 border border-gold-500/60 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Shield className="w-3.5 h-3.5 text-caramel-400" />
          <span>{secretToast}</span>
        </div>
      )}

      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-chocolate-900/95 backdrop-blur-md shadow-warm py-3 border-b border-chocolate-800' 
            : 'bg-chocolate-900/80 backdrop-blur-sm py-4 border-b border-chocolate-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Brand with Secret 8-click trigger */}
            <a 
              href="#home" 
              onClick={handleLogoClick}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-caramel-500 rounded-lg p-1 cursor-pointer select-none"
              title="Click 8 times to open Admin Panel"
            >
              <img 
                src={branding.logo_url || '/images/brand-logo.jpg'} 
                alt={`${branding.brand_name || "Iniyal's Bake House"} Logo`} 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gold-500/80 shadow-md group-hover:scale-105 active:scale-95 transition-transform duration-200"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-cream-200 group-hover:text-gold-500 transition-colors uppercase">
                  {branding.brand_name || 'INIYAL’S BAKE HOUSE'}
                </span>
                <span className="font-script text-xs sm:text-sm text-gold-400 tracking-wide -mt-1 hidden sm:inline-block">
                  {branding.tagline || 'Homemade with pure love'}
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-cream-200/90 hover:text-gold-500 text-sm font-medium transition-colors tracking-wide relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Action Button & Cart Trigger */}
            <div className="hidden md:flex items-center gap-3">
              {/* Phone Icon */}
              <a
                href={`tel:+91${phoneNum}`}
                className="p-2 text-cream-200/80 hover:text-gold-500 hover:bg-chocolate-800/60 rounded-full transition-colors"
                title={`Call Us: ${phoneNum}`}
                aria-label={`Call ${branding.brand_name || "Iniyal's Bake House"}`}
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-chocolate-800 hover:bg-chocolate-750 text-cream-100 rounded-full border border-gold-500/40 shadow-sm transition-all hover:border-caramel-500 group"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold tracking-wider">CART</span>
                {totalItems > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-caramel-500 text-white rounded-full text-[11px] font-extrabold shadow-sm animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Order Now WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel-500 hover:bg-caramel-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-warm-glow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ORDER NOW</span>
              </a>
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Cart Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-chocolate-800 text-cream-100 rounded-full border border-gold-500/40"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-gold-400" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4 px-1 bg-caramel-500 text-white rounded-full text-[10px] font-extrabold">
                    {totalItems}
                  </span>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-caramel-500 text-white rounded-full text-xs font-semibold"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="p-2 rounded-lg text-cream-200 hover:text-white hover:bg-chocolate-800 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-chocolate-950/95 border-b border-chocolate-800 px-6 py-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-cream-200 hover:text-gold-500 text-base font-medium py-1.5 border-b border-chocolate-800/40"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                {/* Cart Action in Mobile Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-chocolate-800 hover:bg-chocolate-700 text-cream-100 font-bold rounded-full border border-gold-500/40 shadow-sm text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-400" />
                  <span>VIEW CART ({totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'})</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-caramel-500 hover:bg-caramel-600 text-white font-semibold rounded-full shadow-md text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ORDER ON WHATSAPP</span>
                </a>
                <a
                  href={`tel:+91${phoneNum}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-chocolate-800 hover:bg-chocolate-700 text-cream-200 font-medium rounded-full text-sm border border-chocolate-700"
                >
                  <Phone className="w-4 h-4 text-gold-500" />
                  <span>Call: {phoneNum}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
