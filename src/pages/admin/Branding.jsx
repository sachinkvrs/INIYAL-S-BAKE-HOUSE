import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import ImageUploadField from '../../components/admin/ImageUploadField';
import Toast from '../../components/admin/Toast';

export default function Branding() {
  const { authFetch } = useAuth();
  const { branding, setBranding, refreshData } = useBrand();

  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({
    brand_name: "INIYAL’S BAKE HOUSE",
    tagline: "Good ingredients. Pure love. Perfect brownies.",
    phone: "8681078776",
    whatsapp: "8681078776",
    instagram: "@iniyals_bakehouse",
    instagram_url: "https://instagram.com/iniyals_bakehouse",
    logo_url: "/images/brand-logo.jpg",
    footer_logo_url: "/images/brand-logo.jpg",
    favicon_url: "/images/brand-logo.jpg"
  });

  useEffect(() => {
    if (branding && Object.keys(branding).length > 0) {
      setForm(prev => ({ ...prev, ...branding }));
    }
  }, [branding]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update branding');
      }

      setBranding(data.branding);
      await refreshData();
      addToast('Brand settings & logos updated successfully! Public website updated.');
    } catch (err) {
      console.error('Error saving branding:', err);
      addToast(err.message || 'Error updating branding', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
            Logo & Brand Identity
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-0.5">
            Update official brand logo, browser favicon, name, and direct contact numbers across the website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-warm space-y-8">
        
        {/* Logos & Favicon Uploads */}
        <div className="space-y-6">
          <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
            Brand Logos & Visual Assets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Navbar & General Logo */}
            <div className="bg-cream-50 p-5 rounded-2xl border border-gold-500/30">
              <ImageUploadField
                label="Official Brand Logo (Navbar & Public Site)"
                currentImage={form.logo_url}
                onImageUploaded={(url) => setForm(prev => ({ ...prev, logo_url: url, footer_logo_url: url }))}
                category="branding"
                aspectRatio="aspect-square"
                helperText="Upload official brand logo (circular / square PNG or JPG)"
              />
            </div>

            {/* Favicon */}
            <div className="bg-cream-50 p-5 rounded-2xl border border-gold-500/30">
              <ImageUploadField
                label="Browser Favicon Icon"
                currentImage={form.favicon_url}
                onImageUploaded={(url) => setForm(prev => ({ ...prev, favicon_url: url }))}
                category="branding"
                aspectRatio="aspect-square"
                helperText="Small square icon for browser tabs (PNG, ICO or JPG)"
              />
            </div>
          </div>
        </div>

        {/* Brand Information */}
        <div className="space-y-5">
          <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
            Brand Name & Slogan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Official Brand Name *
              </label>
              <input
                type="text"
                required
                value={form.brand_name}
                onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-serif font-bold text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="space-y-5">
          <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
            Contact Numbers & Social Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Primary Phone Number *
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-mono text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                WhatsApp Order Number *
              </label>
              <input
                type="text"
                required
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm font-mono text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Live Brand Preview Card */}
        <div className="p-6 bg-chocolate-950 rounded-2xl text-cream-100 border border-gold-500/40 space-y-3">
          <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold block">
            Live Preview on Public Website Navbar
          </span>
          <div className="flex items-center gap-4 bg-chocolate-900/90 p-4 rounded-xl border border-chocolate-800">
            <img
              src={form.logo_url || '/images/brand-logo.jpg'}
              alt="Logo Preview"
              className="w-12 h-12 rounded-full object-cover border-2 border-gold-500"
            />
            <div>
              <span className="font-serif text-lg font-bold text-cream-100 block uppercase">
                {form.brand_name || 'INIYAL’S BAKE HOUSE'}
              </span>
              <span className="font-script text-xs text-gold-400">
                {form.tagline || 'Homemade with pure love'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
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
                <span>SAVE BRAND SETTINGS</span>
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
