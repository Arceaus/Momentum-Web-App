import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Lock } from 'lucide-react';

export default function OnboardingModal() {
  const { user, onboardUser } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (user.hasOnboarded) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onboardUser(nameInput.trim());
  };

  const initialLetter = nameInput.trim() ? nameInput.trim().charAt(0).toUpperCase() : 'M';

  return (
    <div className="onboarding-scrim">
      <div className="onboarding-document">
        {/* Top Header */}
        <div className="onboarding-masthead">
          <div className="brand-identity">
            <span className="brand-stamp" aria-hidden="true">M</span>
            <span className="brand-name">MOMENTUM</span>
          </div>
          <div className="onboarding-stamp font-mono">[{initialLetter}]</div>
        </div>

        {/* Philosophy Intro */}
        <div className="philosophy-statement">
          <h1 className="philosophy-title">
            A personal system for getting work done and seeing your progress.
          </h1>
          <p className="philosophy-prose">
            Designed without vanity metrics or distractions. Momentum is an intentional personal workspace: record what matters today, focus with clarity, and keep a private record of your genuine work.
          </p>
        </div>

        {/* Three System Tenets */}
        <div className="tenets-ledger">
          <div className="tenet-row">
            <span className="tenet-idx font-mono">01</span>
            <div className="tenet-detail">
              <span className="tenet-heading">Daily Focus</span>
              <span className="tenet-text">Record what matters today. Check items off as you finish them.</span>
            </div>
          </div>

          <div className="tenet-row">
            <span className="tenet-idx font-mono">02</span>
            <div className="tenet-detail">
              <span className="tenet-heading">Focus Sessions</span>
              <span className="tenet-text">Dedicated time to do one thing well, with gentle completion sounds.</span>
            </div>
          </div>

          <div className="tenet-row">
            <span className="tenet-idx font-mono">03</span>
            <div className="tenet-detail">
              <span className="tenet-heading">Your Record</span>
              <span className="tenet-text">A private 52-week activity log saved directly on your device.</span>
            </div>
          </div>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-field-group">
            <label className="field-label" htmlFor="onboarding-name">
              Your name
            </label>
            <div className="input-with-stamp">
              <input
                id="onboarding-name"
                type="text"
                className="onboarding-input"
                placeholder="e.g. Sarthak"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                required
              />
              <div className="live-preview-chip font-mono">
                [{initialLetter}]
              </div>
            </div>
          </div>

          <button type="submit" className="onboarding-submit-btn">
            <span>Get started</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Privacy Guarantee Footer */}
        <div className="onboarding-security-footer">
          <div className="security-badge">
            <Lock size={12} />
            <span>Private & local · Stored directly in your browser</span>
          </div>
        </div>
      </div>

      <style>{`
        .onboarding-scrim {
          position: fixed;
          inset: 0;
          background: rgba(24, 23, 21, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
          animation: scrimFadeIn var(--duration-fast) ease-out;
        }

        .onboarding-document {
          max-width: 500px;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-modal);
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: docSlideIn var(--duration-normal) var(--ease-tactile);
        }

        /* Masthead */
        .onboarding-masthead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .brand-identity {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .brand-stamp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: var(--text-primary);
          color: var(--text-inverse);
          font-family: var(--font-heading);
          font-size: 0.725rem;
          font-weight: 700;
          border-radius: var(--radius-xs);
          line-height: 1;
        }

        .brand-name {
          font-family: var(--font-heading);
          font-size: 0.825rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--text-primary);
        }

        .onboarding-stamp {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
        }

        /* Philosophy Intro */
        .philosophy-statement {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .philosophy-title {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.55rem;
          font-weight: 400;
          color: var(--text-primary);
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .philosophy-prose {
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--text-secondary);
        }

        /* Tenets */
        .tenets-ledger {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          background: var(--bg-subtle);
          overflow: hidden;
        }

        .tenet-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .tenet-row:last-child {
          border-bottom: none;
        }

        .tenet-idx {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
          padding-top: 1px;
        }

        .tenet-detail {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .tenet-heading {
          font-family: var(--font-heading);
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .tenet-text {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Form */
        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .input-with-stamp {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .onboarding-input {
          flex: 1;
          padding: 9px 12px !important;
          background: var(--bg-surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius-xs) !important;
          font-family: var(--font-heading) !important;
          font-size: 0.9375rem !important;
          color: var(--text-primary) !important;
          outline: none;
        }

        .onboarding-input:focus {
          border-color: var(--accent) !important;
        }

        .live-preview-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          background: var(--bg-subtle);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
        }

        .onboarding-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--text-primary);
          border-radius: var(--radius-xs);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--duration-fast) ease, border-color var(--duration-fast) ease;
        }

        .onboarding-submit-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
        }

        /* Footer */
        .onboarding-security-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 4px;
        }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        @keyframes scrimFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes docSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .onboarding-document {
            padding: 1.5rem;
            gap: 1.25rem;
          }

          .philosophy-title {
            font-size: 1.35rem;
          }

          .onboarding-input {
            font-size: 1rem !important; /* iOS zoom prevention */
          }
        }
      `}</style>
    </div>
  );
}
