import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';

export default function Products() {
  const { authFetch } = useAuth();
  const { refreshData } = useBrand();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toasts, setToasts] = useState([]);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        authFetch('/api/products?all=true'),
        authFetch('/api/categories')
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        setProducts(data.products || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCategories(cData.categories || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleAvailable = async (product) => {
    try {
      const res = await authFetch(`/api/products/${product.id}/toggle-available`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev =>
          prev.map(p => (p.id === product.id ? { ...p, available: data.available } : p))
        );
        addToast(`Product ${data.available ? 'enabled' : 'disabled'} successfully.`);
        refreshData();
      }
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const res = await authFetch(`/api/products/${product.id}/toggle-featured`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev =>
          prev.map(p => (p.id === product.id ? { ...p, featured: data.featured } : p))
        );
        addToast(`Featured status updated.`);
        refreshData();
      }
    } catch (err) {
      addToast('Error updating featured status', 'error');
    }
  };

  const handleDuplicate = async (product) => {
    try {
      const res = await authFetch(`/api/products/${product.id}/duplicate`, {
        method: 'POST'
      });
      if (res.ok) {
        addToast('Product duplicated successfully.');
        loadProducts();
        refreshData();
      }
    } catch (err) {
      addToast('Error duplicating product', 'error');
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await authFetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast('Product deleted successfully.');
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        refreshData();
      } else {
        addToast('Failed to delete product', 'error');
      }
    } catch (err) {
      addToast('Error deleting product', 'error');
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || String(p.category_id) === String(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Manage prices, portion weights, delicious photography, and availability.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-warm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gold-500/30 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brownies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream-50 border border-gold-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-chocolate-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 bg-cream-50 border border-gold-500/30 rounded-xl text-sm text-chocolate-800 focus:outline-none focus:ring-2 focus:ring-caramel-500 w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Products Table / Cards */}
      <div className="bg-white rounded-3xl border border-gold-500/30 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center text-chocolate-600">
            <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading bakery products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-chocolate-600">
            <Sparkles className="w-10 h-10 text-gold-500/60 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">No products found</h3>
            <p className="text-xs text-chocolate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or add a new brownie product to the menu.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-100 border-b border-gold-500/30 text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">250g</th>
                  <th className="py-4 px-4 text-center">500g</th>
                  <th className="py-4 px-4 text-center">1kg</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/15 text-sm text-chocolate-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-cream-50/70 transition-colors">
                    
                    {/* Product & Image */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-chocolate-950 border border-gold-500/30 shrink-0 shadow-sm"
                        />
                        <div className="max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-chocolate-900 text-base">
                              {prod.name}
                            </span>
                            {prod.badge && (
                              <span className="text-[10px] bg-caramel-500/15 text-caramel-700 font-bold px-2 py-0.5 rounded-full border border-caramel-500/30">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-chocolate-600 line-clamp-1 mt-0.5">
                            {prod.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-xs font-medium text-chocolate-700">
                      {prod.category_name || 'Brownies'}
                    </td>

                    {/* 250g Price */}
                    <td className="py-4 px-4 text-center font-semibold text-chocolate-900">
                      ₹{prod.price_250g}
                    </td>

                    {/* 500g Price */}
                    <td className="py-4 px-4 text-center font-bold text-caramel-700 bg-cream-100/50">
                      ₹{prod.price_500g}
                    </td>

                    {/* 1kg Price */}
                    <td className="py-4 px-4 text-center font-semibold text-chocolate-900">
                      ₹{prod.price_1kg}
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailable(prod)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          prod.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-chocolate-100 text-chocolate-600 hover:bg-chocolate-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {prod.available ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-chocolate-500" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          prod.featured
                            ? 'text-caramel-500 hover:text-caramel-600 bg-caramel-500/10'
                            : 'text-chocolate-300 hover:text-chocolate-500'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Star className={`w-5 h-5 ${prod.featured ? 'fill-caramel-500' : ''}`} />
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(prod)}
                          className="p-2 text-chocolate-600 hover:text-chocolate-900 hover:bg-cream-200 rounded-xl transition-colors"
                          title="Duplicate product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="p-2 text-caramel-600 hover:text-caramel-700 hover:bg-cream-200 rounded-xl transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => confirmDelete(prod)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? It will be archived and removed from the customer menu immediately.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
