import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import MobileSidebarWrapper from './components/MobileSidebarWrapper';

type Props = {
  children: ReactNode;
  params: { locale: 'en' | 'hi' };
};

const messagesMap = {
  en: () => import('../../messages/en.json'),
  hi: () => import('../../messages/hi.json'),
} as const;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } =await params;
  
  const loadMessages = messagesMap[locale];

  if (!loadMessages) {
    return notFound();
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
      <MobileSidebarWrapper>
        {children}
      </MobileSidebarWrapper>
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'hi' }
  ];
}