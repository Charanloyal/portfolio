import { useCallback, useRef, useState, type ReactNode } from 'react';
import { CheckIcon } from './Icons.tsx';
import { ToastContext, type Notify } from '../hooks/useToast.ts';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback<Notify>((text) => {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {message && (
          <div className="toast glass">
            <CheckIcon size={16} />
            <span>{message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
