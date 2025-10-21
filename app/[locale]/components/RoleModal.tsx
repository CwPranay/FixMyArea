'use client';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LoadingButton from './LoadingButton';


interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: 'user' | 'authority') => void;
}

export default function RoleModal({ isOpen, onClose, onSelect }: RoleModalProps) {
  if (!isOpen) return null;
  const t = useTranslations('RoleModal');

  return (

    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-6 [font-family:var(--font-poppins)] relative">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">{t('signup')}</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <LoadingButton
            onClick={() => onSelect('user')}
            text=  {t('user')}
            loadingText=  {t('user')}

            className="flex-1 btn-primary-gradient px-5 py-3 btn-primary text-white rounded-lg font-semibold transition"
          />
          
          
          <LoadingButton
            onClick={() => onSelect('authority')}
            text=  {t('authority')}
            loadingText=  {t('authority')}
            className="flex-1 px-5 py-3 btn-secondary-glass text-white rounded-lg font-semibold transition"
          />
           
          
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 hover:scale-110 transition-transform hover:rotate-90 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
