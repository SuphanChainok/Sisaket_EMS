import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transfer from '@/models/Transfer';

// GET: ดูรายการเบิกทั้งหมด (เรียงตามล่าสุด)
export async function GET() {
  await dbConnect();
  const transfers = await Transfer.find({}).sort({ createdAt: -1 });
  return NextResponse.json(transfers);
}

// POST: สร้างใบเบิกใหม่ (สถานะ Pending)
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    // บันทึกใบเบิก (ยังไม่ตัดสต็อกตรงนี้ รออนุมัติก่อน)
    const newTransfer = await Transfer.create(body);
    return NextResponse.json(newTransfer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 });
  }
}