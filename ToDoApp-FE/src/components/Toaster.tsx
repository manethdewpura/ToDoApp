import { useEffect, useState } from 'react';
import { toast, type ToastMessage } from '../utils/toast';

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((t) => {
      setToasts((prev) => [...prev, t]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.durationMs);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute top-4 right-4 flex flex-col gap-3 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'pointer-events-auto rounded-lg shadow-lg p-4 text-sm border',
              t.type === 'success' && 'bg-green-50 border-green-200 text-green-900',
              t.type === 'error' && 'bg-red-50 border-red-200 text-red-900',
              t.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-900',
              t.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-900',
            ]
              .filter(Boolean)
              .join(' ')}
            role="status"
            aria-live="polite"
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}


