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
// app/layout.tsx
export const metadata = {
  title: "FixMyArea",
  description: "Report and resolve local issues",
  icons: {
    icon: "/fixmyarea_favicon_blue.ico",
  },
};


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
