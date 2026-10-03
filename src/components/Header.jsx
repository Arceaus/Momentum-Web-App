import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDailyAtmosphere, getAtmosphereGreeting } from '../utils/atmosphere';
import { Calendar, Trophy, Flame } from 'lucide-react';

export default function Header() {
  const { user, currentLevel, totalProductiveDays, atmosphere: ctxAtmosphere } = useApp();
  const [localAtmosphere, setLocalAtmosphere] = useState(() => getDailyAtmosphere());
  const atmosphere = ctxAtmosphere || localAtmosphere;

  // Derived greeting directly from user profile & current atmosphere
  const greeting = getAtmosphereGreeting(user.name);

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
      setLocalAtmosphere(getDailyAtmosphere());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const userInitial = user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'M');

  return (
    <header className="workspace-header">
      {/* Top Workspace Masthead */}
      <div className="workspace-masthead">
        {/* Left: Brand Identity */}
        <div className="masthead-left">
          <div className="brand-identity">
            <span className="brand-stamp" aria-hidden="true">M</span>
            <span className="brand-name">MOMENTUM</span>
          </div>
        </div>

        {/* Center: Live Time */}
        <div className="masthead-center">
          <div className="time-chip" title="Live clock">
            <Calendar size={12} className="meta-icon" />
            <span>{liveTimeString}</span>
          </div>
        </div>

        {/* Right: User Statistics & Profile Monogram */}
        <div className="masthead-right">
          <div className="header-stat-badge level" title={`Level ${currentLevel}`}>
            <Trophy size={12} className="badge-icon" />
            <span className="badge-txt">Lvl</span>
            <span className="badge-num font-mono">{currentLevel}</span>
          </div>

          {totalProductiveDays > 0 && (
            <div className="header-stat-badge streak" title={`${totalProductiveDays} day streak`}>
              <Flame size={12} className="badge-icon flame" />
              <span className="badge-num font-mono">{totalProductiveDays}d</span>
              <span className="badge-txt">streak</span>
            </div>
          )}

          <div className="user-profile-stamp" title={`Profile: ${user.name || 'Anonymous'}`}>
            <span>{userInitial}</span>
          </div>
        </div>
      </div>

      {/* Editorial Greeting Header */}
      <div className="editorial-banner">
        <span
          className="editorial-eyebrow"
          title={`Atmosphere: ${atmosphere.label} · Click to preview daylight transition`}
          onClick={() => {
            const periods = ['morning', 'afternoon', 'evening', 'night'];
            const nextIdx = (periods.indexOf(atmosphere.period) + 1) % periods.length;
            window.__setAtmosphere?.(periods[nextIdx]);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              const periods = ['morning', 'afternoon', 'evening', 'night'];
              const nextIdx = (periods.indexOf(atmosphere.period) + 1) % periods.length;
              window.__setAtmosphere?.(periods[nextIdx]);
            }
          }}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {atmosphere.label}
        </span>
        <h1 className="editorial-greeting">
          {greeting}
        </h1>
      </div>

      <style>{`
        .workspace-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
        }

        /* Top Masthead Bar */
        .workspace-masthead {
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

        .masthead-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-heading);
          font-size: 0.725rem;
          font-weight: 600;
          padding: 3px 7px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border);
          background: var(--bg-subtle);
          color: var(--text-secondary);
        }

        .header-stat-badge.level {
          color: var(--text-primary);
        }

        .header-stat-badge.streak {
          background: var(--accent-light);
          color: var(--accent);
          border-color: var(--accent-border);
        }

        .badge-num {
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .badge-txt {
          font-size: 0.7rem;
          font-weight: 500;
          opacity: 0.85;
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
          font-family: var(--font-heading);
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Integrated Editorial Greeting */
        .editorial-banner {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0.75rem 0.25rem 0.25rem 0.25rem;
        }

        .editorial-eyebrow {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          color: var(--accent);
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
          .workspace-masthead {
            padding: 0.5rem 0.65rem;
          }
          .masthead-center {
            order: 3;
            width: 100%;
            justify-content: center;
            padding-top: 6px;
            border-top: 1px solid var(--border-subtle);
          }
          .editorial-greeting {
            font-size: clamp(1.4rem, 6vw, 1.75rem);
            word-break: break-word;
          }
        }
      `}</style>
    </header>
  );
}
