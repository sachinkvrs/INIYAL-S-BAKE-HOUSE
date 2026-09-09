import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  display_order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
