import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transfer from '@/models/Transfer';

// ฟังก์ชันช่วยสร้างเลขที่เอกสาร (TR-YYMM-XXX)
async function generateDocNo() {
  const now = new Date();
  const year = (now.getFullYear() + 543).toString().slice(-2); // ปี พ.ศ. 2 หลัก (เช่น 68)
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // เดือน 2 หลัก (เช่น 12)
  const prefix = `TR-${year}${month}-`;

  // หาใบลาสุดของเดือนนี้
  const lastDoc = await Transfer.findOne({ docNo: { $regex: `^${prefix}` } })
    .sort({ docNo: -1 })
    .select('docNo');

  let runningNo = 1;
  if (lastDoc && lastDoc.docNo) {
    const lastRunning = parseInt(lastDoc.docNo.split('-')[2]);
    runningNo = lastRunning + 1;
  }

  // เติม 0 ข้างหน้าให้ครบ 3 หลัก (เช่น 001)
  return `${prefix}${runningNo.toString().padStart(3, '0')}`;
}

export async function GET() {
  await dbConnect();
  try {
    const transfers = await Transfer.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(transfers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();

    // ✅ สร้างเลขที่เอกสารอัตโนมัติ
    const newDocNo = await generateDocNo();

    const newTransfer = await Transfer.create({
      docNo: newDocNo, // ใส่เลขที่เอกสาร
      
      destination: body.destination,
      centerId: body.centerId,
      centerName: body.centerName, // หรือใช้ body.destination ถ้าชื่อเหมือนกัน
      
      items: body.items,
      requestedBy: body.requestedBy || 'เจ้าหน้าที่',
      status: 'pending',
      createdAt: new Date()
    });

    return NextResponse.json(newTransfer);
  } catch (error: any) {
    console.error("Create Transfer Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create request' }, { status: 500 });
  }
}