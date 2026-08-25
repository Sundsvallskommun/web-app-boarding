'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, FormErrorMessage } from '@sk-web-gui/react';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { appURL } from '@utils/app-url';
import { useTranslation } from 'react-i18next';

export default function Start() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const isLoggedOut = searchParams?.has('loggedout') ?? false;
  const failMessage = searchParams?.get('failMessage');
  const autoLogin = true;

  const initialFocus = useRef<HTMLButtonElement>(null);
  const setInitialFocus = () => {
    setTimeout(() => {
      if (initialFocus.current) initialFocus.current.focus();
    });
  };

  const onLogin = () => {
    const path = searchParams?.get('path') || '';
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/saml/login`);
    url.searchParams.set('successRedirect', `${appURL()}${path}`);
    window.location.assign(url.toString());
  };

  useEffect(() => {
    setInitialFocus();
    setTimeout(() => setMounted(true), 500);
    if (isLoggedOut) {
      window.history.replaceState(null, '', '/login');
    } else {
      if (!failMessage && autoLogin) {
        onLogin();
      } else if (failMessage) {
        setErrorMessage(t(`login:errors.${failMessage}`));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted && !failMessage) {
    return <LoaderFullScreen />;
  }

  return (
    <EmptyLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Logga In`}>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col text-light-primary bg-inverted-background-content p-20 shadow-lg text-left">
            <div className="mb-14">
              <h1 className="mb-10 text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
              <p className="my-0">{t('login:description')}</p>
            </div>

            <Button inverted onClick={() => onLogin()} ref={initialFocus} data-cy="loginButton">
              {t('common:login')}
            </Button>

            {errorMessage && <FormErrorMessage className="mt-lg">{errorMessage}</FormErrorMessage>}
          </div>
        </div>
      </main>
    </EmptyLayout>
  );
}
