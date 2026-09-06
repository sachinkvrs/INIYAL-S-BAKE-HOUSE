import React, { useState, useEffect } from 'react';
import { FileText, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import ImageUploadField from '../../components/admin/ImageUploadField';
import Toast from '../../components/admin/Toast';

export default function ContentEditor() {
  const { authFetch } = useAuth();
  const { content, refreshData } = useBrand();

  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Local editable state per section
  const [sections, setSections] = useState({
    hero: {
      heading1: "HOMEMADE",
      headingHighlight: "BROWNIES",
      heading2: "MADE WITH LOVE",
      subtext: "Rich, fudgy and freshly baked brownies made with quality ingredients.",
      ctaPrimary: "ORDER NOW",
      ctaSecondary: "VIEW MENU",
      heroImage: "/images/hero-brownie.jpg",
      badgeText: "Artisanal Homemade Brownies"
    },
    about: {
      heading: "BAKED WITH LOVE",
      badge: "Our Kitchen Philosophy",
      quote: "At Iniyal’s Bake House, we believe the best brownies are made with simple ingredients, careful preparation and lots of love. Every batch is freshly prepared to give you that homemade taste you can feel in every bite.",
      description: "We never cut corners or rely on artificial additives. From rich cocoa and farm butter to slow temperature control in our home kitchen, every pan of brownies is handcrafted to bring happiness directly to your doorstep.",
      image: "/images/about-baking.jpg"
    },
    why_us: {
      heading: "WHY YOU’LL LOVE OUR BROWNIES",
      subtext: "Pure Indulgence",
    },
    featured: {
      heading: "THE ONE EVERYONE LOVES",
      subtext: "Customer Favorite",
      description: "Dense, rich, fudgy and loaded with chocolate flavour. Our signature brownie is baked to give you that perfect crackly top and irresistible soft center.",
      cta: "ORDER YOURS",
      image: "/images/featured-brownie.jpg"
    },
    order_cta: {
      heading: "CRAVING BROWNIES?",
      badge: "Fresh Batches Daily",
      text: "Your next chocolate craving is just one order away.",
      cta: "ORDER NOW"
    },
    contact: {
      heading: "LET’S MAKE YOUR DAY SWEETER",
      subtext: "Get In Touch",
      title: "Fresh Homemade Goodness",
      description: "Have a question about bulk orders, party boxes, custom brownies, or dietary requests? Reach out anytime, we’d love to bake for you!"
    },
    footer: {
      quote: "“Brownies that bring smiles.” Freshly baked homemade chocolate indulgence crafted with love for all your moments."
    }
  });

  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      setSections(prev => ({
        ...prev,
        ...content
      }));
    }
  }, [content]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    try {
      const res = await authFetch(`/api/content/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections[sectionKey])
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save section');
      }

      await refreshData();
      addToast(`${sectionKey.toUpperCase()} section updated successfully!`);
    } catch (err) {
      addToast(err.message || 'Error saving content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'hero', label: 'Hero Section' },
    { key: 'about', label: 'About Us' },
    { key: 'featured', label: 'Featured Brownie' },
    { key: 'why_us', label: 'Why Choose Us' },
    { key: 'order_cta', label: 'Craving / Order CTA' },
    { key: 'contact', label: 'Contact Section' },
    { key: 'footer', label: 'Footer' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
          Website Content Editor
        </h1>
        <p className="text-xs sm:text-sm text-chocolate-600 mt-0.5">
          Edit headlines, tasting notes, brand stories, and images directly without changing code.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold-500/30">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-chocolate-900 text-cream-100 shadow-sm'
                : 'bg-white text-chocolate-700 hover:bg-cream-100 border border-gold-500/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-warm space-y-6">
        
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Hero Section Copy & Imagery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  value={sections.hero?.heading1 || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, heading1: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Headline Highlight (Italic Gold)
                </label>
                <input
                  type="text"
                  value={sections.hero?.headingHighlight || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, headingHighlight: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-bold text-caramel-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Headline Line 2
                </label>
                <input
                  type="text"
                  value={sections.hero?.heading2 || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, heading2: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Pill Badge Text
                </label>
                <input
                  type="text"
                  value={sections.hero?.badgeText || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, badgeText: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Supporting Subtext
              </label>
              <textarea
                rows={2}
                value={sections.hero?.subtext || ''}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...sections.hero, subtext: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <ImageUploadField
              label="Hero Brownie Stack Image"
              currentImage={sections.hero?.heroImage}
              onImageUploaded={(url) => setSections({
                ...sections,
                hero: { ...sections.hero, heroImage: url }
              })}
              category="hero"
              aspectRatio="aspect-video"
              helperText="Decadent hero brownie photograph"
            />
          </div>
        )}

        {/* ABOUT US TAB */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              About Us / Kitchen Story
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={sections.about?.heading || ''}
                onChange={(e) => setSections({
                  ...sections,
                  about: { ...sections.about, heading: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-serif font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Brand Core Quote
              </label>
              <textarea
                rows={3}
                value={sections.about?.quote || ''}
                onChange={(e) => setSections({
                  ...sections,
                  about: { ...sections.about, quote: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm italic"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Story Description
              </label>
              <textarea
                rows={3}
                value={sections.about?.description || ''}
                onChange={(e) => setSections({
                  ...sections,
                  about: { ...sections.about, description: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <ImageUploadField
              label="Kitchen / Baking Scene Image"
              currentImage={sections.about?.image}
              onImageUploaded={(url) => setSections({
                ...sections,
                about: { ...sections.about, image: url }
              })}
              category="about"
              aspectRatio="aspect-video"
              helperText="Warm artisanal bakery baking scene"
            />
          </div>
        )}

        {/* FEATURED PRODUCT TAB */}
        {activeTab === 'featured' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Featured Signature Spotlight
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={sections.featured?.heading || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    featured: { ...sections.featured, heading: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-serif font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Button CTA Text
                </label>
                <input
                  type="text"
                  value={sections.featured?.cta || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    featured: { ...sections.featured, cta: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Tasting Notes / Description
              </label>
              <textarea
                rows={3}
                value={sections.featured?.description || ''}
                onChange={(e) => setSections({
                  ...sections,
                  featured: { ...sections.featured, description: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <ImageUploadField
              label="Signature Close-up Photograph"
              currentImage={sections.featured?.image}
              onImageUploaded={(url) => setSections({
                ...sections,
                featured: { ...sections.featured, image: url }
              })}
              category="featured"
              aspectRatio="aspect-video"
              helperText="Macro close-up photo showing molten chocolate core"
            />
          </div>
        )}

        {/* WHY US TAB */}
        {activeTab === 'why_us' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Why Choose Us Section
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={sections.why_us?.heading || ''}
                onChange={(e) => setSections({
                  ...sections,
                  why_us: { ...sections.why_us, heading: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-serif font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Script Subtitle
              </label>
              <input
                type="text"
                value={sections.why_us?.subtext || ''}
                onChange={(e) => setSections({
                  ...sections,
                  why_us: { ...sections.why_us, subtext: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* ORDER CTA TAB */}
        {activeTab === 'order_cta' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Craving / Order Section
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={sections.order_cta?.heading || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    order_cta: { ...sections.order_cta, heading: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-serif font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={sections.order_cta?.cta || ''}
                  onChange={(e) => setSections({
                    ...sections,
                    order_cta: { ...sections.order_cta, cta: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Subtitle Text
              </label>
              <textarea
                rows={2}
                value={sections.order_cta?.text || ''}
                onChange={(e) => setSections({
                  ...sections,
                  order_cta: { ...sections.order_cta, text: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Contact Section Copy
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={sections.contact?.heading || ''}
                onChange={(e) => setSections({
                  ...sections,
                  contact: { ...sections.contact, heading: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-serif font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Description / Order Inquiries Note
              </label>
              <textarea
                rows={3}
                value={sections.contact?.description || ''}
                onChange={(e) => setSections({
                  ...sections,
                  contact: { ...sections.contact, description: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Footer Slogan & Copy
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Footer Tagline / Slogan
              </label>
              <textarea
                rows={2}
                value={sections.footer?.quote || ''}
                onChange={(e) => setSections({
                  ...sections,
                  footer: { ...sections.footer, quote: e.target.value }
                })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-gold-500/30 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveSection(activeTab)}
            disabled={saving}
            className="px-8 py-3.5 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-warm hover:shadow-warm-glow transition-all flex items-center gap-2 transform active:scale-98 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE {activeTab.toUpperCase()} SECTION</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
