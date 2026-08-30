import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className={`toast-notification ${toast.type || 'info'}`}>
      <span>{toast.message}</span>

      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--text-main);
          color: var(--text-inverse);
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: slideUpToast 0.3s var(--ease-spring);
        }
        .toast-notification.celebrate {
          background: linear-gradient(135deg, var(--mint-primary) 0%, var(--lavender-primary) 100%);
        }
        @keyframes slideUpToast {
          from {
            opacity: 0;
            transform: translate(-50%, 16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
