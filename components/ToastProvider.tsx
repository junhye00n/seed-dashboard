"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, X } from "lucide-react";

type Toast = { id: number; message: string };
type ToastCtx = { show: (msg: string) => void };

const Ctx = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(Ctx);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-right-4"
          >
            <CheckCircle size={16} className="text-green-400 dark:text-green-600 flex-shrink-0" />
            {t.message}
            <button onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}>
              <X size={14} className="opacity-60" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
