'use client';

import { NavigationBar } from '@sk-web-gui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const AdminMenu = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  let current: number | undefined;
  if (pathname?.startsWith('/admin/checklists')) {
    current = 0;
  } else if (pathname?.startsWith('/admin/templates')) {
    current = 1;
  }

  return (
    <NavigationBar current={current} data-cy="nav-admin-menu">
      <NavigationBar.Item>
        <Link href="/admin/checklists" data-cy="nav-admin-menu-introduktioner">
          {capitalize(t('checklists:name_other'))}
        </Link>
      </NavigationBar.Item>
      <NavigationBar.Item>
        <Link href="/admin/templates" data-cy="nav-admin-menu-mallar">
          {capitalize(t('templates:name_other'))}
        </Link>
      </NavigationBar.Item>
    </NavigationBar>
  );
};
