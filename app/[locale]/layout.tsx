import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: 'en' | 'hi' }>; // Changed to Promise
};

const messagesMap = {
  en: () => import('../../messages/en.json'),
  hi: () => import('../../messages/hi.json'),
} as const;

export default async function LocaleLayout({ children, params }: Props) {
  // Await params before accessing its properties
  const { locale } = await params;
  
  const loadMessages = messagesMap[locale];

  if (!loadMessages) {
    return notFound(); // ✅ this prevents continuing
  }

  let messages;
  try {
    messages = (await loadMessages()).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// Optional: Generate static params for better performance
export async function generateStaticParams() {
  return [
    { locale: 'en' as const },
    { locale: 'hi' as const }
  ];
}