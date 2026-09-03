import LocalizationProvider from '@components/localization-provider/localization-provider';
import { ReactNode } from 'react';

import initLocalization from '../i18n';
import i18nConfig from '../i18nConfig';

export const generateStaticParams = () => i18nConfig.locales.map((locale) => ({ locale }));
export const dynamicParams = false;
interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const namespaces = [
  'common',
  'layout',
  'login',
  'crud',
  'checklists',
  'delegation',
  'task',
  'mentor',
  'user',
  'admin',
  'templates',
];

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;
  const { resources } = await initLocalization(locale, namespaces);

  return <LocalizationProvider {...{ locale, resources, namespaces }}>{children}</LocalizationProvider>;
};

export default LocaleLayout;
