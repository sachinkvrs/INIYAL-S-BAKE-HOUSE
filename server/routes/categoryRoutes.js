import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
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

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ display_order: 1, name: 1 });
    
    // Calculate product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const catObj = cat.toJSON();
        const count = await Product.countDocuments({
          $or: [{ category_id: cat._id.toString() }, { category_id: cat._id }],
          is_deleted: false
        });
        catObj.product_count = count;
        return catObj;
      })
    );

    res.json({ categories: categoriesWithCount });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST Create category (Protected)
router.post('/', verifyTokenMiddleware, async (req, res) => {
  try {
    const { name, display_order } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'A category with this name already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      display_order: display_order !== undefined ? Number(display_order) : 0
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT Update category (Protected)
router.put('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_order, enabled } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (name) {
      category.name = name.trim();
      category.slug = slugify(name);
    }
    if (display_order !== undefined) category.display_order = Number(display_order);
    if (enabled !== undefined) category.enabled = Boolean(enabled);

    await category.save();

    res.json({ message: 'Category updated successfully', category });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Category (Protected)
router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Unlink products
    await Product.updateMany(
      { $or: [{ category_id: id }, { category_id: category._id }] },
      { $set: { category_id: null } }
    );

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
