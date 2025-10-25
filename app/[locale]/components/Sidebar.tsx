'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

type SidebarProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  mounted: boolean;
  navLinks: Array<{ name: string; href: string }>;
};

const Sidebar = ({ menuOpen, setMenuOpen, mounted, navLinks }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 [font-family:var(--font-poppins)] left-0 h-full w-[85%] max-w-sm bg-white z-[2001] transition-all duration-500 text-black ease-in-out shadow-2xl ${menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold group" onClick={() => setMenuOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 64 64"
                aria-label="FixMyArea logo"
                className="transform group-hover:scale-110 transition-transform duration-300"
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="sidebarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>

                {/* Pin shape */}
                <path
                  d="M32 8 C22 8 14 16 14 26 C14 40 32 56 32 56 C32 56 50 40 50 26 C50 16 42 8 32 8z"
                  fill="url(#sidebarGradient)"
                />

                {/* White checkmark */}
                <path
                  d="M24 28l6 6 12-12"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-gray-800">FixMyArea</span>
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:rotate-90 group"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <nav className="flex flex-col h-[calc(100vh-80px)] px-6 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${mounted && pathname === link.href
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              style={{
                animationDelay: menuOpen ? `${index * 80}ms` : '0ms',
                animation: menuOpen ? 'slideInFromLeft 0.4s ease-out forwards' : 'none'
              }}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Language</p>
            <div className="px-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Decorative element */}
          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                window.open('https://mail.google.com/mail/?view=cm&fs=1&to=infofixmyarea@gmail.com&su=Support Request from FixMyArea', '_blank');
                setMenuOpen(false);
              }}
              className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 border border-blue-100 transition-all duration-200 text-left"
            >
              <p className="text-sm font-semibold text-gray-800 mb-1">Need Help?</p>
              <p className="text-xs text-gray-600">Contact our support team</p>
            </button>
          </div>
        </nav>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
