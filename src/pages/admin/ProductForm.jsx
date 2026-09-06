import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import ImageUploadField from '../../components/admin/ImageUploadField';
import Toast from '../../components/admin/Toast';

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const { refreshData } = useBrand();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: 1,
    image: '/images/fudgy-brownie.jpg',
    gallery: [],
    price_250g: 200,
    price_500g: 350,
    price_1kg: 680,
    available: 1,
    featured: 0,
    badge: '',
    display_order: 1
  });

  const addToast = (message, type = 'success') => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);
  };

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  useEffect(() => {
    async function initForm() {
      try {
        // Load categories
        const catRes = await authFetch('/api/categories');
        if (catRes.ok) {
          const cData = await catRes.json();
          setCategories(cData.categories || []);
          if (!isEditing && cData.categories?.length > 0) {
            setFormData(prev => ({ ...prev, category_id: cData.categories[0].id }));
          }
        }

        // If editing, load product details
        if (isEditing) {
          const pRes = await authFetch(`/api/products/${id}`);
          if (pRes.ok) {
            const pData = await pRes.json();
            const prod = pData.product;
            setFormData({
              name: prod.name || '',
              description: prod.description || '',
              short_description: prod.short_description || '',
              category_id: prod.category_id || 1,
              image: prod.image || '/images/fudgy-brownie.jpg',
              gallery: prod.gallery || [],
              price_250g: prod.price_250g || 200,
              price_500g: prod.price_500g || 350,
              price_1kg: prod.price_1kg || 680,
              available: prod.available ? 1 : 0,
              featured: prod.featured ? 1 : 0,
              badge: prod.badge || '',
              display_order: prod.display_order || 0
            });
          } else {
            addToast('Product not found', 'error');
            navigate('/admin/products');
          }
        }
      } catch (err) {
        console.error('Error loading form:', err);
        addToast('Error initializing form', 'error');
      } finally {
        setLoading(false);
      }
    }

    initForm();
  }, [id, isEditing, authFetch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      addToast('Product name is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Product description is required', 'error');
      return;
    }
    if (!formData.image) {
      addToast('Please upload or specify a product image', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/products/${id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      addToast(
        isEditing ? 'Product updated successfully.' : 'Product created successfully.'
      );

      // Refresh public store
      await refreshData();

      // Redirect back to products list after short delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 700);

    } catch (err) {
      console.error('Error saving product:', err);
      addToast(err.message || 'Error saving product', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-chocolate-600">
        <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-white hover:bg-cream-200 border border-gold-500/30 rounded-xl text-chocolate-800 transition-colors"
            title="Back to products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
              {isEditing ? 'Edit Brownie Product' : 'Add New Brownie Product'}
            </h1>
            <p className="text-xs sm:text-sm text-chocolate-600 mt-0.5">
              {isEditing
                ? 'Updates will immediately sync across the customer website menu.'
                : 'Fill in the details below to add a new brownie to your bakery menu.'}
            </p>
          </div>
        </div>
      </div>

      {/* Product Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-warm space-y-8">
        
        {/* Section: Basic Information */}
        <div className="space-y-5">
          <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            {/* Product Name */}
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fudgy Brownie, Salted Caramel Brownie"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>

            {/* Category */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Full Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Rich chocolate. Gooey center. Pure indulgence."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>

            {/* Short Description */}
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Short Tagline / Catchphrase (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Gooey chocolate heaven"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>

            {/* Product Badge */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Badge (e.g. Bestseller, 100% Veg)
              </label>
              <input
                type="text"
                placeholder="e.g. Bestseller, Eggless"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section: Pricing (250g, 500g, 1kg) */}
        <div className="space-y-5">
          <div className="pb-2 border-b border-gold-500/20 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-chocolate-900">
              Portion Pricing (₹)
            </h2>
            <span className="text-xs text-caramel-600 font-medium">
              Customers can toggle weights on the public menu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 250g */}
            <div className="p-4 bg-cream-50 border border-gold-500/40 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-700 mb-1">
                250 g Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chocolate-500 font-semibold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.price_250g}
                  onChange={(e) => setFormData({ ...formData, price_250g: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-gold-500/40 rounded-xl text-base font-bold text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                />
              </div>
              <span className="text-[11px] text-chocolate-500 mt-1 block">Standard small box</span>
            </div>

            {/* 500g */}
            <div className="p-4 bg-cream-100 border-2 border-caramel-500/60 rounded-2xl shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-caramel-700 mb-1">
                500 g Price (₹) * (Popular)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel-700 font-semibold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.price_500g}
                  onChange={(e) => setFormData({ ...formData, price_500g: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-caramel-500 rounded-xl text-base font-bold text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                />
              </div>
              <span className="text-[11px] text-caramel-700 mt-1 block">Default pre-selected weight</span>
            </div>

            {/* 1kg */}
            <div className="p-4 bg-cream-50 border border-gold-500/40 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-700 mb-1">
                1 kg Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chocolate-500 font-semibold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.price_1kg}
                  onChange={(e) => setFormData({ ...formData, price_1kg: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-gold-500/40 rounded-xl text-base font-bold text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                />
              </div>
              <span className="text-[11px] text-chocolate-500 mt-1 block">Party / Gift pack</span>
            </div>
          </div>
        </div>

        {/* Section: Image Management */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
            Product Photography
          </h2>

          <ImageUploadField
            label="Main Product Photograph (1:1 Ratio)"
            currentImage={formData.image}
            onImageUploaded={(url) => setFormData({ ...formData, image: url })}
            category="products"
            aspectRatio="aspect-square"
            helperText="Upload mouth-watering brownie photography (1:1 square crop)"
          />
        </div>

        {/* Section: Settings & Visibility */}
        <div className="space-y-4 pt-2">
          <h2 className="font-serif text-lg font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
            Visibility & Toggles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Available Toggle */}
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-gold-500/40 bg-cream-50 cursor-pointer hover:bg-cream-100 transition-colors">
              <input
                type="checkbox"
                checked={Boolean(formData.available)}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked ? 1 : 0 })}
                className="w-5 h-5 accent-caramel-500 rounded"
              />
              <div>
                <span className="text-sm font-bold text-chocolate-900 block">Available for Order</span>
                <span className="text-xs text-chocolate-600">Show on public menu</span>
              </div>
            </label>

            {/* Featured Toggle */}
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-gold-500/40 bg-cream-50 cursor-pointer hover:bg-cream-100 transition-colors">
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                className="w-5 h-5 accent-caramel-500 rounded"
              />
              <div>
                <span className="text-sm font-bold text-chocolate-900 block">Featured Spotlight</span>
                <span className="text-xs text-chocolate-600">Highlight on homepage</span>
              </div>
            </label>

            {/* Display Order */}
            <div className="p-4 rounded-2xl border border-gold-500/40 bg-cream-50">
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-white border border-gold-500/40 rounded-xl text-sm font-semibold text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
              />
            </div>

          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-gold-500/30 flex items-center justify-end gap-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-xl border border-chocolate-300 text-chocolate-700 hover:bg-cream-100 font-semibold text-sm transition-colors"
          >
            Cancel
          </Link>
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
                <span>SAVE PRODUCT</span>
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
