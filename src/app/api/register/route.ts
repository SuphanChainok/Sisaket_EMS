import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, password, name, role } = await req.json();

    // เข้ารหัสรหัสผ่านก่อนเก็บ
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      name,
      role: role || 'staff'
    });

    return NextResponse.json({ message: 'User created', user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}