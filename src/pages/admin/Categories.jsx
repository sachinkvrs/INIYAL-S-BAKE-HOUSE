import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, FolderPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';

export default function Categories() {
  const { authFetch } = useAuth();
  const { refreshData } = useBrand();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Form modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

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

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      addToast('Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCatName('');
    setDisplayOrder(categories.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setDisplayOrder(cat.display_order || 0);
    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName.trim(), display_order: displayOrder })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      addToast(editingCategory ? 'Category updated successfully' : 'Category added successfully');
      setModalOpen(false);
      loadCategories();
      refreshData();
    } catch (err) {
      addToast(err.message || 'Error saving category', 'error');
    }
  };

  const handleToggle = async (cat) => {
    try {
      const res = await authFetch(`/api/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: cat.enabled ? 0 : 1 })
      });
      if (res.ok) {
        addToast(`Category ${cat.enabled ? 'disabled' : 'enabled'} successfully`);
        loadCategories();
        refreshData();
      }
    } catch (err) {
      addToast('Error updating category status', 'error');
    }
  };

  const confirmDelete = (cat) => {
    setCatToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!catToDelete) return;
    try {
      const res = await authFetch(`/api/categories/${catToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast('Category deleted successfully');
        loadCategories();
        refreshData();
      }
    } catch (err) {
      addToast('Error deleting category', 'error');
    } finally {
      setDeleteModalOpen(false);
      setCatToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Organize brownies into categories like Brownies, Special Brownies, Combos, and Gift Boxes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-warm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gold-500/30 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-chocolate-600">
            <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading categories...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-100 border-b border-gold-500/30 text-xs font-bold uppercase tracking-wider text-chocolate-700">
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Slug</th>
                <th className="py-4 px-6 text-center">Products</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/15 text-sm text-chocolate-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-cream-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-chocolate-500">
                    #{cat.display_order}
                  </td>
                  <td className="py-4 px-6 font-serif font-bold text-chocolate-900 text-base">
                    {cat.name}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-chocolate-600">
                    {cat.slug}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-chocolate-700">
                    {cat.product_count || 0}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggle(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        cat.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-chocolate-100 text-chocolate-600'
                      }`}
                    >
                      {cat.enabled ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-chocolate-500" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-caramel-600 hover:bg-cream-200 rounded-xl transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(cat)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/40 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-chocolate-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gift Boxes, Specials"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-gold-500/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-cream-50 border border-gold-500/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold-500/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-chocolate-700 hover:bg-cream-100 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-caramel-500 hover:bg-caramel-600 text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category"
        message={`Are you sure you want to delete category "${catToDelete?.name}"? Products under this category will become unassigned.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
