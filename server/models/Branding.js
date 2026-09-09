import mongoose from 'mongoose';

const brandingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.Branding || mongoose.model('Branding', brandingSchema);
