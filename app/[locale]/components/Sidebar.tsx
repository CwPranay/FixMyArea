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
        className={`fixed inset-0 bg-black/70 z-[2000] transition-opacity duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 [font-family:var(--font-poppins)] left-0 h-full w-[80%] bg-white z-[2001] transition-transform duration-300 text-black ease-in-out rounded-r ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div style={{ boxShadow: '2px 0 10px -5px rgba(0, 0, 0, 0.3)' }} className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <MapPin size={20} className="text-cyan-600" />
            <span>{t('title')}</span>
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
              className={`transition-all duration-200 hover:text-cyan-600 hover:translate-x-2 ${
                mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
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
            <LanguageSwitcher/>
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
