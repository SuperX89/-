"use client";

import { useEffect } from "react";

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center fade-in">
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full md:max-w-lg md:rounded-3xl bg-white md:shadow-lift rounded-t-[28px] sheet-in flex flex-col max-h-[92vh] ring-1 ring-ink-900/[0.06]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="relative flex items-center justify-between px-5 pt-5 pb-2">
          <div className="h-1.5 w-10 rounded-full bg-ink-200 md:hidden absolute left-1/2 -translate-x-1/2 top-2" />
          <h2 className="font-bold text-lg text-ink-900 mt-2 md:mt-0 tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-ink-100 text-ink-500 transition"
            aria-label="ปิด"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer ? (
          <div className="border-t border-ink-200 px-5 py-3.5 bg-white/95 backdrop-blur md:rounded-b-3xl">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}
