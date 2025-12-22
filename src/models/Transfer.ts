import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema({
  docNo: { type: String, required: true, unique: true }, // เลขที่เอกสาร (เช่น TR-6812-001)
  destination: { type: String, required: true }, // ปลายทาง (ชื่อศูนย์)
  
  // ✅ ผมขอเพิ่ม 2 ตัวนี้กลับเข้าไป เพื่อให้รู้ว่าศูนย์ไหนเป็นคนขอ (เอาไว้กรองประวัติ)
  centerId: { type: String }, 
  centerName: { type: String },

  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  requestedBy: { type: String, default: 'เจ้าหน้าที่ศูนย์' },
  approvedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.models.Transfer || mongoose.model('Transfer', TransferSchema);