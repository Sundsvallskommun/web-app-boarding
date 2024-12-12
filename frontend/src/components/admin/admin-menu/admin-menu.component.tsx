import { MenuBar } from '@sk-web-gui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const AdminMenu = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const admin = router.pathname.startsWith('/admin');

  return (
    <MenuBar current={admin ? 1 : 0}>
      <MenuBar.Item wrapper={<Link href="/" legacyBehavior passHref />}>
        <a>{capitalize(t('checklists:name_other'))}</a>
      </MenuBar.Item>
      <MenuBar.Item wrapper={<Link href="/admin" legacyBehavior passHref />}>
        <a>{capitalize(t('templates:name_other'))}</a>
      </MenuBar.Item>
    </MenuBar>
  );
};
