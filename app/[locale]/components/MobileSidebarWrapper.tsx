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

  useEffect(() => {
    setMounted(true);
    
    // Initial auth check
    checkAuthStatus();

    // Define the handler
    const handleAuthChange = (event: Event) => {
      console.log('Auth change detected');  // Debug log
      checkAuthStatus();
    };

    // Add both event listeners
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    // Cleanup function
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Update checkAuthStatus to include console logs
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    console.log('Checking auth status, token:', token ? 'exists' : 'none');
    
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
      console.log('Auth status updated, user:', payload.name);
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('reportIssue'), href: '/report' },
    { name: t('viewAllIssue'), href: '/my-reports' }
  ];
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const handleSignupRoleSelect = (role: 'user' | 'authority') => {
    setSignupModalOpen(false);
    router.push(`/${locale}/signup?role=${role}`);
  };

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
