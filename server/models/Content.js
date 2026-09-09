import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  section: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.Content || mongoose.model('Content', contentSchema);
