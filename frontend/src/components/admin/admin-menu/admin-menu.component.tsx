import { MenuBar } from '@sk-web-gui/react';
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
    <MenuBar current={current} data-test="nav-admin-menu">
      <MenuBar.Item wrapper={<Link href="/admin/checklists" legacyBehavior passHref />}>
        <a data-test="nav-admin-menu-introduktioner">{capitalize(t('checklists:name_other'))}</a>
      </MenuBar.Item>
      <MenuBar.Item wrapper={<Link href="/admin/templates" legacyBehavior passHref />}>
        <a data-test="nav-admin-menu-mallar">{capitalize(t('templates:name_other'))}</a>
      </MenuBar.Item>
    </MenuBar>
  );
};
