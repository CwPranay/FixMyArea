'use client';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { X, MapPin } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

type SidebarProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  mounted: boolean;
  navLinks: Array<{ name: string; href: string }>;
};

const Sidebar = ({ menuOpen, setMenuOpen, mounted, navLinks }: SidebarProps) => {
  const t = useTranslations('Header');
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-[2000] transition-opacity duration-300 ease-in-out ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 [font-family:var(--font-poppins)] left-0 h-full w-[80%] bg-white z-[2001] transition-transform duration-300 text-black ease-in-out rounded-r ${menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div style={{ boxShadow: '2px 0 10px -5px rgba(0, 0, 0, 0.3)' }} className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <Link href="/" className="flex items-center space-x-1 text-xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 64 64"
                aria-label="FixMyArea logo"
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />  {/* light blue (blue-500) */}
                    <stop offset="100%" stopColor="#60A5FA" /> {/* even lighter (blue-400) */}
                  </linearGradient>
                </defs>

                {/* Pin shape */}
                <path
                  d="M32 8
             C22 8 14 16 14 26
             C14 40 32 56 32 56
             C32 56 50 40 50 26
             C50 16 42 8 32 8z"
                  fill="url(#blueGradient)"
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
              <span>FixMyArea</span>
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
            className="transition-transform duration-200 hover:scale-110 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex shadow-[5px_0_10px_-5px_rgba(0,0,0,0.15)] flex-col h-[100vh] px-6 py-6 z-[2001] space-y-6 text-lg">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`transition-all duration-200 hover:text-cyan-600 hover:translate-x-2 ${mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
                }`}
              style={{
                animationDelay: menuOpen ? `${index * 100}ms` : '0ms',
                animation: menuOpen ? 'slideInFromLeft 0.3s ease-out forwards' : 'none'
              }}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative">
            <LanguageSwitcher />
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
