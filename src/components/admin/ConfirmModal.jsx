import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-chocolate-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-cream-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-cream-100">{title}</h3>
          </div>
        </div>

        <p className="text-cream-300 text-sm leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-chocolate-800 hover:bg-chocolate-700 text-cream-200 text-sm font-semibold transition-colors border border-chocolate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-caramel-500 hover:bg-caramel-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
