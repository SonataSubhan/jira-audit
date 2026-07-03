import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import LanguageProvider from '@/lib/LanguageProvider';
import { AuditStateProvider } from '@/lib/AuditStateProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Kibertəhlükəsizlik Uyğunluq Auditi Paneli',
  description: 'NIST CSF 2.0 və ISO/IEC 27001 Uyğunluq Audit Sistemi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="az" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}>
        <LanguageProvider>
          <AuditStateProvider>
            {children}
          </AuditStateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
