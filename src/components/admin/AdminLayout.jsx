import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  FileText,
  Images,
  Sparkles,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { branding } = useBrand();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Images', path: '/admin/images', icon: Images },
    { name: 'Logo & Branding', path: '/admin/branding', icon: Sparkles },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row text-chocolate-900 font-sans">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-chocolate-950 text-cream-100 px-4 py-3 border-b border-chocolate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img
            src={branding.logo_url || '/images/brand-logo.jpg'}
            alt="Admin Logo"
            className="w-9 h-9 rounded-full object-cover border border-gold-500"
          />
          <div>
            <h1 className="font-serif text-sm font-bold tracking-wider text-cream-100 uppercase">
              {branding.brand_name || 'INIYAL’S BAKE HOUSE'}
            </h1>
            <span className="text-[10px] text-gold-400 font-medium tracking-wide">CMS Control Panel</span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-cream-200 hover:bg-chocolate-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Backdrop on Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-chocolate-950 text-cream-100 flex flex-col justify-between border-r border-chocolate-800/80 transition-all duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-5 border-b border-chocolate-800/80 flex items-center justify-between">
            <Link
              to="/admin"
              className="flex items-center gap-3 group"
              onClick={() => setSidebarOpen(false)}
            >
              <img
                src={branding.logo_url || '/images/brand-logo.jpg'}
                alt="Brand Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-gold-500 shadow-sm shrink-0"
              />
              {!collapsed && (
                <div className="overflow-hidden">
                  <h2 className="font-serif text-sm font-bold text-cream-100 tracking-wider uppercase leading-tight truncate">
                    {branding.brand_name || 'INIYAL’S BAKE HOUSE'}
                  </h2>
                  <span className="text-[11px] text-gold-400 font-medium">Bakery Admin</span>
                </div>
              )}
            </Link>

            {/* Collapse toggle for Desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex text-cream-400 hover:text-white p-1 rounded-lg hover:bg-chocolate-800/60"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight className={`w-4 h-4 transform transition-transform ${collapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-caramel-500 text-white shadow-warm'
                        : 'text-cream-300 hover:bg-chocolate-850 hover:text-white'
                    }`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0 text-gold-400 group-hover:text-white transition-colors" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-chocolate-800/80 space-y-2">
          {/* Public Website Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gold-400 hover:text-white hover:bg-chocolate-850 transition-colors"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View Public Site</span>}
          </a>

          {/* User Info & Logout */}
          <div className="pt-2 border-t border-chocolate-850 flex items-center justify-between px-2">
            {!collapsed && (
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-full bg-caramel-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-cream-200 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-cream-400 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top bar on Desktop */}
        <header className="hidden md:flex bg-white border-b border-gold-500/20 px-8 py-3.5 items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-chocolate-700">
            <span className="font-semibold text-chocolate-900">Iniyal’s Bake House CMS</span>
            <span>•</span>
            <span className="text-xs text-chocolate-600 bg-cream-200 px-2.5 py-0.5 rounded-full font-medium">
              Production Database: Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-chocolate-900 text-xs font-bold border border-gold-500/40 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-caramel-600" />
              <span>Live Website Preview</span>
            </a>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
