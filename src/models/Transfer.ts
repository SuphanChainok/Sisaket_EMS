import mongoose, { Schema, Document } from 'mongoose';

// โครงสร้างของสินค้าในรายการเบิก
interface ITransferItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
}

export interface ITransfer extends Document {
  centerId: mongoose.Types.ObjectId; // ศูนย์ที่ขอเบิก
  centerName: string;
  items: ITransferItem[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  note?: string;
}

const TransferSchema: Schema = new Schema(
  {
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
    centerName: { type: String, required: true }, // เก็บชื่อไว้ด้วย เพื่อลดการ Query
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: String,
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'completed'], 
      default: 'pending' 
    },
    note: String,
  },
  { timestamps: true }
);

export default mongoose.models.Transfer || mongoose.model<ITransfer>('Transfer', TransferSchema);