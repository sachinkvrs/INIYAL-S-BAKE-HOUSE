import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const { branding } = useBrand();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@iniyalsbakehouse.com');
    setPassword('Iniyal@Brownies2026');
  };

  return (
    <div className="min-h-screen bg-chocolate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-cream-100 font-sans">
      
      {/* Warm Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-caramel-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Card */}
        <div className="bg-chocolate-900 border border-gold-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img
              src={branding.logo_url || '/images/brand-logo.jpg'}
              alt="Iniyal's Bake House Logo"
              className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-gold-500 shadow-lg mb-4"
            />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-cream-100 uppercase">
              {branding.brand_name || 'INIYAL’S BAKE HOUSE'}
            </h1>
            <p className="text-xs text-gold-400 font-medium tracking-wide mt-1">
              Admin CMS & Control Center
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium leading-snug animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-chocolate-400">
                  <Mail className="w-4 h-4 text-gold-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@iniyalsbakehouse.com"
                  className="w-full pl-10 pr-4 py-3 bg-chocolate-950 border border-gold-500/40 rounded-xl text-cream-100 text-sm placeholder-chocolate-500 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:border-caramel-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-chocolate-400">
                  <Lock className="w-4 h-4 text-gold-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-chocolate-950 border border-gold-500/40 rounded-xl text-cream-100 text-sm placeholder-chocolate-500 focus:outline-none focus:ring-2 focus:ring-caramel-500 focus:border-caramel-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-warm hover:shadow-warm-glow transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Filler */}
          <div className="mt-6 pt-5 border-t border-chocolate-800 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-gold-400 hover:text-white underline underline-offset-4 flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
              <span>Autofill Default Admin Credentials</span>
            </button>
          </div>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-cream-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
          >
            ← Return to Customer Website
          </a>
        </div>

      </div>
    </div>
  );
}
