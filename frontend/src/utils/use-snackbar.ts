'use client';

import type { useSnackbar as GuiUseSnackbar } from '@sk-web-gui/react';
import { useCallback } from 'react';

type MessageFn = ReturnType<typeof GuiUseSnackbar>;
type MessageOptions = Parameters<MessageFn>[0];

// TEMPORARY workaround: @sk-web-gui/toasted-notes calls createRoot() when its
// module is evaluated. If that happens before Next hydrates the document, react-dom
// skips attaching its event listeners and the whole page becomes non-interactive.
// This facade keeps the snackbar/toast chain out of the initial client bundle;
// SnackbarBridge (loaded after hydration) registers the real message function here.
// Remove once @sk-web-gui/toasted-notes creates its root lazily.
let realMessage: MessageFn | null = null;
const queued: MessageOptions[] = [];

export const registerSnackbar = (fn: MessageFn) => {
  realMessage = fn;
  queued.splice(0).forEach((options) => fn(options));
};

export const useSnackbar = (): MessageFn =>
  useCallback((options: MessageOptions) => {
    if (realMessage) {
      return realMessage(options);
    }
    queued.push(options);
  }, []);

export default useSnackbar;
