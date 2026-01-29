import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'General' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);