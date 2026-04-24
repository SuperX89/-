"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  danger,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 fade-in">
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-lift p-6 ring-1 ring-ink-900/[0.06] scale-in">
        {danger && (
          <div className="h-12 w-12 rounded-2xl bg-red-50 ring-1 ring-red-100 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.7 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
        )}
        <h3 className="font-bold text-lg text-ink-900 tracking-tight">{title}</h3>
        {message ? <p className="text-[13px] text-ink-500 mt-2">{message}</p> : null}
        <div className="flex gap-2 mt-5">
          <button className="btn-secondary flex-1" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button
            className={
              danger
                ? "btn bg-red-500 hover:bg-red-600 text-white shadow-soft flex-1"
                : "btn-primary flex-1"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
