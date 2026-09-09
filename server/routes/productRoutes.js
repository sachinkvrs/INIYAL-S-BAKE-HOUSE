import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { verifyTokenMiddleware } from '../auth.js';

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all products
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const filter = { is_deleted: false };
    if (!showAll) {
      filter.available = true;
    }

    const products = await Product.find(filter).sort({ display_order: 1, _id: 1 });
    const categories = await Category.find();
    const catMap = {};
    categories.forEach(c => {
      catMap[c._id.toString()] = c.name;
    });

    const parsed = products.map(prod => {
      const obj = prod.toJSON();
      obj.category_name = catMap[obj.category_id?.toString()] || null;
      return obj;
    });

    res.json({ products: parsed });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET single product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      product = await Product.findOne({ _id: idOrSlug, is_deleted: false });
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug, is_deleted: false });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const obj = product.toJSON();
    if (obj.category_id) {
      const cat = await Category.findById(obj.category_id).catch(() => null);
      obj.category_name = cat ? cat.name : null;
    }

    res.json({ product: obj });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Create new product (Protected)
router.post('/', verifyTokenMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      short_description,
      category_id,
      image,
      gallery,
      price_250g,
      price_500g,
      price_1kg,
      available,
      featured,
      badge,
      display_order
    } = req.body;

    if (!name || !description || price_250g === undefined || price_500g === undefined || price_1kg === undefined) {
      return res.status(400).json({ error: 'Name, description, and prices for 250g, 500g, and 1kg are required.' });
    }

    const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      short_description: short_description ? short_description.trim() : description.slice(0, 80),
      category_id: category_id || null,
      image: image || '/images/fudgy-brownie.jpg',
      gallery: Array.isArray(gallery) ? gallery : [],
      price_250g: parseFloat(price_250g),
      price_500g: parseFloat(price_500g),
      price_1kg: parseFloat(price_1kg),
      available: available !== undefined ? Boolean(available) : true,
      featured: featured !== undefined ? Boolean(featured) : false,
      badge: badge ? badge.trim() : null,
      display_order: display_order !== undefined ? Number(display_order) : 0
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT Update product (Protected)
router.put('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, is_deleted: false });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name,
      description,
      short_description,
      category_id,
      image,
      gallery,
      price_250g,
      price_500g,
      price_1kg,
      available,
      featured,
      badge,
      display_order
    } = req.body;

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (short_description !== undefined) product.short_description = short_description;
    if (category_id !== undefined) product.category_id = category_id || null;
    if (image) product.image = image;
    if (Array.isArray(gallery)) product.gallery = gallery;
    if (price_250g !== undefined) product.price_250g = parseFloat(price_250g);
    if (price_500g !== undefined) product.price_500g = parseFloat(price_500g);
    if (price_1kg !== undefined) product.price_1kg = parseFloat(price_1kg);
    if (available !== undefined) product.available = Boolean(available);
    if (featured !== undefined) product.featured = Boolean(featured);
    if (badge !== undefined) product.badge = badge ? badge.trim() : null;
    if (display_order !== undefined) product.display_order = Number(display_order);
    product.updated_at = new Date();

    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH Toggle available status (Protected)
router.patch('/:id/toggle-available', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, is_deleted: false });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.available = !product.available;
    product.updated_at = new Date();
    await product.save();

    res.json({
      message: `Product is now ${product.available ? 'available' : 'unavailable'}`,
      available: product.available
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH Toggle featured status (Protected)
router.patch('/:id/toggle-featured', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, is_deleted: false });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.featured = !product.featured;
    product.updated_at = new Date();
    await product.save();

    res.json({
      message: `Product is now ${product.featured ? 'featured' : 'unfeatured'}`,
      featured: product.featured
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Duplicate product (Protected)
router.post('/:id/duplicate', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const source = await Product.findOne({ _id: id, is_deleted: false });
    if (!source) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newName = `${source.name} (Copy)`;
    const newSlug = slugify(newName) + '-' + Math.floor(1000 + Math.random() * 9000);

    const duplicate = await Product.create({
      name: newName,
      slug: newSlug,
      description: source.description,
      short_description: source.short_description,
      category_id: source.category_id,
      image: source.image,
      gallery: source.gallery,
      price_250g: source.price_250g,
      price_500g: source.price_500g,
      price_1kg: source.price_1kg,
      available: false,
      featured: false,
      badge: source.badge,
      display_order: source.display_order + 1
    });

    res.status(201).json({ message: 'Product duplicated successfully', product: duplicate });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE soft delete (Protected)
router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, is_deleted: false });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.is_deleted = true;
    product.updated_at = new Date();
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
