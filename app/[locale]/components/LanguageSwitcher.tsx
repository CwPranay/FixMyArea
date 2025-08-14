'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 128 + window.scrollX // 128px is dropdown width (w-32)
      });
    }
    setIsOpen(!isOpen);
  };

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname?.replace(`/${locale}`, '') ?? '';

    const newPath = `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const dropdownElement = document.getElementById('language-dropdown');
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Update position on scroll/resize
    const handlePositionUpdate = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right - 128 + window.scrollX
        });
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', handlePositionUpdate);
      window.addEventListener('resize', handlePositionUpdate);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('scroll', handlePositionUpdate);
        window.removeEventListener('resize', handlePositionUpdate);
      };
    }
  }, [isOpen]);

  const dropdownContent = isOpen && mounted ? (
    <div
      id="language-dropdown"
      className="fixed bg-white left-[50px] md:left-[700px] lg:left-[900px] lg:top-[59px] rounded-md shadow-lg border border-gray-200 overflow-hidden w-32 z-[10000]"
      style={{
        top: `${dropdownPosition.top}px`,

      }}
    >
      <button
        onClick={() => switchLocale('en')}
        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${locale === 'en'
            ? 'bg-cyan-50 text-cyan-700 font-medium cursor-default'
            : 'hover:bg-gray-50 text-gray-700 focus:bg-gray-50'
          }`}
        disabled={locale === 'en'}
        type="button"
      >
        English
      </button>
      <button
        onClick={() => switchLocale('hi')}
        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${locale === 'hi'
            ? 'bg-cyan-50 text-cyan-700 font-medium cursor-default'
            : 'hover:bg-gray-50 text-gray-700 focus:bg-gray-50'
          }`}
        disabled={locale === 'hi'}
        type="button"
      >
        हिंदी
      </button>
    </div>
  ) : null;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 hover:text-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 rounded-md px-3 py-2 border border-gray-200 bg-white shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Change language"
        type="button"
      >
        <Globe size={18} />
        <span className="text-sm font-medium min-w-[24px]">{locale === 'en' ? 'EN' : 'हिं'}</span>
      </button>

      {isOpen && (
        <div
          id="language-dropdown"
          className="absolute left-4 right-0 mt-2 w-32 rounded-md shadow-lg border border-gray-200 bg-white z-50"
        >
          <button
            onClick={() => switchLocale('en')}
            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${locale === 'en'
                ? 'bg-cyan-50 text-cyan-700 font-medium cursor-default'
                : 'hover:bg-gray-50 text-gray-700 focus:bg-gray-50'
              }`}
            disabled={locale === 'en'}
          >
            English
          </button>
          <button
            onClick={() => switchLocale('hi')}
            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${locale === 'hi'
                ? 'bg-cyan-50 text-cyan-700 font-medium cursor-default'
                : 'hover:bg-gray-50 text-gray-700 focus:bg-gray-50'
              }`}
            disabled={locale === 'hi'}
          >
            हिंदी
          </button>
        </div>
      )}
    </div>
  );

}