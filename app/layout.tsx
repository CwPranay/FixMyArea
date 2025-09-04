import './globals.css';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';
import ClientProviders from './ClientProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body className="relative">
        <div id="root-content" className="relative z-0">
          <ClientProviders>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
