import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDailyQuote } from '../utils/quotes';
import { Calendar, Trophy, Flame, Sparkles } from 'lucide-react';

export default function Header() {
  const { user, currentLevel, totalProductiveDays } = useApp();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getDailyQuote(user.name));
  }, [user.name]);

  const displayLevel = currentLevel < 10 ? `0${currentLevel}` : `${currentLevel}`;

  // Live formatted date display (e.g. "Sunday, August 30, 2026")
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="hero-header">
      {/* Top Brand & Date Bar */}
      <div className="brand-bar">
        <div className="logo-group">
          <div className="logo-icon-wrap">
            <Sparkles size={16} className="logo-sparkle" />
          </div>
          <span className="logo-text">MOMENTUM</span>
          <span className="logo-dot">•</span>
          <div className="date-chip">
            <Calendar size={13} className="date-icon" />
            <span>{todayFormatted}</span>
          </div>
        </div>

        {/* User Stats Badges */}
        <div className="header-badges">
          <div className="header-badge level-badge">
            <Trophy size={13} className="badge-icon" />
            <span>Lvl {displayLevel}</span>
          </div>
          {totalProductiveDays > 0 && (
            <div className="header-badge streak-badge">
              <Flame size={13} className="badge-icon orange" />
              <span>{totalProductiveDays}d</span>
            </div>
          )}
        </div>
      </div>

      {/* Claude-Style Minimalistic Greeting Hero */}
      <div className="greeting-hero-card glass-card">
        <h1 className="claude-greeting-text font-serif-italic">
          {greeting}
        </h1>
      </div>

      <style>{`
        .hero-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .brand-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-sparkle {
          color: var(--accent-primary);
        }
        .logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.12em;
          color: var(--text-main);
        }
        .logo-dot {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .date-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .date-icon {
          color: var(--accent-primary);
        }
        .header-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 0.775rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }
        .level-badge {
          background: rgba(163, 113, 247, 0.15);
          color: #BC8CFF;
          border: 1px solid rgba(163, 113, 247, 0.35);
        }
        .streak-badge {
          background: rgba(249, 115, 22, 0.15);
          color: #F97316;
          border: 1px solid rgba(249, 115, 22, 0.35);
        }
        .greeting-hero-card {
          text-align: center;
          padding: 2rem 1.75rem;
          background: rgba(22, 27, 34, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .claude-greeting-text {
          font-size: 2.1rem;
          line-height: 1.25;
          color: var(--text-main);
          letter-spacing: -0.01em;
          font-weight: 400;
        }
        @media (max-width: 640px) {
          .claude-greeting-text {
            font-size: 1.6rem;
          }
          .date-chip {
            font-size: 0.725rem;
          }
        }
      `}</style>
    </header>
  );
}
