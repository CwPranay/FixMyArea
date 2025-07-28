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
    <header className="bg-white text-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm [font-family:var(--font-poppins)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden mr-2"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-semibold text-gray-800"
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
          <Link
            href="/login"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow"
          >
            Login / Signup
          </Link>
        </nav>

        {/* Mobile Login Button */}
        <div className="md:hidden ml-auto hover:shadow-md hover:shadow-cyan-100">
          <Link
            href="/login"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 text-sm rounded-md transition hover:opacity-90 shadow"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu + Backdrop */}
      {menuOpen && (
        <>
          <div className="fixed top-0 left-0 h-full w-[80%] bg-white z-[999] shadow-xl transition-transform duration-300 ease-in-out rounded-r-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-500 shadow-sm">
              <div className="flex items-center space-x-2 text-lg font-semibold">
                <MapPin size={20} className="text-cyan-600" />
                <span>FixMyArea</span>
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close Menu">
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-6 space-y-6 text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition hover:text-cyan-600 ${
                    mounted && pathname === link.href ? 'text-cyan-600 font-medium' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}

             
            </nav>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-[998]"
            onClick={() => setMenuOpen(false)}
          />
        </>
      )}
    </header>
  );
};

export default Header;
