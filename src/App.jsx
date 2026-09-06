import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import Menu from './components/Menu';
import FeaturedProduct from './components/FeaturedProduct';
import AboutUs from './components/AboutUs';
import QualitySection from './components/QualitySection';
import Occasions from './components/Occasions';
import OrderCTA from './components/OrderCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Admin Components & Pages
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import ContentEditor from './pages/admin/ContentEditor';
import ImageGallery from './pages/admin/ImageGallery';
import Branding from './pages/admin/Branding';
import SettingsPage from './pages/admin/Settings';

// Public Landing Page Component
function PublicWebsite() {
  return (
    <div className="min-h-screen bg-cream-100 text-chocolate-900 font-sans selection:bg-caramel-500 selection:text-white flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow">
        <Hero />
        <WhyUs />
        <Menu />
        <FeaturedProduct />
        <AboutUs />
        <QualitySection />
        <Occasions />
        <OrderCTA />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrandProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Customer-Facing Website */}
              <Route path="/" element={<PublicWebsite />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Area */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<Categories />} />
                <Route path="content" element={<ContentEditor />} />
                <Route path="images" element={<ImageGallery />} />
                <Route path="branding" element={<Branding />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </BrandProvider>
    </AuthProvider>
  );
}
