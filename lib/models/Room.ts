import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  amenities: [{ type: String }],
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  description: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
