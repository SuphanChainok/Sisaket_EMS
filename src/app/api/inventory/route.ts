import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET() {
  try {
    await dbConnect();
    const items = await Inventory.find({}).sort({ category: 1, name: 1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ตรวจสอบสิทธิ์ก่อนทำอะไรทั้งสิ้น
  // NOTE: client must include cookies when calling this API (fetch with `credentials: 'include'` or axios `withCredentials: true`).

  // Inspect incoming cookie header for debugging
  const cookieHeader = req.headers.get('cookie');
  const origin = req.headers.get('origin') || req.headers.get('referer') || 'unknown';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('inventory POST incoming cookies:', cookieHeader);
    // eslint-disable-next-line no-console
    console.debug('inventory POST origin:', origin);
  }

  if (!cookieHeader) {
    return NextResponse.json({ error: '⛔ ไม่มี cookie header ในคำขอ — ตรวจสอบว่า client เรียก API พร้อม cookies (fetch(..., { credentials: "include" }) หรือ axios withCredentials: true)' }, { status: 403 });
  }

  // Explicitly pass the NEXTAUTH_SECRET to ensure token can be decoded
  const secret = process.env.NEXTAUTH_SECRET || 'secret-key-sisaket-ems';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('NEXTAUTH_SECRET present (masked):', Boolean(process.env.NEXTAUTH_SECRET));
  }

  let token = null;
  try {
    token = await getToken({ req: req as unknown as NextRequest, secret });
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('getToken threw error:', err?.message || err);
    }
  }

  // Helpful debug info in development
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('inventory POST token:', JSON.stringify(token));
  }

  if (!token) {
    return NextResponse.json({ error: '⛔ ไม่มี token (cookies ถูกส่งมา แต่ session อาจหมดอายุหรือ NEXTAUTH_SECRET ผิดค่าหรือขาดหาย)' }, { status: 403 });
  }

  if (token.role !== 'admin') {
    return NextResponse.json({ error: '⛔ ไม่มีสิทธิ์ (ต้องเป็น Admin)' }, { status: 403 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    // Update stock ถ้ามี _id
    if (body._id) {
      const { _id, quantity } = body;
      const updatedItem = await Inventory.findByIdAndUpdate(
        _id,
        { quantity },
        { new: true }
      );
      return NextResponse.json(updatedItem);
    }

    // Create new item
    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและหมวดหมู่' }, { status: 400 });
    }

    const newItem = await Inventory.create({
      name: body.name,
      category: body.category,
      quantity: body.quantity || 0,
      unit: body.unit || 'ชิ้น',
      minLevel: body.minLevel || 10,
      location: body.location || '-'
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}