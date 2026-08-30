import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';

export default function OnboardingModal() {
  const { user, onboardUser } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (user.hasOnboarded) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onboardUser(nameInput.trim());
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass-card">
        <div className="onboarding-icon">
          <Terminal size={26} />
        </div>
        
        <h1 className="onboarding-title">Welcome to Momentum</h1>
        <p className="onboarding-subtitle">Your soothing dark workspace with GitHub-style contribution tracking.</p>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <label className="onboarding-label">What should we call you?</label>
          <input
            type="text"
            className="onboarding-input"
            placeholder="Enter your name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="onboarding-btn">
            Enter Workspace <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          background: rgba(1, 4, 9, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        .onboarding-card {
          max-width: 440px;
          width: 90%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2.5rem 2rem;
          background: #161B22;
          border: 1px solid #30363D;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        }
        .onboarding-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--accent-secondary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px var(--accent-glow);
          margin-bottom: 4px;
        }
        .onboarding-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .onboarding-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .onboarding-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .onboarding-label {
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .onboarding-input {
          width: 100%;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          border: 1px solid #30363D;
          background: #0D1117;
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--text-main);
          outline: none;
          text-align: center;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .onboarding-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 12px var(--accent-glow);
        }
        .onboarding-btn {
          width: 100%;
          padding: 12px;
          border-radius: var(--radius-pill);
          border: none;
          background: var(--accent-secondary);
          color: white;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px var(--accent-glow);
          transition: all 0.2s ease;
        }
        .onboarding-btn:hover {
          background: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
