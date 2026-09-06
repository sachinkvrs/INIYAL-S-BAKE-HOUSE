import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Sparkles, Globe, Share2, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import Toast from '../../components/admin/Toast';

export default function SettingsPage() {
  const { authFetch } = useAuth();
  const { refreshData } = useBrand();

  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [settings, setSettings] = useState({
    business_name: "Iniyal’s Bake House",
    tagline: "Good ingredients. Pure love. Perfect brownies.",
    phone: "8681078776",
    whatsapp: "8681078776",
    instagram: "@iniyals_bakehouse",
    email: "orders@iniyalsbakehouse.com",
    address: "Homemade Bakery, Tamil Nadu, India",
    opening_hours: "9:00 AM – 9:00 PM (Daily)",
    seo_title: "Iniyal’s Bake House | Homemade Brownies",
    seo_description: "Order fresh homemade fudgy, eggless and ragi brownies from Iniyal’s Bake House. Rich chocolate brownies made with quality ingredients and love.",
    seo_og_image: "/images/hero-brownie.jpg",
    social_instagram: "https://instagram.com/iniyals_bakehouse",
    social_facebook: "https://facebook.com/iniyalsbakehouse",
    social_youtube: "https://youtube.com/@iniyalsbakehouse"
  });

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

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await authFetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Object.keys(data.settings).length > 0) {
            setSettings(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    loadSettings();
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        addToast('Settings updated successfully in database.');
        // Update document title if seo_title is updated
        if (settings.seo_title) {
          document.title = settings.seo_title;
        }
        await refreshData();
      } else {
        addToast('Failed to update settings', 'error');
      }
    } catch (err) {
      addToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
          General & SEO Settings
        </h1>
        <p className="text-xs sm:text-sm text-chocolate-600 mt-0.5">
          Configure bakery business hours, email, Google SEO metadata, and social media handles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-warm space-y-8">
        
        {/* Business Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gold-500/20 text-chocolate-900">
            <Building2 className="w-5 h-5 text-caramel-600" />
            <h2 className="font-serif text-lg font-bold">
              Bakery Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Order Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Bakery Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Baking & Order Hours
              </label>
              <input
                type="text"
                value={settings.opening_hours}
                onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* SEO Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gold-500/20 text-chocolate-900">
            <Globe className="w-5 h-5 text-caramel-600" />
            <h2 className="font-serif text-lg font-bold">
              Search Engine Optimization (SEO)
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Website Meta Title
              </label>
              <input
                type="text"
                value={settings.seo_title}
                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.seo_description}
                onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Social Share Image (OG:Image URL)
              </label>
              <input
                type="text"
                value={settings.seo_og_image}
                onChange={(e) => setSettings({ ...settings, seo_og_image: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gold-500/20 text-chocolate-900">
            <Share2 className="w-5 h-5 text-caramel-600" />
            <h2 className="font-serif text-lg font-bold">
              Social Profiles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Instagram Link
              </label>
              <input
                type="text"
                value={settings.social_instagram}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Facebook Link
              </label>
              <input
                type="text"
                value={settings.social_facebook}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                YouTube Link
              </label>
              <input
                type="text"
                value={settings.social_youtube}
                onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
                className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gold-500/30 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-warm hover:shadow-warm-glow transition-all flex items-center gap-2 transform active:scale-98 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE SETTINGS</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
