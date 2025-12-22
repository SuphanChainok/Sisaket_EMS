import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.username || !credentials?.password) {
          throw new Error('กรุณากรอกข้อมูลให้ครบ');
        }

        // 1. หา User จาก Database
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          throw new Error('ไม่พบชื่อผู้ใช้งานนี้');
        }

        // 2. เช็ค Password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('รหัสผ่านไม่ถูกต้อง');
        }

        // 3. ส่งข้อมูลกลับไป (Mapping ให้ตรงกับ JWT)
        return { 
          id: user._id.toString(), 
          name: user.name, 
          role: user.role || 'staff' // กันเหนียว: ถ้าไม่มี role ให้เป็น staff
        };
      }
    })
  ],
  callbacks: {
    // 1. เอาข้อมูลจาก User ใส่ลงใน Token
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // 2. เอาข้อมูลจาก Token ใส่ลงใน Session (เพื่อให้ Client ใช้งานได้)
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt', // บังคับใช้ JWT
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret-key-sisaket-ems'
});

export { handler as GET, handler as POST };