'use client';

import { useSnackbar } from '@sk-web-gui/react';
import { registerSnackbar } from '@utils/use-snackbar';
import { useEffect } from 'react';

// Loaded with next/dynamic({ ssr: false }) from AppLayout so that the
// @sk-web-gui/snackbar -> toast -> toasted-notes chain is evaluated only after
// hydration (see @utils/use-snackbar for why). Renders nothing.
export const SnackbarBridge = () => {
  const message = useSnackbar();

  useEffect(() => {
    registerSnackbar(message);
  }, [message]);

  return null;
};

export default SnackbarBridge;
