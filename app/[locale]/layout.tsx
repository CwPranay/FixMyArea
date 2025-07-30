import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type Props = {
  children: ReactNode;
  params: { locale: 'en' | 'hi' };
};

const messagesMap = {
  en: () => import('../../messages/en.json'),
  hi: () => import('../../messages/hi.json'),
};

export default async function LocaleLayout({ children, params }: Props) {
  const loadMessages = messagesMap[params.locale];

  if (!loadMessages) {
    notFound();
  }

  const messages = (await loadMessages()).default;

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
