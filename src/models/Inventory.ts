import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['food', 'medicine', 'equipment', 'clothing', 'other'], // บังคับให้ตรงกับหมวดหมู่ที่เรามี
    default: 'other'
  },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true, default: 'ชิ้น' },
  minLevel: { type: Number, default: 10 }, // จุดเตือนขั้นต่ำ
  location: { type: String, default: '-' }, // ที่เก็บของ
  lastUpdated: { type: Date, default: Date.now }
});

// เช็คว่ามี Model นี้อยู่แล้วหรือยัง ถ้ามีให้ใช้ของเดิม ถ้าไม่มีให้สร้างใหม่
export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);