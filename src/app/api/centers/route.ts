import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Center from '@/models/Center';

export async function GET() {
  await dbConnect();
  try {
    const centers = await Center.find({}).sort({ name: 1 });
    return NextResponse.json(centers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch centers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // ตรวจสอบว่าข้อมูลอยู่ใน Key ไหน (บางทีอาจซ้อนอยู่ใน object อื่น)
    // จาก Log ที่ให้มา ข้อมูลน่าจะเป็น Array อยู่แล้ว หรือซ้อนอยู่ใน object
    let rawData: any[] = [];
    if (Array.isArray(body)) {
      rawData = body;
    } else if (body.data && Array.isArray(body.data)) {
      rawData = body.data;
    } else {
      rawData = [body];
    }

    // แปลงข้อมูล (Mapping) ให้ตรงกับ Database ของเรา
    const dataToInsert = rawData.map((item: any) => {
      // จัดการเบอร์โทร: ถ้าเป็น Array ให้รวมเป็น String คั่นด้วยคอมม่า
      let contactStr = '-';
      if (Array.isArray(item.phoneNumbers) && item.phoneNumbers.length > 0) {
        contactStr = item.phoneNumbers.join(', '); 
      } else if (typeof item.phoneNumbers === 'string') {
        contactStr = item.phoneNumbers;
      }

      return {
        name: item.name || 'ไม่ระบุชื่อ',
        location: item.location || `${item.subdistrict || ''} ${item.district || ''}`.trim() || '-',
        type: item.shelterType || 'ศูนย์พักพิง',  // แก้ให้ตรงกับไฟล์
        status: item.status === 'active' ? 'active' : 'inactive',
        contact: contactStr,
        population: 0, // ในไฟล์ไม่มีจำนวนคนปัจจุบัน ให้เริ่มที่ 0
        capacity: item.capacity || 0 // รองรับได้กี่คน
      };
    });

    // กรองข้อมูลที่ไม่มีชื่อออก
    const validData = dataToInsert.filter((d) => d.name !== 'ไม่ระบุชื่อ');

    if (validData.length === 0) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลที่ใช้งานได้' }, { status: 400 });
    }

    // บันทึกลงฐานข้อมูล (ใช้ ordered: false เพื่อข้ามตัวที่ซ้ำ)
    try {
      // ลบข้อมูล _id ออก เพื่อให้ MongoDB สร้างใหม่ (ป้องกัน ID ซ้ำ)
      await Center.insertMany(validData, { ordered: false });
    } catch (e: any) {
      if (e.code !== 11000) throw e; // ข้าม Error แค่กรณี Duplicate Key
    }

    return NextResponse.json({ 
      message: `นำเข้าข้อมูลสำเร็จ ${validData.length} รายการ`
    }, { status: 201 });

  } catch (error: any) {
    console.error('Import Error:', error);
    return NextResponse.json({ error: `เกิดข้อผิดพลาด: ${error.message}` }, { status: 500 });
  }
}