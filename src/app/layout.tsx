import './globals.css';
import '@/styles/layout.css';
import { Prompt } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import Providers from '@/components/Providers'; // ✅ สำคัญ: ต้อง Import มา

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
        {/* ✅ SessionProvider (Providers) ต้องอยู่ชั้นนอกสุดใน body เสมอ */}
        <Providers>
          <ThemeProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}