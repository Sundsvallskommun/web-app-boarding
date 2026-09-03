'use client';

import 'dayjs/locale/sv';

import { AppWrapper } from '@contexts/app.context';
import LoginGuard from '@components/login-guard/login-guard';
import { ConfirmationDialogContextProvider, GuiProvider } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import dynamic from 'next/dynamic';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerNavigator } from '@services/api-service';

// ssr: false defers the snackbar/toast chain until after hydration; it must not
// be in the initial client bundle (see @utils/use-snackbar).
const SnackbarBridge = dynamic(() => import('@components/snackbar-bridge/snackbar-bridge'), { ssr: false });

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayoutComponent = ({ children }: AppLayoutProps) => {
  const router = useRouter();
  useEffect(() => {
    registerNavigator((path) => router.push(path));
  }, [router]);

  return (
    <GuiProvider>
      <SnackbarBridge />
      <ConfirmationDialogContextProvider>
        <AppWrapper>
          <LoginGuard>{children}</LoginGuard>
        </AppWrapper>
      </ConfirmationDialogContextProvider>
    </GuiProvider>
  );
};

export default AppLayoutComponent;
