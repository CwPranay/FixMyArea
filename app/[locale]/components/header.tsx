"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, MapPin, LogOut, User, Settings } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingButton from './LoadingButton';

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

  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
};

export default function Header({
  menuOpen,
  setMenuOpen,
  mounted,
  navLinks,

  onLogout,
  onLoginClick,
  onSignupClick
}: HeaderProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const locale = useLocale();
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setShowDropdown(false);
    setLogoutLoading(true);
    await logout();
    router.refresh();
    router.push("/");
    setLogoutLoading(false);
  };
  useEffect(() => {
    // Whenever pathname changes, reset all loading states
    setLoginLoading(false);
    setSignupLoading(false);
    setLogoutLoading(false);
  }, [pathname]);


  const handleLoginClick = async () => {
    setLoginLoading(true);
    await onLoginClick(); // this should push to login
    // No need to manually set false; useEffect on pathname handles it
  };


  const handleSignupClick = () => {
    setSignupLoading(true);
    setTimeout(() => {
      onSignupClick();
      setSignupLoading(false);
    }, 300);
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

    <header className="bg-white/90 [font-family:var(--font-poppins)] sticky top-0 navbar backdrop-blur-xl text-gray-900 w-full z-[1999] shadow-xl border-b border-blue-100/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">

        {/* Hamburger */}
        {user?.role !== 'admin' ?
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden mr-2 p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Open Menu"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          : null}

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2 text-xl font-bold group cursor-pointer">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 64 64"
              aria-label="FixMyArea logo"
              className="transform group-hover:scale-110 transition-transform duration-300"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>

              {/* Pin shape */}
              <path
                d="M32 8 C22 8 14 16 14 26 C14 40 32 56 32 56 C32 56 50 40 50 26 C50 16 42 8 32 8z"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
            FixMyArea
          </span>
        </Link>

        {/* Desktop Nav */}
        {(!user || user.role === "user" || user.role === "authority") && (
          <nav className="hidden md:flex space-x-8 items-center ml-auto">

            {navLinks.map((link) => (

              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 font-medium transition-all duration-300 ${
                  pathname === link.href 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
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
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate mt-0.5">
                            {t(`profile.${user.role}Role`)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          router.push(`/${locale}/profile-settings`);
                        }}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center space-x-3 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                          <Settings className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium">{t('profile.settings')}</span>
                      </button>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">{t('profile.signOut')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3 ml-3">
                <LoadingButton
                  onClick={handleLoginClick}
                  text={t('login')}
                  loadingText={t('login')}
                  className="btn-primary-gradient text-white px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 font-semibold"
                />


                <button
                  onClick={onSignupClick}
                  className="btn-secondary-glass px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-semibold"
                >
                  {t('sign up')}
                </button>
              </div>
            )}
          </nav>
        )}
        {user?.role === "admin" && (
          <nav className="hidden md:flex space-x-8 items-center ml-auto">
            <nav>Admin</nav>


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
                          router.push(`/admin/dashboard`);
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
                <LoadingButton
                  onClick={handleLoginClick}
                  text={t('login')}
                  loadingText={t('login')}
                  className="btn-primary-gradient text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow"
                />
                <button
                  onClick={onSignupClick}
                  className="btn-secondary-glass px-4 py-2 rounded-md transition hover:opacity-90 shadow"
                >
                  {t('sign up')}
                </button>
              </div>
            )}
          </nav>


        )}

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
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push(`/${locale}/profile-settings`);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('profile.settings')}
                  </button>

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
            <LoadingButton
                  onClick={handleLoginClick}
                  text={t('login')}
                  loadingText={t('login')}
                  className="btn-primary-gradient text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow"
                />
          )}
        </div>
      </div>
    </header>
  );
};