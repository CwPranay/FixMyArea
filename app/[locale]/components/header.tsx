'use client';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, MapPin } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  mounted: boolean;
  navLinks: Array<{ name: string; href: string }>;
  onLoginClick: () => void;
  onSignupClick: () => void;
};

const Header = ({
  menuOpen,
  setMenuOpen,
  mounted,
  navLinks,
  onLoginClick,
  onSignupClick
}: HeaderProps) => {
  const t = useTranslations('Header');
  const pathname = usePathname();

  return (
    <header className="bg-white/80 sticky top-0 navbar backdrop-blur-lg text-gray-900 w-full z-[1999] shadow-lg border-b border-white/20 [font-family:var(--font-poppins)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden mr-2 transition-transform duration-200 hover:scale-110"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1 text-xl font-semibold text-gray-800">
          <MapPin size={22} className="text-cyan-600" />
          <span>{t('title')}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-cyan-600 ${mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative">
            <LanguageSwitcher />
          </div>
          <div className="flex space-x-4 ml-3">
            <button
              onClick={onLoginClick}
              className="btn-primary-gradient text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow"
            >
              {t('login')}
            </button>
            <button
              onClick={onSignupClick}
              className="btn-secondary-glass px-4 py-2 rounded-md transition hover:opacity-90 shadow"
            >
              {t('sign up')}
            </button>
          </div>
        </nav>

        {/* Mobile Login */}
        <div className="md:hidden flex gap-2 ml-auto hover:shadow-md hover:shadow-cyan-100">
          <button
            onClick={onLoginClick}
            className="btn-primary-gradient text-white px-3 py-1.5 text-sm rounded-md transition hover:opacity-90 shadow"
          >
            {t('login')}
          </button>
          <button
            onClick={onSignupClick}
            className="btn-secondary-glass px-3 py-1.5 rounded-md transition text-sm hover:opacity-90 shadow"
          >
            {t('sign up')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
