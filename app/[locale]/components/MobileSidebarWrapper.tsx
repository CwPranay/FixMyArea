'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Header from './header';
import Sidebar from './Sidebar';

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

  return (
    <div className="relative isolate">
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        mounted={mounted}
        navLinks={navLinks}
      />
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
