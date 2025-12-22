import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transfer from '@/models/Transfer';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const transfer = await Transfer.findById(id);
    if (!transfer) return NextResponse.json({ error: 'ไม่พบคำขอ' }, { status: 404 });

    if (transfer.status !== 'pending') {
      return NextResponse.json({ error: 'คำขอนี้ถูกจัดการไปแล้ว' }, { status: 400 });
    }

    // แค่อัปเดตสถานะ ไม่ต้องคืนของเพราะยังไม่ได้ตัด
    transfer.status = 'rejected';
    transfer.approvedBy = 'Admin';
    transfer.approvedDate = new Date();
    
    await transfer.save();

    return NextResponse.json({ message: 'ปฏิเสธคำขอเรียบร้อย', transfer });

  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}