import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  maxWidthClassName?: string;
}

export function Dialog({
  open,
  title,
  children,
  footer,
  onClose,
  maxWidthClassName = 'max-w-2xl',
}: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={`relative w-full ${maxWidthClassName} rounded-lg bg-white shadow-xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div className="text-lg font-semibold text-gray-900">{title}</div>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
            aria-label="Luk"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4">{children}</div>

        {footer && <div className="border-t border-gray-200 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
