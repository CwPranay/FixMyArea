import './globals.css';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>; // Fixed: removed duplicate "params:"
}) {
  // Await params before accessing properties
  const { locale } = await params;
  
  return (
    <html lang={locale} className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}