'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Header from './header';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import RoleModal from './RoleModal';
import { useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext'; // Use centralized auth

type MobileSidebarWrapperProps = {
  children: ReactNode;
};

export default function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  // Use centralized auth context
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);

    // Lock scroll when mobile menu is open
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout(); // Clears context state and triggers re-render
    setMenuOpen(false); // Close menu if open
    router.push('/');   // Optional: redirect home
  };

  const handleSignupRoleSelect = (role: 'user' | 'authority') => {
    setSignupModalOpen(false);
    router.push(`/${locale}/signup?role=${role}`);
  };

  const navLinks = [
    { name: t('home'), href: '/' },
    ...(!user || user?.role==="user" ?[{ name: t('reportIssue'), href: '/report-issue' }]:[]),
    { name: t('viewAllIssue'), href: '/my-reports' }
  ];

  return (
    <div className="relative isolate">
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mounted={mounted}
        navLinks={navLinks}
        onLogout={handleLogout}
        onLoginClick={() => router.push(`/${locale}/login`)}
        onSignupClick={() => setSignupModalOpen(true)}
      />

      <RoleModal
        isOpen={isSignupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSelect={handleSignupRoleSelect}
      />

      {user?.role !== 'admin' && (
        <Sidebar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          mounted={mounted}
          navLinks={navLinks}
        />
      )}

      <main className="relative">{children}</main>
    </div>
  );
}
