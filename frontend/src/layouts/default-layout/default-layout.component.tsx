import { useChecklist } from '@services/checklist-service/use-checklist';
import { useUserStore } from '@services/user-service/user-service';
import Breadcrumb from '@sk-web-gui/breadcrumb';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Header, Link } from '@sk-web-gui/react';
import { UserMenu } from '@sk-web-gui/user-menu';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';

interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  postTitle?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  logoLinkHref?: string;
}

export default function DefaultLayout({
  title,
  postTitle,
  headerTitle,
  headerSubtitle,
  children,
  preContent = undefined,
  postContent = undefined,
  logoLinkHref = '/',
}: DefaultLayoutProps) {
  const router = useRouter();
  const layoutTitle = `${process.env.NEXT_PUBLIC_APP_NAME}${headerSubtitle ? ` - ${headerSubtitle}` : ''}`;
  const fullTitle = postTitle ? `${layoutTitle} - ${postTitle}` : `${layoutTitle}`;
  const pathname = usePathname();
  const user = useUserStore((s) => s.user, shallow);

  const { t } = useTranslation();

  /*const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement.focus();
  };*/

  const handleLogoClick = () => {
    router.push(logoLinkHref);
  };

  const { data } = useChecklist();

  return (
    <div className="DefaultLayout full-page-layout bg-background-100">
      <Head>
        <title>{title ? title : fullTitle}</title>
        <meta name="description" content={`${process.env.NEXT_PUBLIC_APP_NAME}`} />
      </Head>

      {/*<NextLink href="#content" legacyBehavior passHref>
        <a onClick={setFocusToMain} accessKey="s" className="next-link-a" data-cy="systemMessage-a">
          {t('layout:header.goto_content')}
        </a>
      </NextLink>*/}

      <div>
        <Header
          data-cy="nav-header"
          title={headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME}
          subtitle={headerSubtitle ? headerSubtitle : 'Sundsvalls kommun'}
          aria-label={`${headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME} ${headerSubtitle}`}
          logoLinkOnClick={handleLogoClick}
          LogoLinkWrapperComponent={<NextLink legacyBehavior href={logoLinkHref} passHref />}
          wrapperClasses="py-6"
        >
          <UserMenu
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
        </Header>

        <div className="main-container flex-grow relative w-full flex flex-col pt-20">
          {pathname !== '/' && user.permissions.isManager ?
            <div className="w-full md:px-32">
              <Breadcrumb className="container ">
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="../">Start</Breadcrumb.Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link href="#">
                    {data?.employee?.firstName} {data?.employee?.lastName}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          : null}
        </div>
      </div>

      {preContent && preContent}

      <div className={`main-container flex-grow relative w-full flex flex-col`}>
        <div className="main-content-padding">{children}</div>
      </div>

      {postContent && postContent}

      {/*<CookieConsent
        title={t('layout:cookies.title', { app: process.env.NEXT_PUBLIC_APP_NAME })}
        body={
          <p>
            {t('layout:cookies.description')}{' '}
            <NextLink href="/kakor" passHref legacyBehavior>
              <Link>{t('layout:cookies.read_more')}</Link>
            </NextLink>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: t('layout:cookies.necessary.displayName'),
            description: t('layout:cookies.necessary.description'),
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: t('layout:cookies.func.displayName'),
            description: t('layout:cookies.func.description'),
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: t('layout:cookies.stats.displayName'),
            description: t('layout:cookies.stats.description'),
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // FIXME: do stuff with cookies?
          // NO ANO FUNCTIONS
        }}
      />*/}
    </div>
  );
}
