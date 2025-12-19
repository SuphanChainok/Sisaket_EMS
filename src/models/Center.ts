import mongoose, { Schema, Document } from 'mongoose';

export interface ICenter extends Document {
  name: string;        // ชื่อศูนย์
  location: string;    // ที่อยู่/อำเภอ
  type: string;        // ประเภท (ศูนย์พักพิง, จุดรับบริจาค)
  status: 'active' | 'inactive'; // สถานะเปิด/ปิด
  contact?: string;    // เบอร์โทร (ถ้ามี)
  population: number;  // จำนวนผู้อพยพปัจจุบัน
  capacity: number;    // รองรับได้สูงสุด
}

const CenterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, default: 'ศูนย์พักพิง' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    contact: { type: String, default: '-' },
    population: { type: Number, default: 0 },
    capacity: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.models.Center || mongoose.model<ICenter>('Center', CenterSchema);