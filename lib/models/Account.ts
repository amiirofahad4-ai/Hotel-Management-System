import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  institution: string;
  balance: number;
  type: 'Checking' | 'Savings' | 'Credit' | 'Cash';
  accountNumber: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema({
  name: { type: String, required: true },
  institution: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  type: { type: String, enum: ['Checking', 'Savings', 'Credit', 'Cash'], required: true },
  accountNumber: { type: String, required: true, unique: true },
  description: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);