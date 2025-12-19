import './globals.css';
import '@/styles/layout.css';
import { Prompt } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext'; // ✅ 1. เรียกใช้ Context ที่เราสร้าง

// ตั้งค่าฟอนต์ Prompt
const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Sisaket EMS',
  description: 'ระบบบริหารจัดการศูนย์พักพิงจังหวัดศรีสะเกษ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        {/* ✅ 2. ครอบทั้งเว็บด้วย ThemeProvider */}
        <ThemeProvider>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {/* เนื้อหาหลัก */}
              <div style={{ minHeight: '80vh' }}>
                {children}
              </div>
              
              {/* Footer */}
              <Footer />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}