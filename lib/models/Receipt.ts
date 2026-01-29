import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
  receiptNumber: string;
  customer: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  paymentMethod: 'Cash' | 'EVC Plus' | 'Bank' | 'Credit Card';
  amount: number;
  date: Date;
  description?: string;
  account: mongoose.Types.ObjectId;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReceiptSchema: Schema = new Schema({
  receiptNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  paymentMethod: { type: String, enum: ['Cash', 'EVC Plus', 'Bank', 'Credit Card'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

// Auto-generate receipt number
ReceiptSchema.pre('save', function(this: any, next: any) {
  const doc = this as IReceipt
  if (doc.isNew && !doc.receiptNumber) {
    mongoose.models.Receipt.countDocuments()
      .then((count: number) => {
        doc.receiptNumber = `RCP-${(count + 1).toString().padStart(6, '0')}`
        next()
      })
      .catch((err: any) => next(err))
  } else {
    next()
  }
})

export default mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);