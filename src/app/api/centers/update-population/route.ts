import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Center from '@/models/Center';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { centerId, population } = await req.json();

    if (!centerId) {
      return NextResponse.json({ error: 'กรุณาระบุ Center ID' }, { status: 400 });
    }

    const popNum = parseInt(population);
    if (isNaN(popNum) || popNum < 0) {
      return NextResponse.json({ error: 'จำนวนคนไม่ถูกต้อง' }, { status: 400 });
    }

    const center = await Center.findById(centerId);
    if (!center) return NextResponse.json({ error: 'ไม่พบศูนย์' }, { status: 404 });

    let newStatus = 'active';
    if (popNum >= center.capacity) {
      newStatus = 'full';
    }

    center.population = popNum;
    center.status = newStatus;
    center.updatedAt = new Date();
    await center.save();

    return NextResponse.json({
      message: 'อัปเดตยอดเรียบร้อยแล้ว',
      center: center.name,
      population: center.population,
      status: center.status,
    });

  } catch (error: any) {
    console.error('Update Population Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
