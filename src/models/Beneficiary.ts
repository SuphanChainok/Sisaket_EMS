import mongoose from 'mongoose';

const BeneficiarySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  
  centerId: { type: String }, // ไอดีศูนย์พักพิง (ถ้ามี)
  centerName: { type: String, required: true }, // ชื่อศูนย์พักพิง
  
  status: { 
    type: String, 
    enum: ['normal', 'sick', 'disabled'], 
    default: 'normal' 
  },
  chronicDisease: { type: String, default: '-' }, // โรคประจำตัว
  registeredAt: { type: Date, default: Date.now }
});

export default mongoose.models.Beneficiary || mongoose.model('Beneficiary', BeneficiarySchema);