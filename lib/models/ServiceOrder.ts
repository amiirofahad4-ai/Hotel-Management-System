import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceOrder extends Document {
  service: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  dateProvided: Date;
  status: 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceOrderSchema: Schema = new Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  dateProvided: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Completed' },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

// Pre-save hook to calculate totalAmount
ServiceOrderSchema.pre('save', function (this: any, next: any) {
  const doc = this as IServiceOrder
  if (doc.isModified('quantity') || doc.isModified('unitPrice')) {
    doc.totalAmount = doc.quantity * doc.unitPrice
  }
  next()
})

export default mongoose.models.ServiceOrder || mongoose.model<IServiceOrder>('ServiceOrder', ServiceOrderSchema);