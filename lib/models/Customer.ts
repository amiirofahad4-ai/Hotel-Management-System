import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
