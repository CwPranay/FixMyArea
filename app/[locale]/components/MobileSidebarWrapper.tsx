'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Header from './header';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import RoleModal from '../Modals/RoleModal';

type MobileSidebarWrapperProps = {
  children: ReactNode;
};

export default function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('reportIssue'), href: '/report' },
    { name: t('myRequests'), href: '/my-reports' }
  ];
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const handleRoleSelect = (role: 'user' | 'authority') => {
    setModalType(null);
    if (modalType === 'login') {
      router.push(`/login/${role}`);
    } else if (modalType === 'signup') {
      router.push(`/signup/${role}`);
    }
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
        onLoginClick={() => setModalType('login')}
        onSignupClick={() => setModalType('signup')}
      />
      <div className='z-[999]'>
        <RoleModal
           isOpen={modalType !== null}
        type={modalType || 'login'}
        onClose={() => setModalType(null)}
        onSelect={handleRoleSelect}
          
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
