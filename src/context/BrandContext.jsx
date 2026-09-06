import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [branding, setBranding] = useState({
    brand_name: "INIYAL’S BAKE HOUSE",
    tagline: "Good ingredients. Pure love. Perfect brownies.",
    phone: "8681078776",
    whatsapp: "8681078776",
    instagram: "@iniyals_bakehouse",
    instagram_url: "https://instagram.com/iniyals_bakehouse",
    logo_url: "/images/brand-logo.jpg",
    footer_logo_url: "/images/brand-logo.jpg",
    favicon_url: "/images/brand-logo.jpg"
  });

  const [content, setContent] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [brandRes, contentRes, prodRes, catRes] = await Promise.all([
        fetch('/api/branding').catch(() => null),
        fetch('/api/content').catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/categories').catch(() => null)
      ]);

      if (brandRes && brandRes.ok) {
        const data = await brandRes.json();
        if (data.branding && Object.keys(data.branding).length > 0) {
          setBranding(prev => ({ ...prev, ...data.branding }));
          
          // Update favicon dynamically
          if (data.branding.favicon_url) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = data.branding.favicon_url;
          }
        }
      }

      if (contentRes && contentRes.ok) {
        const data = await contentRes.json();
        if (data.content) {
          setContent(data.content);
        }
      }

      if (prodRes && prodRes.ok) {
        const data = await prodRes.json();
        if (data.products) {
          setProducts(data.products);
        }
      }

      if (catRes && catRes.ok) {
        const data = await catRes.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error('Error loading brand/content data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <BrandContext.Provider
      value={{
        branding,
        content,
        products,
        categories,
        loading,
        refreshData,
        setBranding,
        setContent,
        setProducts
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
