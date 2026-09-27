import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Sparkles } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isCelebrate = toast.type === 'celebrate';

  return (
    <div className={`toast-notification ${isCelebrate ? 'toast-celebrate' : 'toast-info'}`} role="status">
      <span className="toast-icon">
        {isCelebrate ? <Sparkles size={14} /> : <Check size={14} />}
      </span>
      <span className="toast-body">{toast.message}</span>

      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--text-primary);
          border-radius: var(--radius-xs);
          padding: 8px 16px;
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 500;
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

        .toast-icon {
          color: var(--accent);
          display: flex;
          align-items: center;
        }

        .toast-celebrate .toast-icon {
          color: var(--accent);
        }

        .toast-body {
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
