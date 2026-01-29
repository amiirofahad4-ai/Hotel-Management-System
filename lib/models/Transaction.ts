import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  date: Date;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  account: mongoose.Types.ObjectId;
  reference: 'Booking' | 'Service' | 'Manual';
  referenceId?: mongoose.Types.ObjectId; // For Booking or Service ID
  category?: string; // For manual entries
  createdBy?: mongoose.Types.ObjectId; // User who created
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  reference: { type: String, enum: ['Booking', 'Service', 'Manual'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'reference' },
  category: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

// Index for efficient queries
TransactionSchema.index({ account: 1, date: -1 });
TransactionSchema.index({ type: 1, date: -1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);