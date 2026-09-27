import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isCelebrate = toast.type === 'celebrate';

  return (
    <div className={`toast-notification ${isCelebrate ? 'toast-celebrate' : 'toast-info'}`} role="status">
      <span className="toast-tag">{isCelebrate ? '[CELEBRATION]' : '[STATUS]'}</span>
      <span className="toast-body">{toast.message}</span>

      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          box-shadow: var(--shadow-modal);
          z-index: 2500;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideUpToast var(--duration-fast) var(--ease-tactile);
          white-space: nowrap;
          pointer-events: none;
        }

        .toast-celebrate {
          border-left: 3px solid var(--accent);
        }

        .toast-tag {
          font-size: 0.7rem;
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .toast-celebrate .toast-tag {
          color: #E5835F;
        }

        .toast-body {
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        @keyframes slideUpToast {
          from {
            opacity: 0;
            transform: translate(-50%, 5px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 680px) {
          .toast-notification {
            bottom: 4.5rem;
            max-width: 90vw;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
