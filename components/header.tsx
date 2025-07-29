'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Report Issue', href: '/report' },
    { name: 'My Reports', href: '/my-reports' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll and listen for Escape key
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="bg-white/80 navbar backdrop-blur-lg text-gray-900 fixed top-0 left-0 w-full z-50 shadow-lg border-b border-white/20 [font-family:var(--font-poppins)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden mr-2 transition-transform duration-200 hover:scale-110"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-1 text-xl font-semibold text-gray-800"
        >
          <MapPin size={22} className="text-cyan-600" />
          <span>FixMyArea</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition hover:text-cyan-600 ${
                mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className='flex space-x-4 ml-3'>
            <Link
            href="/login"
            className="btn-primary-gradient text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow"
          >
            Log in 
          </Link>
          <Link
            href="/login"
            className="btn-secondary-glass  px-4 py-2 rounded-md transition hover:opacity-90 shadow"
          >
            Sign up 
          </Link>
          </div>
        </nav>

        {/* Mobile Login Button */}
        <div className="md:hidden ml-auto hover:shadow-md hover:shadow-cyan-100">
          <Link
            href="/login"
            className="btn-primary-gradient text-white px-3 py-1.5 text-sm rounded-md transition hover:opacity-90 shadow"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu + Backdrop */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-[998]  transition-opacity duration-300 ease-in-out ${
            menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0  h-full w-[80%] bg-white z-[999] transition-transform duration-300 ease-in-out rounded-r ${
            menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
          }`}
        >
          <div style={{ boxShadow: '2px 0 10px -5px rgba(0, 0, 0, 0.3)' }}  className="flex items-center   justify-between px-6 py-4  ">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <MapPin size={20} className="text-cyan-600" />
              <span>FixMyArea</span>
            </div>
            <button 
              onClick={() => setMenuOpen(false)} 
              aria-label="Close Menu"
              className="transition-transform duration-200 hover:scale-110 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col h-[100vh] shadow-lg border-gray-400 px-6 py-6 space-y-6 text-lg">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`transition-all duration-200 hover:text-cyan-600 hover:translate-x-2 ${
                  mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
                }`}
                style={{
                  animationDelay: menuOpen ? `${index * 100}ms` : '0ms',
                  animation: menuOpen ? 'slideInFromLeft 0.3s ease-out forwards' : 'none'
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;