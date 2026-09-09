import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_number: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  products: { type: mongoose.Schema.Types.Mixed, default: [] },
  quantity: { type: String, default: '1 Order' },
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  notes: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
