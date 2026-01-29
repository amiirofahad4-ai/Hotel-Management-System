import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  specialRequests: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'], default: 'confirmed' },
  specialRequests: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
