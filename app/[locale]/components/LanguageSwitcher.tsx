'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname?.replace(`/${locale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Get display text for current locale
  const getLocaleDisplayText = () => {
    switch (locale) {
      case 'en': return 'EN';
      case 'hi': return 'हिं';
      case 'mr': return 'म';
      default: return 'EN';
    }
  };

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
        <span className="text-sm font-medium min-w-[24px]">{getLocaleDisplayText()}</span>
      </button>
      
      {isOpen && mounted && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50 w-full"
        >
          <button
            onClick={() => switchLocale('en')}
            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
              locale === 'en'
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
            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
              locale === 'hi'
                ? 'bg-cyan-50 text-cyan-700 font-medium cursor-default'
                : 'hover:bg-gray-50 text-gray-700 focus:bg-gray-50'
            }`}
            disabled={locale === 'hi'}
            type="button"
          >
            हिंदी
          </button>
          <button
            onClick={() => switchLocale('mr')}
            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
              locale === 'mr'
                ? 'bg-cyan-50 text-cyan-700 font-medium cursor-default'
                : 'hover:bg-gray-50 text-gray-700 focus:bg-gray-50'
            }`}
            disabled={locale === 'mr'}
            type="button"
          >
            मराठी
          </button>
        </div>
      )}
    </div>
  );
}