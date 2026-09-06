import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ImageUploadField({
  label = "Product Image",
  currentImage,
  onImageUploaded,
  category = "products",
  aspectRatio = "aspect-square",
  helperText = "Recommended: Square 1:1 image (JPG, PNG, WebP up to 10MB)"
}) {
  const { authFetch } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image (JPEG, PNG, WebP, SVG, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be less than 10MB.');
      return;
    }

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to server
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('alt_text', file.name);

    setUploading(true);
    try {
      const res = await authFetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }
      setPreview(data.url);
      onImageUploaded(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Image upload failed. Try again.');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-chocolate-800">
        {label}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Preview Container */}
        <div className={`sm:col-span-5 ${aspectRatio} relative rounded-2xl overflow-hidden bg-chocolate-950 border-2 border-dashed border-gold-500/40 flex items-center justify-center group shadow-inner`}>
          {preview ? (
            <>
              <img
                src={preview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-caramel-500 hover:bg-caramel-600 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace Image</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-chocolate-400 p-4 text-center">
              <ImageIcon className="w-10 h-10 text-gold-500/60 mb-2" />
              <span className="text-xs text-chocolate-600">No image uploaded</span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-chocolate-950/80 flex flex-col items-center justify-center text-cream-200">
              <div className="w-7 h-7 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs font-medium">Uploading...</span>
            </div>
          )}
        </div>

        {/* Dropzone & Selector */}
        <div className="sm:col-span-7">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? 'border-caramel-500 bg-caramel-500/10 scale-102'
                : 'border-gold-500/40 hover:border-caramel-500 hover:bg-cream-100/50 bg-white'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-caramel-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-chocolate-900">
              Click to choose file or drag & drop
            </p>
            <p className="text-xs text-chocolate-600 mt-1">
              {helperText}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>
          )}

          {preview && !uploading && (
            <div className="mt-2 flex items-center justify-between text-xs text-chocolate-600 bg-cream-200/50 px-3 py-1.5 rounded-lg border border-gold-500/20">
              <span className="truncate max-w-[240px]">{preview}</span>
              <span className="text-green-700 font-semibold flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5" /> Ready
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
