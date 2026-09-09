import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  original_name: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, default: 'other' },
  file_size: { type: Number },
  mime_type: { type: String },
  alt_text: { type: String },
  created_at: { type: Date, default: Date.now }
});

imageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Image || mongoose.model('Image', imageSchema);
