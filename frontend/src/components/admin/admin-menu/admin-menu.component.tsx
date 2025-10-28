import { NavigationBar } from '@sk-web-gui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const AdminMenu = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const current =
    router.pathname.startsWith('/admin/checklists') ? 0
    : router.pathname.startsWith('/admin/templates') ? 1
    : undefined;

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
