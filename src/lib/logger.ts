import dbConnect from '@/lib/mongodb';
import Log from '@/models/Log';

export async function createLog(user: string, action: string, description: string) {
  try {
    await dbConnect();
    await Log.create({
      user,
      action,
      description,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Logger Error:", error);
    // ไม่ต้อง Throw error เพราะเราไม่อยากให้ Log พังแล้วระบบหลักพังไปด้วย
  }
}