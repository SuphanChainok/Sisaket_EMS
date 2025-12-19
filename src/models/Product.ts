import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minAlert: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'ทั่วไป' },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    minAlert: { type: Number, default: 10 },
  },
  { timestamps: true }
);

// เช็คว่ามี Model นี้อยู่แล้วหรือยัง กัน Error Overwrite
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);