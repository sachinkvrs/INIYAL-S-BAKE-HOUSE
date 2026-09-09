import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);
