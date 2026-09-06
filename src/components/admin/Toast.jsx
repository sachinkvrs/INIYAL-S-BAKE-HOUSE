import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isError
                ? 'bg-red-950 text-red-100 border-red-800'
                : isSuccess
                ? 'bg-chocolate-900 text-cream-100 border-caramel-500 shadow-warm-lg'
                : 'bg-chocolate-850 text-cream-100 border-gold-500/40'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-caramel-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-sm">
              {toast.title && <h5 className="font-bold mb-0.5">{toast.title}</h5>}
              <p className="leading-snug text-cream-200">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-cream-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
