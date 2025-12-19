import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Center from '@/models/Center';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { centerId, population } = await req.json();

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!centerId) {
      return NextResponse.json({ error: 'กรุณาระบุ Center ID' }, { status: 400 });
    }
    
    // แปลงค่าให้เป็นตัวเลข (กันคนส่งมาเป็น String)
    const popNum = parseInt(population);
    if (isNaN(popNum) || popNum < 0) {
      return NextResponse.json({ error: 'จำนวนคนไม่ถูกต้อง' }, { status: 400 });
    }

    // 2. อัปเดตข้อมูลใน Database
    // ใช้ findByIdAndUpdate เพื่อแก้ไขเฉพาะฟิลด์ population
    const updatedCenter = await Center.findByIdAndUpdate(
      centerId,
      { 
        population: popNum,
        // อาจจะเพิ่ม field 'lastUpdated' ด้วยก็ได้ เพื่อให้รู้ว่าอัปเดตเมื่อไหร่
        updatedAt: new Date() 
      },
      { new: true } // ให้ Return ค่าใหม่กลับมาแสดง
    );

    if (!updatedCenter) {
      return NextResponse.json({ error: 'ไม่พบศูนย์ดังกล่าวในระบบ' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'อัปเดตยอดเรียบร้อยแล้ว', 
      center: updatedCenter.name,
      population: updatedCenter.population 
    });

  } catch (error: any) {
    console.error('Update Population Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}