import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transfer from '@/models/Transfer';
import Product from '@/models/Product';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { transferId } = await req.json();
    const transfer = await Transfer.findById(transferId);

    if (!transfer) return NextResponse.json({ error: 'ไม่พบใบเบิก' }, { status: 404 });
    if (transfer.status !== 'pending') return NextResponse.json({ error: 'รายการนี้ถูกดำเนินการไปแล้ว' }, { status: 400 });

    // 1. ตรวจสอบสต็อกสินค้าทุกตัวก่อน (Transaction Check)
    for (const item of transfer.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.quantity < item.quantity) {
        return NextResponse.json({ 
          error: `สินค้า "${item.productName}" มีไม่พอ (เหลือ ${product?.quantity || 0})` 
        }, { status: 400 });
      }
    }

    // 2. ถ้าของพอ -> ทำการตัดสต็อกจริง
    for (const item of transfer.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity } // ลบจำนวนออก
      });
    }

    // 3. อัปเดตสถานะเป็น Approved
    transfer.status = 'approved';
    await transfer.save();

    return NextResponse.json({ message: 'อนุมัติและตัดสต็อกเรียบร้อย' });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}