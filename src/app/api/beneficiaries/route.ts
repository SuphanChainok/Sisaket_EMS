import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Beneficiary from '@/models/Beneficiary';

// GET: ดึงรายชื่อทั้งหมด
export async function GET() {
  await dbConnect();
  try {
    const people = await Beneficiary.find({}).sort({ registeredAt: -1 });
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST: เพิ่มรายชื่อ (รองรับทั้ง เดี่ยว และ Array จากการ Import)
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      // กรณี Import ไฟล์ JSON (มาเป็น Array)
      const newPeople = await Beneficiary.insertMany(body);
      return NextResponse.json({ message: 'Import success', count: newPeople.length });
    } else {
      // กรณีเพิ่มทีละคน (Manual)
      const newPerson = await Beneficiary.create(body);
      return NextResponse.json(newPerson);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}