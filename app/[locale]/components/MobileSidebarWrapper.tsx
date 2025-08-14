'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Header from './header';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import RoleModal from './RoleModal';
import { useLocale } from 'next-intl';

type MobileSidebarWrapperProps = {
  children: ReactNode;
};

export default function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const locale = useLocale();

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
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);



  return (
    <div className="relative isolate">

      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mounted={mounted}
        navLinks={navLinks}
        onLoginClick={() => router.push('/login')} // Direct login
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
