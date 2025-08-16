"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, MapPin, LogOut, User, Settings } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect, useRef } from 'react';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'authority' | 'admin';
};

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  mounted: boolean;
  navLinks: Array<{ name: string; href: string }>;
  isAuthenticated: boolean;
  user: UserData | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
};

export default function Header({
  menuOpen,
  setMenuOpen,
  mounted,
  navLinks,
  isAuthenticated,
  user,
  onLogout,
  onLoginClick,
  onSignupClick
}: HeaderProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'authority': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <header className="bg-white/80 sticky top-0 navbar backdrop-blur-lg text-gray-900 w-full z-[1999] shadow-lg border-b border-white/20">
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
          <span>FixMyArea</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-cyan-600 ${
                mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative">
            <LanguageSwitcher />
          </div>

          {/* Desktop Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user.name)}
                </div>
                
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {t(`profile.${user.role}Role`)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push(`/`);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span className="text-gray-400">⚙️</span>
                      <span>{t('profile.settings')}</span>
                    </button>

                    

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <span className="text-red-500">🚪</span>
                      <span>{t('profile.signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </nav>

        {/* Mobile Auth Section */}
        <div className="md:hidden flex ml-auto">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
              >
                {getInitials(user.name)}
              </button>

              {/* Mobile Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    {t('profile.settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                   {t('profile.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="btn-primary-gradient text-white px-3 py-1.5 text-sm rounded-md transition hover:opacity-90 shadow"
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};