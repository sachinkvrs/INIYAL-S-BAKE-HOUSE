import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  FolderTree,
  MessageCircle,
  Plus,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Layers,
  Image,
  Sliders,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

export default function Dashboard() {
  const { authFetch } = useAuth();
  const { branding, categories } = useBrand();

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const prodRes = await authFetch('/api/products?all=true');
        if (prodRes.ok) {
          const pData = await prodRes.json();
          const prods = pData.products || [];
          setRecentProducts(prods.slice(0, 6));
          setStats({
            totalProducts: prods.length,
            activeProducts: prods.filter(p => p.available).length
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [authFetch]);

  const whatsappNum = branding.whatsapp || '8681078776';

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-chocolate-900 to-chocolate-950 rounded-3xl p-6 sm:p-8 text-cream-100 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chocolate-800 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
            <span>Bakery CMS & Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cream-100">
            Welcome to {branding.brand_name || 'Iniyal’s Bake House'}
          </h1>
          <p className="text-cream-300 text-sm mt-1 max-w-xl">
            All customer orders come directly to your WhatsApp. Use this dashboard to update brownie prices, add new varieties, replace photos, and customize your brand anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/admin/products/new"
            className="px-5 py-3 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-warm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-chocolate-800 hover:bg-chocolate-750 text-cream-200 text-sm font-semibold rounded-xl border border-gold-500/30 flex items-center gap-2 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-4 h-4 text-gold-400" />
          </a>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-6 border border-gold-500/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-600">Total Products</span>
            <h3 className="font-serif text-3xl font-bold text-chocolate-900 mt-1">
              {stats.totalProducts}
            </h3>
            <p className="text-xs text-chocolate-500 mt-1">Brownie varieties created</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cream-200 text-caramel-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl p-6 border border-gold-500/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-600">Active on Menu</span>
            <h3 className="font-serif text-3xl font-bold text-chocolate-900 mt-1">
              {stats.activeProducts}
            </h3>
            <p className="text-xs text-green-700 font-medium mt-1">Visible on customer site</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-6 border border-gold-500/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-600">Categories</span>
            <h3 className="font-serif text-3xl font-bold text-chocolate-900 mt-1">
              {categories?.length || 5}
            </h3>
            <p className="text-xs text-chocolate-500 mt-1">Collections & gift boxes</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cream-200 text-chocolate-900 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        {/* WhatsApp Channel Status */}
        <div className="bg-white rounded-2xl p-6 border border-gold-500/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-600">WhatsApp Orders</span>
            <h3 className="font-mono text-xl font-bold text-green-700 mt-1">
              Active
            </h3>
            <p className="text-xs text-chocolate-600 mt-1 truncate max-w-[140px]">
              +91 {whatsappNum}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Grid: Products List & Quick CMS Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Products Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
            <div>
              <h2 className="font-serif text-lg font-bold text-chocolate-900">
                Brownie Menu & Prices
              </h2>
              <span className="text-xs text-chocolate-500">Live prices displayed to customers</span>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-caramel-600 hover:text-caramel-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-gold-500/15">
            {recentProducts.map((prod) => (
              <div key={prod.id} className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-chocolate-950 border border-gold-500/30 shrink-0 shadow-xs"
                  />
                  <div>
                    <h4 className="font-serif text-base font-bold text-chocolate-900 group-hover:text-caramel-600 transition-colors">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-chocolate-600 mt-0.5">
                      <span>250g: ₹{prod.price_250g}</span>
                      <span>•</span>
                      <strong className="text-chocolate-900">500g: ₹{prod.price_500g}</strong>
                      <span>•</span>
                      <span>1kg: ₹{prod.price_1kg}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      prod.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-chocolate-100 text-chocolate-600'
                    }`}
                  >
                    {prod.available ? 'Active' : 'Disabled'}
                  </span>
                  <Link
                    to={`/admin/products/edit/${prod.id}`}
                    className="p-1.5 text-chocolate-600 hover:text-chocolate-900 hover:bg-cream-100 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Edit Price
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Actions & WhatsApp Hub */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp Direct Ordering Hub */}
          <div className="bg-gradient-to-br from-chocolate-900 to-chocolate-950 text-cream-100 rounded-3xl p-6 border border-gold-500/30 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-600/30 text-green-400 flex items-center justify-center border border-green-500/40">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-cream-100">WhatsApp Ordering Hub</h3>
                <span className="text-xs text-gold-400">Direct Customer Channel</span>
              </div>
            </div>

            <p className="text-xs text-cream-300 leading-relaxed">
              When customers click "ORDER NOW" on any brownie, it automatically opens WhatsApp to <strong>+91 {whatsappNum}</strong> with their selected brownie variety, weight, and price already pre-filled.
            </p>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-cream-400">Order Number:</span>
              <span className="font-mono font-bold text-cream-100">+91 {whatsappNum}</span>
            </div>

            <Link
              to="/admin/branding"
              className="w-full py-2.5 bg-chocolate-800 hover:bg-chocolate-700 text-gold-400 hover:text-white rounded-xl text-xs font-semibold border border-gold-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Change WhatsApp or Phone Number</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-gold-500/30 shadow-xs space-y-3">
            <h3 className="font-serif text-base font-bold text-chocolate-900 pb-2 border-b border-gold-500/20">
              Quick Website Management
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/branding"
                className="p-3 bg-cream-50 hover:bg-cream-100 rounded-xl border border-gold-500/30 flex items-center gap-2.5 text-xs font-bold text-chocolate-800 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-caramel-600 shrink-0" />
                <span>Logo & Branding</span>
              </Link>

              <Link
                to="/admin/content"
                className="p-3 bg-cream-50 hover:bg-cream-100 rounded-xl border border-gold-500/30 flex items-center gap-2.5 text-xs font-bold text-chocolate-800 transition-colors"
              >
                <Layers className="w-4 h-4 text-caramel-600 shrink-0" />
                <span>Edit Website Copy</span>
              </Link>

              <Link
                to="/admin/images"
                className="p-3 bg-cream-50 hover:bg-cream-100 rounded-xl border border-gold-500/30 flex items-center gap-2.5 text-xs font-bold text-chocolate-800 transition-colors"
              >
                <Image className="w-4 h-4 text-caramel-600 shrink-0" />
                <span>Media & Photos</span>
              </Link>

              <Link
                to="/admin/settings"
                className="p-3 bg-cream-50 hover:bg-cream-100 rounded-xl border border-gold-500/30 flex items-center gap-2.5 text-xs font-bold text-chocolate-800 transition-colors"
              >
                <Sliders className="w-4 h-4 text-caramel-600 shrink-0" />
                <span>SEO & Address</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
