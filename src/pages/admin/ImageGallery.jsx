import React, { useState, useEffect } from 'react';
import { Images, UploadCloud, Copy, Trash2, Check, ExternalLink, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';

export default function ImageGallery() {
  const { authFetch } = useAuth();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imgToDelete, setImgToDelete] = useState(null);

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

  const loadImages = async () => {
    try {
      setLoading(true);
      const url = selectedCategory !== 'all' ? `/api/images?category=${selectedCategory}` : '/api/images';
      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (err) {
      addToast('Error loading images', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('category', selectedCategory === 'all' ? 'products' : selectedCategory);

    try {
      const res = await authFetch('/api/images/upload-multiple', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        addToast(`${files.length} image(s) uploaded successfully`);
        loadImages();
      } else {
        addToast(data.error || 'Upload failed', 'error');
      }
    } catch (err) {
      addToast('Error uploading images', 'error');
    } finally {
      setUploading(false);
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(window.location.origin + url);
    addToast('Image URL copied to clipboard');
  };

  const confirmDelete = (img) => {
    setImgToDelete(img);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!imgToDelete) return;
    try {
      const res = await authFetch(`/api/images/${imgToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast('Image deleted from gallery');
        setImages(prev => prev.filter(i => i.id !== imgToDelete.id));
      }
    } catch (err) {
      addToast('Error deleting image', 'error');
    } finally {
      setDeleteModalOpen(false);
      setImgToDelete(null);
    }
  };

  const categories = [
    { id: 'all', label: 'All Images' },
    { id: 'hero', label: 'Hero Images' },
    { id: 'products', label: 'Product Images' },
    { id: 'about', label: 'About Images' },
    { id: 'featured', label: 'Featured Images' },
    { id: 'branding', label: 'Logos & Branding' },
    { id: 'other', label: 'Other Images' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 uppercase">
            Image & Media Assets
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Browse, upload, preview, and manage all bakery photography and logos.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-dashed border-gold-500/40 text-center hover:border-caramel-500 transition-colors">
        <UploadCloud className="w-12 h-12 text-caramel-600 mx-auto mb-3" />
        <h3 className="font-serif text-lg font-bold text-chocolate-900">
          Upload New Bakery Photography
        </h3>
        <p className="text-xs text-chocolate-600 mt-1 mb-4">
          Drag and drop images here or select from your computer (JPG, PNG, WebP)
        </p>

        <label className="inline-flex items-center gap-2 px-6 py-3 bg-chocolate-900 hover:bg-chocolate-800 text-cream-100 rounded-xl text-sm font-bold shadow-md cursor-pointer transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <span>{uploading ? 'Uploading...' : 'Browse & Upload Images'}</span>
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-chocolate-900 text-cream-100 shadow-sm'
                : 'bg-white text-chocolate-700 hover:bg-cream-100 border border-gold-500/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-3xl p-6 border border-gold-500/30 shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-chocolate-600">
            <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading media assets...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="p-12 text-center text-chocolate-600">
            <Images className="w-10 h-10 text-gold-500/60 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">No images in this category</h3>
            <p className="text-xs text-chocolate-500 mt-1">Upload an image above to populate this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-cream-50 rounded-2xl overflow-hidden border border-gold-500/30 shadow-xs group hover:shadow-warm transition-all flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-chocolate-950 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.alt_text || img.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-chocolate-900/90 text-gold-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gold-500/30 uppercase">
                    {img.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-chocolate-900 truncate" title={img.original_name}>
                      {img.original_name}
                    </p>
                    <span className="text-[10px] text-chocolate-500 shrink-0">
                      {img.file_size ? `${Math.round(img.file_size / 1024)} KB` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gold-500/20">
                    <button
                      onClick={() => copyImageUrl(img.url)}
                      className="px-2.5 py-1 bg-white hover:bg-cream-200 text-chocolate-800 text-xs font-semibold rounded-lg border border-gold-500/30 flex items-center gap-1 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-3 h-3 text-caramel-600" />
                      <span>Copy URL</span>
                    </button>

                    <button
                      onClick={() => confirmDelete(img)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Image"
        message={`Are you sure you want to delete "${imgToDelete?.original_name}" from the media library?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
