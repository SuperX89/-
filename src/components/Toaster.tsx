"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Toast = { id: number; msg: string; kind: "success" | "error" | "info" };

const ToastCtx = createContext<(msg: string, kind?: Toast["kind"]) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((msg: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none px-4 w-full max-w-sm"
        style={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const bg =
    toast.kind === "error"
      ? "bg-red-500"
      : toast.kind === "info"
        ? "bg-ink-800"
        : "bg-brand-500";

  return (
    <div
      className={`${bg} text-white px-4 py-3 rounded-2xl shadow-lift text-[14px] font-semibold flex items-center gap-2.5 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      <span className="h-6 w-6 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
        {toast.kind === "error" ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        ) : toast.kind === "info" ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      <span className="flex-1">{toast.msg}</span>
    </div>
  );
}
