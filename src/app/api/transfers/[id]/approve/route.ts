import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transfer from '@/models/Transfer';
import Inventory from '@/models/Inventory';
import { createLog } from '@/lib/logger'; // ✅ 1. Import ตัวจดบันทึก

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    // 1. หาเอกสารคำขอ
    const transfer = await Transfer.findById(id);
    if (!transfer) return NextResponse.json({ error: 'ไม่พบคำขอ' }, { status: 404 });

    if (transfer.status !== 'pending') {
      return NextResponse.json({ error: 'คำขอนี้ถูกจัดการไปแล้ว' }, { status: 400 });
    }

    // 2. 🟢 ตัดสต็อกสินค้า (Real Inventory Logic)
    for (const item of transfer.items) {
      const product = await Inventory.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ error: `ไม่พบสินค้า ID: ${item.productId} ในคลัง` }, { status: 400 });
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ 
          error: `สินค้า "${product.name}" มีไม่พอ (ขอ: ${item.quantity}, มี: ${product.quantity})` 
        }, { status: 400 });
      }

      // ตัดยอด
      product.quantity -= item.quantity;
      await product.save();
    }

    // 3. อัปเดตสถานะคำขอ
    transfer.status = 'approved';
    transfer.approvedBy = 'Admin'; // (ถ้ามี session ส่งมา สามารถแก้ตรงนี้เป็นชื่อคนกดได้)
    transfer.approvedDate = new Date();
    
    await transfer.save();

    // ✅ 4. บันทึก Log ลงระบบ (ส่วนที่เพิ่มเข้ามา)
    await createLog(
      'Admin', 
      'APPROVE_TRANSFER', 
      `อนุมัติใบเบิก ${transfer.docNo} (${transfer.destination}) - ตัดสต็อกสำเร็จ`
    );

    return NextResponse.json({ message: 'อนุมัติและตัดสต็อกเรียบร้อย', transfer });

  } catch (error: any) {
    console.error("Approve Error:", error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการอนุมัติ' }, { status: 500 });
  }
}