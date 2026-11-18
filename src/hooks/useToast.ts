import { createContext, useCallback, useContext } from 'react';

export type Notify = (message: string) => void;

export const ToastContext = createContext<Notify>(() => {});

export function useToast(): Notify {
  return useContext(ToastContext);
}

/** Copies text to the clipboard and reports the result through a toast. */
export function useCopy() {
  const notify = useToast();
  return useCallback(
    async (text: string, label = 'Copied to clipboard') => {
      try {
        await navigator.clipboard.writeText(text);
        notify(label);
      } catch {
        notify(`Couldn't copy. Email: ${text}`);
      }
    },
    [notify],
  );
}
