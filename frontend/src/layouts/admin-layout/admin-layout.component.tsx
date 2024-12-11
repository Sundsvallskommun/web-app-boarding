import AdminSidebar from '@components/admin/admin-sidebar/admin-sidebar.component';
import Main from '@layouts/main/main.component';
import Head from 'next/head';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import NextLink from 'next/link';
import { UserMenu } from '@sk-web-gui/user-menu';
import { Button, Header, Link, MenuBar } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import Divider from '@sk-web-gui/divider';

export default function AdminLayoutComponent({
  title,
  children,
  current,
  setCurrent,
}: {
  title: string;
  children: ReactNode;
  current: number;
  setCurrent: Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();
  const user = useUserStore((s) => s.user, shallow);
  const { t } = useTranslation();

  const handleLogoClick = () => {
    router.push('/admin');
  };

  return (
    <div className="DefaultLayout full-page-layout bg-background-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${process.env.NEXT_PUBLIC_APP_NAME}`} />
      </Head>

      <Header
        className="flex"
        data-cy="nav-header"
        title={title ? title : process.env.NEXT_PUBLIC_APP_NAME}
        subtitle={'Sundsvalls kommun'}
        aria-label={`${process.env.NEXT_PUBLIC_APP_NAME}`}
        logoLinkOnClick={handleLogoClick}
        LogoLinkWrapperComponent={<NextLink legacyBehavior href={'/admin'} passHref />}
        wrapperClasses="py-6"
      >
        <div className="flex">
          <MenuBar current={current}>
            <MenuBar.Item>
              <button onClick={() => setCurrent(0)}>{capitalize(t('common:introduction_other'))}</button>
            </MenuBar.Item>
            <MenuBar.Item>
              <Button onClick={() => setCurrent(1)}>Mallar</Button>
            </MenuBar.Item>
          </MenuBar>

          <Divider orientation="vertical" className="mx-24" />

          <UserMenu
            className="ml-16"
            initials={`${user.firstName[0]}${user.lastName[0]}`}
            menuTitle={`${user.name} (${user.username})`}
            menuGroups={[
              {
                label: 'Logga ut',
                elements: [
                  {
                    label: 'Logga ut',
                    element: () => (
                      <Link key={'logout'} href={`/logout`}>
                        <Icon name="log-out" /> Logga ut
                      </Link>
                    ),
                  },
                ],
              },
            ]}
          />
          <div className="pl-16 pt-4">
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            <p className="m-0 text-small">Befattning</p>
          </div>
        </div>
      </Header>

      <div className="main-container w-full flex">
        {current === 1 && <AdminSidebar />}
        <Main className="w-full p-40">{children}</Main>
      </div>
    </div>
  );
}
