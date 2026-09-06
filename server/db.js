import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'bakehouse.db');
const dbDir = path.dirname(dbPath);

// Ensure the directory exists before better-sqlite3 attempts to open/create the file
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      display_order INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      category_id INTEGER,
      image TEXT NOT NULL,
      gallery TEXT DEFAULT '[]',
      price_250g REAL NOT NULL,
      price_500g REAL NOT NULL,
      price_1kg REAL NOT NULL,
      available INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      badge TEXT,
      display_order INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
    )
  `);

  // 4. Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      products_json TEXT NOT NULL,
      quantity TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Website Content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS website_content (
      key TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      value_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Images gallery table
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT DEFAULT 'other',
      file_size INTEGER,
      mime_type TEXT,
      alt_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. Branding table
  db.exec(`
    CREATE TABLE IF NOT EXISTS branding (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 8. Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@iniyalsbakehouse.com';
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'Iniyal@Brownies2026';
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(adminRawPassword, salt);
    db.prepare(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run(adminEmail, passwordHash, "Iniyal's Admin", 'admin');
    console.log(`[Database] Seeded initial admin account: ${adminEmail}`);
  }

  // Seed Categories if empty
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (categoryCount === 0) {
    const seedCategories = [
      { name: 'Brownies', slug: 'brownies', display_order: 1 },
      { name: 'Special Brownies', slug: 'special-brownies', display_order: 2 },
      { name: 'Gift Boxes', slug: 'gift-boxes', display_order: 3 },
      { name: 'Combos', slug: 'combos', display_order: 4 },
      { name: 'New Arrivals', slug: 'new-arrivals', display_order: 5 }
    ];
    const insertCat = db.prepare('INSERT INTO categories (name, slug, display_order) VALUES (?, ?, ?)');
    for (const cat of seedCategories) {
      insertCat.run(cat.name, cat.slug, cat.display_order);
    }
    console.log('[Database] Seeded categories');
  }

  // Seed Products if empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0').get().count;
  if (productCount === 0) {
    const seedProducts = [
      {
        name: 'Fudgy Brownie',
        slug: 'fudgy-brownie',
        description: 'Rich chocolate. Gooey center. Pure indulgence.',
        short_description: 'Rich chocolate. Gooey center. Pure indulgence.',
        category_id: 1,
        image: '/images/fudgy-brownie.jpg',
        gallery: JSON.stringify(['/images/fudgy-brownie.jpg', '/images/featured-brownie.jpg']),
        price_250g: 200,
        price_500g: 350,
        price_1kg: 680,
        available: 1,
        featured: 1,
        badge: 'Bestseller',
        display_order: 1
      },
      {
        name: 'Eggless Brownie',
        slug: 'eggless-brownie',
        description: 'Light, soft and chocolaty. A perfect balance of taste and texture.',
        short_description: 'Light, soft and chocolaty.',
        category_id: 1,
        image: '/images/eggless-brownie.jpg',
        gallery: JSON.stringify(['/images/eggless-brownie.jpg']),
        price_250g: 225,
        price_500g: 400,
        price_1kg: 750,
        available: 1,
        featured: 0,
        badge: '100% Vegetarian',
        display_order: 2
      },
      {
        name: 'Ragi Brownie',
        slug: 'ragi-brownie',
        description: 'Wholesome. Nutritious. Delicious.',
        short_description: 'Wholesome. Nutritious. Delicious.',
        category_id: 1,
        image: '/images/ragi-brownie.jpg',
        gallery: JSON.stringify(['/images/ragi-brownie.jpg']),
        price_250g: 230,
        price_500g: 450,
        price_1kg: 800,
        available: 1,
        featured: 0,
        badge: 'Healthy Indulgence',
        display_order: 3
      }
    ];

    const insertProd = db.prepare(`
      INSERT INTO products (
        name, slug, description, short_description, category_id,
        image, gallery, price_250g, price_500g, price_1kg,
        available, featured, badge, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of seedProducts) {
      insertProd.run(
        p.name, p.slug, p.description, p.short_description, p.category_id,
        p.image, p.gallery, p.price_250g, p.price_500g, p.price_1kg,
        p.available, p.featured, p.badge, p.display_order
      );
    }
    console.log('[Database] Seeded 3 initial products');
  }

  // Seed Branding if empty
  const brandingCount = db.prepare('SELECT COUNT(*) as count FROM branding').get().count;
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

    const insertBrand = db.prepare('INSERT OR REPLACE INTO branding (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(brandingData)) {
      insertBrand.run(k, v);
    }
    console.log('[Database] Seeded branding details');
  }

  // Seed Website Content if empty
  const contentCount = db.prepare('SELECT COUNT(*) as count FROM website_content').get().count;
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

    const insertContent = db.prepare('INSERT OR REPLACE INTO website_content (key, section, value_json) VALUES (?, ?, ?)');
    for (const [sec, val] of Object.entries(initialContent)) {
      insertContent.run(sec, sec, JSON.stringify(val));
    }
    console.log('[Database] Seeded initial website content');
  }

  // Seed Initial Orders if empty
  const ordersCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (ordersCount === 0) {
    const seedOrders = [
      {
        order_number: 'IBH-1001',
        customer_name: 'Ananya Sharma',
        phone: '9876543210',
        products_json: JSON.stringify([{ name: 'Fudgy Brownie', weight: '500 g', price: 350, qty: 1 }]),
        quantity: '1 Box (500g)',
        total_amount: 350,
        status: 'Preparing',
        notes: 'Requested extra chocolate drizzle'
      },
      {
        order_number: 'IBH-1002',
        customer_name: 'Karthik Raja',
        phone: '9123456780',
        products_json: JSON.stringify([{ name: 'Eggless Brownie', weight: '1 kg', price: 750, qty: 1 }]),
        quantity: '1 Box (1kg)',
        total_amount: 750,
        status: 'Confirmed',
        notes: 'Gift pack for anniversary'
      },
      {
        order_number: 'IBH-1003',
        customer_name: 'Meera Iyer',
        phone: '9840123456',
        products_json: JSON.stringify([{ name: 'Ragi Brownie', weight: '500 g', price: 450, qty: 1 }]),
        quantity: '1 Box (500g)',
        total_amount: 450,
        status: 'Pending',
        notes: 'Delivery requested after 6 PM'
      }
    ];

    const insertOrder = db.prepare(`
      INSERT INTO orders (order_number, customer_name, phone, products_json, quantity, total_amount, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const ord of seedOrders) {
      insertOrder.run(ord.order_number, ord.customer_name, ord.phone, ord.products_json, ord.quantity, ord.total_amount, ord.status, ord.notes);
    }
    console.log('[Database] Seeded initial orders');
  }

  // Seed Initial Images if empty
  const imageCount = db.prepare('SELECT COUNT(*) as count FROM images').get().count;
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
    const insertImg = db.prepare(`
      INSERT INTO images (filename, original_name, url, category, alt_text)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const im of seedImgs) {
      insertImg.run(im.filename, im.original_name, im.url, im.category, im.alt_text);
    }
    console.log('[Database] Seeded image gallery');
  }

  // Seed Settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
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
    const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(seedSettings)) {
      insertSetting.run(k, v);
    }
    console.log('[Database] Seeded settings');
  }
}

export default db;
