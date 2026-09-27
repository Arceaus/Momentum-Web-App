import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDailyAtmosphere, getAtmosphereGreeting } from '../utils/atmosphere';
import { Calendar, Trophy, Flame } from 'lucide-react';

export default function Header() {
  const { user, currentLevel, totalProductiveDays } = useApp();

  // Derived greeting directly from user profile & current atmosphere
  const greeting = getAtmosphereGreeting(user.name);
  const [atmosphere, setAtmosphere] = useState(() => getDailyAtmosphere());

  // Live ticking date + time indicator (e.g. "Sun, Aug 30 · 9:14 PM")
  const [liveTimeString, setLiveTimeString] = useState(() => {
    const now = new Date();
    const datePart = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const timePart = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const timePart = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLiveTimeString(`${datePart} · ${timePart}`);
      setAtmosphere(getDailyAtmosphere());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const displayLevel = currentLevel < 10 ? `0${currentLevel}` : `${currentLevel}`;
  const userInitial = user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'M');

  return (
    <header className="workspace-header">
      {/* Top Utilitarian Console Masthead */}
      <div className="console-masthead">
        {/* Left: Brand & Console Context */}
        <div className="masthead-left">
          <div className="brand-identity">
            <span className="brand-stamp" aria-hidden="true">M</span>
            <span className="brand-name">MOMENTUM</span>
          </div>
          <span className="masthead-divider" aria-hidden="true">/</span>
          <span className="masthead-tag">WORK CONSOLE</span>
        </div>

        {/* Center: Live Time & Atmosphere Telemetry */}
        <div className="masthead-center">
          <div className="time-chip" title="Live system clock">
            <Calendar size={12} className="meta-icon" />
            <span>{liveTimeString}</span>
          </div>

          <div className={`atmosphere-chip period-${atmosphere.period}`} title="Current time-of-day focus state">
            <span className="period-sym">{atmosphere.iconSymbol}</span>
            <span>{atmosphere.label}</span>
          </div>
        </div>

        {/* Right: User Statistics & Profile Stamp */}
        <div className="masthead-right">
          <div className="telemetry-badge level" title={`Experience Level ${currentLevel}`}>
            <Trophy size={12} className="badge-icon" />
            <span>LVL {displayLevel}</span>
          </div>

          {totalProductiveDays > 0 && (
            <div className="telemetry-badge streak" title={`${totalProductiveDays} productive days streak`}>
              <Flame size={12} className="badge-icon flame" />
              <span>{totalProductiveDays}D</span>
            </div>
          )}

          <div className="user-profile-stamp" title={`Workspace profile: ${user.name || 'Anonymous'}`}>
            <span>{userInitial}</span>
          </div>
        </div>
      </div>

      {/* Editorial Greeting Header (Quiet, Integrated, Non-Floating) */}
      <div className="editorial-banner">
        <div className="editorial-meta-row">
          <span className="editorial-eyebrow">
            MOMENTUM CONSOLE · {atmosphere.label.toUpperCase()}
          </span>
        </div>
        <h1 className="editorial-greeting">
          {greeting}
        </h1>
      </div>

      <style>{`
        .workspace-header {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        /* Top Utilitarian Masthead Bar */
        .console-masthead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          gap: 12px;
          flex-wrap: wrap;
        }

        .masthead-left {
          display: flex;
          align-items: center;
          gap: 8px;
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
          font-family: var(--font-mono);
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

        .masthead-divider {
          color: var(--border-base);
          font-size: 0.75rem;
          font-family: var(--font-mono);
        }

        .masthead-tag {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .masthead-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .time-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.725rem;
          color: var(--text-secondary);
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
        }

        .meta-icon {
          color: var(--text-muted);
        }

        .period-sym {
          font-size: 0.75rem;
          line-height: 1;
        }

        .masthead-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .telemetry-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 7px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border);
          background: var(--bg-subtle);
          color: var(--text-secondary);
        }

        .telemetry-badge.level {
          color: var(--text-primary);
        }

        .telemetry-badge.streak {
          background: var(--accent-light);
          color: var(--accent);
          border-color: var(--accent-border);
        }

        .badge-icon.flame {
          color: var(--accent);
        }

        .user-profile-stamp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--bg-subtle);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Integrated Editorial Greeting */
        .editorial-banner {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 1.25rem 0.25rem 0.5rem 0.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .editorial-meta-row {
          display: flex;
          align-items: center;
        }

        .editorial-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .editorial-greeting {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 2.25rem;
          font-weight: 400;
          line-height: 1.2;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        @media (max-width: 680px) {
          .console-masthead {
            padding: 0.5rem 0.65rem;
          }
          .masthead-center {
            order: 3;
            width: 100%;
            justify-content: space-between;
            padding-top: 6px;
            border-top: 1px solid var(--border-subtle);
          }
          .editorial-greeting {
            font-size: 1.75rem;
          }
          .masthead-tag {
            display: none;
          }
          .masthead-divider {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
