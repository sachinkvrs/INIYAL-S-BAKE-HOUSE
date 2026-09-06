import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useBrand } from '../context/BrandContext';

export default function Contact() {
  const { branding, content } = useBrand();
  const contactData = content.contact || {};

  const whatsappNum = branding.whatsapp || '8681078776';
  const phoneNum = branding.phone || '8681078776';
  const instagramHandle = branding.instagram || '@iniyals_bakehouse';
  const instagramUrl = branding.instagram_url || 'https://instagram.com/iniyals_bakehouse';

  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Hi Iniyal’s Bake House! I would like to order brownies."
  )}`;

  return (
    <section id="contact" className="py-24 bg-cream-200 text-chocolate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-script text-2xl sm:text-3xl text-caramel-600 block mb-1">
            {contactData.subtext || "Get In Touch"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-chocolate-900 uppercase">
            {contactData.heading || "LET’S MAKE YOUR DAY SWEETER"}
          </h2>
          <div className="w-16 h-1 bg-caramel-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gold-500/30 p-8 sm:p-12 shadow-warm-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Direct Contact Info */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                {contactData.title || "Fresh Homemade Goodness"}
              </h3>
              <p className="text-chocolate-700 text-sm sm:text-base leading-relaxed">
                {contactData.description || "Have a question about bulk orders, party boxes, custom brownies, or dietary requests? Reach out anytime, we’d love to bake for you!"}
              </p>

              <div className="space-y-4 pt-2">
                
                {/* Phone Item */}
                <a
                  href={`tel:+91${phoneNum}`}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-cream-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-chocolate-900 text-gold-400 group-hover:bg-caramel-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-semibold text-chocolate-600 tracking-wider block">
                      Direct Phone
                    </span>
                    <span className="font-serif text-lg font-bold text-chocolate-900 group-hover:text-caramel-600 transition-colors">
                      {phoneNum}
                    </span>
                  </div>
                </a>

                {/* Instagram Item */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-cream-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-chocolate-900 text-gold-400 group-hover:bg-caramel-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-sm">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-semibold text-chocolate-600 tracking-wider block">
                      Instagram Handle
                    </span>
                    <span className="font-serif text-lg font-bold text-chocolate-900 group-hover:text-caramel-600 transition-colors">
                      {instagramHandle}
                    </span>
                  </div>
                </a>

              </div>
            </div>

            {/* Quick Action Buttons Card */}
            <div className="bg-cream-100 rounded-2xl p-6 sm:p-8 border border-gold-500/30 flex flex-col gap-4">
              <h4 className="font-serif text-lg font-bold text-chocolate-900 text-center mb-1">
                Quick Connect
              </h4>
              <p className="text-xs text-chocolate-700 text-center -mt-1 mb-2">
                Click any button below to connect with us instantly:
              </p>

              {/* Call Now */}
              <a
                href={`tel:+91${phoneNum}`}
                className="w-full py-3.5 px-6 bg-chocolate-900 hover:bg-chocolate-800 text-cream-100 font-bold text-sm tracking-wider rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-3 transform active:scale-98"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call Now</span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-3 transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-white hover:bg-cream-50 text-chocolate-900 font-bold text-sm tracking-wider rounded-xl border border-gold-500/40 shadow-sm transition-all duration-200 flex items-center justify-center gap-3 transform active:scale-98"
              >
                <InstagramIcon className="w-4 h-4 text-caramel-600" />
                <span>Instagram</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
