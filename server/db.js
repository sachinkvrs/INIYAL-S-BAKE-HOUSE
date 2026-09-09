import mongoose from 'mongoose';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Branding from './models/Branding.js';
import Content from './models/Content.js';
import Image from './models/Image.js';
import Setting from './models/Setting.js';
import Order from './models/Order.js';

dotenv.config();

// Ensure Google / Cloudflare public DNS for MongoDB Atlas SRV lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setting DNS is restricted
}

const DEFAULT_MONGODB_URI = 'mongodb+srv://cake:Sachin%40123@iniyal.xuljehd.mongodb.net/iniyals_bakehouse?retryWrites=true&w=majority&appName=Iniyal';

// Serverless connection caching
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then(async (m) => {
      console.log('[MongoDB] Connected successfully to Cloud Database');
      await seedInitialData();
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[MongoDB Error]', e.message);
    throw e;
  }

  return cached.conn;
}

export async function seedInitialData() {
  try {
    // 1. Seed Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@iniyalsbakehouse.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Iniyal@Brownies2026';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const salt = bcrypt.genSaltSync(10);
        const password_hash = bcrypt.hashSync(adminPassword, salt);
        await User.create({
          email: adminEmail,
          password_hash,
          name: "Iniyal's Admin",
          role: 'admin'
        });
        console.log(`[Database] Seeded initial admin account: ${adminEmail}`);
      }
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const seedCategories = [
        { name: 'Brownies', slug: 'brownies', display_order: 1 },
        { name: 'Special Brownies', slug: 'special-brownies', display_order: 2 },
        { name: 'Gift Boxes', slug: 'gift-boxes', display_order: 3 },
        { name: 'Combos', slug: 'combos', display_order: 4 },
        { name: 'New Arrivals', slug: 'new-arrivals', display_order: 5 }
      ];
      await Category.insertMany(seedCategories);
      console.log('[Database] Seeded categories');
    }

    // 3. Seed Products
    const productCount = await Product.countDocuments({ is_deleted: false });
    if (productCount === 0) {
      const browniesCat = await Category.findOne({ slug: 'brownies' });
      const catId = browniesCat ? browniesCat._id.toString() : '1';

      const seedProducts = [
        {
          name: 'Fudgy Brownie',
          slug: 'fudgy-brownie',
          description: 'Rich chocolate. Gooey center. Pure indulgence.',
          short_description: 'Rich chocolate. Gooey center. Pure indulgence.',
          category_id: catId,
          image: '/images/fudgy-brownie.jpg',
          gallery: ['/images/fudgy-brownie.jpg', '/images/featured-brownie.jpg'],
          price_250g: 200,
          price_500g: 350,
          price_1kg: 680,
          available: true,
          featured: true,
          badge: 'Bestseller',
          display_order: 1
        },
        {
          name: 'Eggless Brownie',
          slug: 'eggless-brownie',
          description: 'Light, soft and chocolaty. A perfect balance of taste and texture.',
          short_description: 'Light, soft and chocolaty.',
          category_id: catId,
          image: '/images/eggless-brownie.jpg',
          gallery: ['/images/eggless-brownie.jpg'],
          price_250g: 225,
          price_500g: 400,
          price_1kg: 750,
          available: true,
          featured: false,
          badge: '100% Vegetarian',
          display_order: 2
        },
        {
          name: 'Ragi Brownie',
          slug: 'ragi-brownie',
          description: 'Wholesome. Nutritious. Delicious.',
          short_description: 'Wholesome. Nutritious. Delicious.',
          category_id: catId,
          image: '/images/ragi-brownie.jpg',
          gallery: ['/images/ragi-brownie.jpg'],
          price_250g: 230,
          price_500g: 450,
          price_1kg: 800,
          available: true,
          featured: false,
          badge: 'Healthy Indulgence',
          display_order: 3
        }
      ];
      await Product.insertMany(seedProducts);
      console.log('[Database] Seeded 3 initial products');
    }

    // 4. Seed Branding
    const brandingCount = await Branding.countDocuments();
    if (brandingCount === 0) {
      const brandingData = {
        brand_name: "INIYAL’S BAKE HOUSE",
        tagline: "Good ingredients. Pure love. Perfect brownies.",
        phone: "8681078776",
        whatsapp: "8681078776",
        instagram: "@iniyals_bakehouse",
        instagram_url: "https://instagram.com/iniyals_bakehouse",
        logo_url: "/images/brand-logo.jpg",
        footer_logo_url: "/images/brand-logo.jpg",
        favicon_url: "/images/brand-logo.jpg"
      };

      const docs = Object.entries(brandingData).map(([key, value]) => ({ key, value }));
      await Branding.insertMany(docs);
      console.log('[Database] Seeded branding details');
    }

    // 5. Seed Website Content
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      const initialContent = {
        hero: {
          badgeText: "Artisanal Homemade Brownies",
          heading1: "HOMEMADE",
          headingHighlight: "BROWNIES",
          heading2: "MADE WITH LOVE",
          subtext: "Rich, fudgy and freshly baked brownies made with quality ingredients.",
          ctaPrimary: "ORDER NOW",
          ctaSecondary: "VIEW MENU",
          heroImage: "/images/hero-brownie.jpg"
        },
        why_us: {
          heading: "WHY YOU’LL LOVE OUR BROWNIES",
          subtext: "Pure Indulgence",
          features: [
            { title: "Freshly Baked", desc: "Made fresh for every order.", icon: "Flame" },
            { title: "Rich & Fudgy", desc: "Deep chocolate flavour with a soft fudgy center.", icon: "Sparkles" },
            { title: "Quality Ingredients", desc: "Made with carefully selected ingredients.", icon: "Award" },
            { title: "Made With Love", desc: "Homemade goodness in every bite.", icon: "HeartHandshake" }
          ]
        },
        featured: {
          heading: "THE ONE EVERYONE LOVES",
          subtext: "Customer Favorite",
          description: "Dense, rich, fudgy and loaded with chocolate flavour. Our signature brownie is baked to give you that perfect crackly top and irresistible soft center.",
          cta: "ORDER YOURS",
          image: "/images/featured-brownie.jpg"
        },
        about: {
          heading: "BAKED WITH LOVE",
          badge: "Our Kitchen Philosophy",
          quote: "At Iniyal’s Bake House, we believe the best brownies are made with simple ingredients, careful preparation and lots of love. Every batch is freshly prepared to give you that homemade taste you can feel in every bite.",
          description: "We never cut corners or rely on artificial additives. From rich cocoa and farm butter to slow temperature control in our home kitchen, every pan of brownies is handcrafted to bring happiness directly to your doorstep.",
          image: "/images/about-baking.jpg"
        },
        quality: {
          heading: "GOOD INGREDIENTS. PURE LOVE.",
          badge: "Our Quality Standard",
          points: [
            { title: "No Artificial Colours", desc: "100% natural rich dark chocolate hue directly from high-grade cocoa." },
            { title: "No Preservatives", desc: "Zero artificial shelf-life extenders. Pure, honest baking." },
            { title: "Made with Premium Ingredients", desc: "Hand-picked cocoa, pure butter, farm-fresh ingredients." },
            { title: "Eggless Options", desc: "Specially crafted eggless brownies that retain that signature fudgy texture." },
            { title: "Freshly Baked", desc: "Never stored or frozen. Baked specifically when your order is placed." },
            { title: "Perfect for Every Occasion", desc: "From cozy evening treats to grand celebrations and thoughtful gifts." }
          ]
        },
        occasions: {
          heading: "MADE FOR EVERY SWEET MOMENT",
          subtext: "Moments of Joy",
          occasions: [
            { title: "Birthdays", desc: "Sweeten the special day with warm fudgy brownies that everyone fights over." },
            { title: "Anniversaries", desc: "A rich, decadent dessert crafted to celebrate your sweet milestones." },
            { title: "Gifts", desc: "Elegantly packed homemade treats that say “you are cherished” like nothing else." },
            { title: "Celebrations", desc: "From promotions to family gatherings, brownies make every party unforgettable." },
            { title: "Movie Nights", desc: "Warm brownies, a scoop of vanilla ice cream, and your favourite films." },
            { title: "Just Because", desc: "Because you never need an excuse to treat yourself to pure chocolate bliss." }
          ]
        },
        order_cta: {
          heading: "CRAVING BROWNIES?",
          badge: "Fresh Batches Daily",
          text: "Your next chocolate craving is just one order away.",
          cta: "ORDER NOW",
          subtext: "Pre-orders welcome • Delivered fresh & secure • Custom gifting options available"
        },
        contact: {
          heading: "LET’S MAKE YOUR DAY SWEETER",
          subtext: "Get In Touch",
          title: "Fresh Homemade Goodness",
          description: "Have a question about bulk orders, party boxes, custom brownies, or dietary requests? Reach out anytime, we’d love to bake for you!"
        },
        footer: {
          quote: "“Brownies that bring smiles.” Freshly baked homemade chocolate indulgence crafted with love for all your moments."
        }
      };

      const contentDocs = Object.entries(initialContent).map(([key, val]) => ({
        key,
        section: key,
        value: val
      }));
      await Content.insertMany(contentDocs);
      console.log('[Database] Seeded initial website content');
    }

    // 6. Seed Images
    const imageCount = await Image.countDocuments();
    if (imageCount === 0) {
      const seedImgs = [
        { filename: 'hero-brownie.jpg', original_name: 'hero-brownie.jpg', url: '/images/hero-brownie.jpg', category: 'hero', alt_text: 'Decadent hero brownie stack' },
        { filename: 'fudgy-brownie.jpg', original_name: 'fudgy-brownie.jpg', url: '/images/fudgy-brownie.jpg', category: 'products', alt_text: 'Fudgy Brownie' },
        { filename: 'eggless-brownie.jpg', original_name: 'eggless-brownie.jpg', url: '/images/eggless-brownie.jpg', category: 'products', alt_text: 'Eggless Brownie' },
        { filename: 'ragi-brownie.jpg', original_name: 'ragi-brownie.jpg', url: '/images/ragi-brownie.jpg', category: 'products', alt_text: 'Ragi Brownie' },
        { filename: 'featured-brownie.jpg', original_name: 'featured-brownie.jpg', url: '/images/featured-brownie.jpg', category: 'featured', alt_text: 'Featured Signature Fudgy Brownie' },
        { filename: 'about-baking.jpg', original_name: 'about-baking.jpg', url: '/images/about-baking.jpg', category: 'about', alt_text: 'Artisanal home baking ingredients' },
        { filename: 'brand-logo.jpg', original_name: 'brand-logo.jpg', url: '/images/brand-logo.jpg', category: 'branding', alt_text: "Iniyal's Bake House Logo Emblem" }
      ];
      await Image.insertMany(seedImgs);
      console.log('[Database] Seeded image gallery');
    }

    // 7. Seed Settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      const seedSettings = {
        business_name: "Iniyal’s Bake House",
        tagline: "Good ingredients. Pure love. Perfect brownies.",
        phone: "8681078776",
        whatsapp: "8681078776",
        instagram: "@iniyals_bakehouse",
        email: "orders@iniyalsbakehouse.com",
        address: "Homemade Bakery, Tamil Nadu, India",
        opening_hours: "9:00 AM – 9:00 PM (Daily)",
        seo_title: "Iniyal’s Bake House | Homemade Brownies",
        seo_description: "Order fresh homemade fudgy, eggless and ragi brownies from Iniyal’s Bake House. Rich chocolate brownies made with quality ingredients and love.",
        seo_og_image: "/images/hero-brownie.jpg",
        social_instagram: "https://instagram.com/iniyals_bakehouse",
        social_facebook: "https://facebook.com/iniyalsbakehouse",
        social_youtube: "https://youtube.com/@iniyalsbakehouse"
      };

      const settingsDocs = Object.entries(seedSettings).map(([key, value]) => ({ key, value }));
      await Setting.insertMany(settingsDocs);
      console.log('[Database] Seeded settings');
    }
  } catch (err) {
    console.error('[Database Seed Error]', err);
  }
}

export default { connectDB, seedInitialData };
