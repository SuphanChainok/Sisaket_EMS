'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  title?: string;
  open?: boolean;
  className?: string;
}

export default function Modal({ children, onClose, title, open = true, className = '' }: ModalProps) {
  if (!open) return null;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h3 style={{ margin: 0 }}>{title}</h3>
            <button aria-label="Close" className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
