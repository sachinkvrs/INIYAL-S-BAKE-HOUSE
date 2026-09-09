import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  short_description: { type: String },
  category_id: { type: mongoose.Schema.Types.Mixed, default: null },
  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  price_250g: { type: Number, required: true },
  price_500g: { type: Number, required: true },
  price_1kg: { type: Number, required: true },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  badge: { type: String, default: null },
  display_order: { type: Number, default: 0 },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.pricing = {
      '250g': { label: '250 g', price: ret.price_250g },
      '500g': { label: '500 g', price: ret.price_500g },
      '1kg': { label: '1 kg', price: ret.price_1kg }
    };
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
