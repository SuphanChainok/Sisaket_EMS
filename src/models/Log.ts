import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  user: { type: String, default: 'System' }, // ชื่อคนทำ (เช่น Admin, User)
  action: { type: String, required: true },  // การกระทำ (เช่น LOGIN, APPROVE)
  description: { type: String, required: true }, // รายละเอียด
  timestamp: { type: Date, default: Date.now } // เวลาที่เกิดเหตุ
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);