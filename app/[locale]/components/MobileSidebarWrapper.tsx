'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Header from './header';
import Sidebar from './Sidebar';
import LoginRoleModal from '../Modals/LoginRoleModals';

type MobileSidebarWrapperProps = {
  children: ReactNode;
};

export default function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('reportIssue'), href: '/report' },
    { name: t('myRequests'), href: '/my-reports' }
  ];

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

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <div className="relative isolate">

      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mounted={mounted}
        navLinks={navLinks}
        onLoginClick={() => setLoginModalOpen(true)}
        onSignupClick={() => setSignupModalOpen(true)}
      />
      <div className='z-[999]'>
        <LoginRoleModal 
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSelect={(role) => {
          setLoginModalOpen(false);
          // redirect or show login form
        }}
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
