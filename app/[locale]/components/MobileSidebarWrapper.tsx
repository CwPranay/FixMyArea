'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Header from './header';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import RoleModal from './RoleModal';
import { useLocale } from 'next-intl';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'authority' | 'admin';
};

type MobileSidebarWrapperProps = {
  children: ReactNode;
};

export default function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      setUser({
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('reportIssue'), href: '/report' },
    { name: t('myRequests'), href: '/my-reports' }
  ];
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const handleSignupRoleSelect = (role: 'user' | 'authority') => {
    setSignupModalOpen(false);
    router.push(`/${locale}/signup?role=${role}`);
  };

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  return (
    <div className="relative isolate">
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mounted={mounted}
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => router.push(`/${locale}/login`)} // Direct login
        onSignupClick={() => setSignupModalOpen(true)}
      />
      <div className='z-[999]'>
        <RoleModal
          isOpen={isSignupModalOpen}
          onClose={() => setSignupModalOpen(false)}
          onSelect={handleSignupRoleSelect}
        />
      </div>

      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mounted={mounted}
        navLinks={navLinks}
      />
      <main className="relative">{children}</main>
    </div>
  );
}
