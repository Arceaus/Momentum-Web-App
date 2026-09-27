import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { playCompletionSound } from '../utils/audio';
import { getStorageMetrics } from '../utils/db';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download, 
  User, 
  Music, 
  Upload, 
  Check, 
  Play, 
  LogOut, 
  Database, 
  HardDrive,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';

const SOUND_PRESETS = [
  { id: 'chime', label: 'Zen Chime', desc: 'Serene dual-frequency resonant chime' },
  { id: 'bell', label: 'Crystal Bell', desc: 'Resonant high crystal bell tone' },
  { id: 'pop', label: 'Bubble Pop', desc: 'Playful crisp mechanical pop' },
  { id: 'success', label: 'Level Up Triad', desc: 'Vibrant tri-tone achievement chord' },
  { id: 'marimba', label: 'Wooden Marimba', desc: 'Deep organic wood block chime' },
  { id: 'custom', label: 'Custom System Audio', desc: 'User-specified local audio file (.mp3, .wav)' },
];

export default function SettingsView() {
  const { user, settings, updateUser, updateSettings, resetData, logoutUser, tasks, activityLog } = useApp();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'M'));
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal || 5);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  const [soundPreset, setSoundPreset] = useState(settings.soundPreset || 'chime');
  const [customSoundUri, setCustomSoundUri] = useState(settings.customSoundUri || null);
  const [customSoundName, setCustomSoundName] = useState(settings.customSoundName || null);
  const [theme, setTheme] = useState(settings.accentTheme === 'dark' ? 'dark' : 'light');

  const [storageMetrics, setStorageMetrics] = useState({
    usedKB: '120.5',
    usedMB: '0.12',
    quotaGB: '50.0',
    percentUsed: '0.001',
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    getStorageMetrics().then((metrics) => {
      if (metrics) setStorageMetrics(metrics);
    });
  }, [tasks, activityLog]);

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    updateUser({ name: name.trim(), avatar: avatar.toUpperCase() });
    updateSettings({
      dailyGoal: Number(dailyGoal),
      soundEnabled,
      soundPreset,
      customSoundUri,
      customSoundName,
      accentTheme: theme,
    });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateSettings({ accentTheme: newTheme });
  };

  const handleTestAudio = () => {
    playCompletionSound(true, soundPreset, customSoundUri);
  };

  const handleSelectPreset = (presetId) => {
    if (presetId === 'custom') {
      fileInputRef.current?.click();
    } else {
      setSoundPreset(presetId);
      playCompletionSound(true, presetId);
      updateSettings({ soundPreset: presetId });
    }
  };

  const handleToggleSound = (enabled) => {
    setSoundEnabled(enabled);
    updateSettings({ soundEnabled: enabled });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result;
      if (dataUri) {
        setCustomSoundUri(dataUri);
        setCustomSoundName(file.name);
        setSoundPreset('custom');
        playCompletionSound(true, 'custom', dataUri);
        updateSettings({
          soundPreset: 'custom',
          customSoundUri: dataUri,
          customSoundName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportData = () => {
    const exportObject = {
      user,
      settings,
      tasks,
      activityLog,
      exportDate: new Date().toISOString(),
      clientVersion: 'v1.4',
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `momentum_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetSlate = () => {
    if (window.confirm("WARNING: This will permanently wipe all local tasks, logs, and user data. Are you sure?")) {
      resetData();
    }
  };

  return (
    <div className="settings-document-container">
      {/* Document Masthead */}
      <header className="doc-masthead">
        <div className="masthead-meta">
          <span className="mono-code">MOMENTUM // SYSTEM SPECIFICATION</span>
          <span className="mono-badge">DOC-06 · CONFIGURATION</span>
        </div>
        <h1 className="doc-title">System Settings</h1>
        <p className="doc-summary">
          Control document for workspace parameters, operator attribution, auditory telemetry, local storage allocation, and archival backups.
        </p>
      </header>

      {/* SECTION 01: OPERATOR PROFILE */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-number">01</div>
          <div className="section-info">
            <h2 className="section-title">
              <User size={15} /> Operator Identity
            </h2>
            <p className="section-subtext">
              Attribution metadata displayed across console headers, stamps, and workspace logs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="section-body">
          <div className="fields-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="operator-name">Operator Name / Callsign</label>
              <input
                id="operator-name"
                type="text"
                className="input-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarthak"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="operator-avatar">Monogram Stamp</label>
              <div className="monogram-input-wrap">
                <input
                  id="operator-avatar"
                  type="text"
                  className="input-control monogram-input"
                  maxLength={2}
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                  placeholder="M"
                />
                <div className="monogram-live-stamp">
                  [{avatar || '?'}]
                </div>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="operator-goal">Daily Focus Target (Tasks)</label>
              <div className="number-input-wrap">
                <input
                  id="operator-goal"
                  type="number"
                  min={1}
                  max={20}
                  className="input-control"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                />
                <span className="field-unit">tasks / cycle</span>
              </div>
            </div>
          </div>

          <div className="section-action-row">
            <button type="submit" className="btn-action-primary">
              Save Operator Identity
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 02: AUDITORY FEEDBACK */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-number">02</div>
          <div className="section-info">
            <h2 className="section-title">
              <Music size={15} /> Auditory Telemetry
            </h2>
            <p className="section-subtext">
              Tactile acoustic verification tones emitted upon task completion.
            </p>
          </div>
        </div>

        <div className="section-body">
          {/* Master Audio Control Switch & Test */}
          <div className="control-bar-row">
            <div className="control-bar-label">
              <div className="label-main">Acoustic Feedback State</div>
              <div className="label-sub">Enable or mute audio tones when tasks are checked off</div>
            </div>

            <div className="control-bar-actions">
              <div className="segmented-switch">
                <button
                  type="button"
                  className={`switch-segment ${soundEnabled ? 'active' : ''}`}
                  onClick={() => handleToggleSound(true)}
                >
                  <Volume2 size={13} /> Active
                </button>
                <button
                  type="button"
                  className={`switch-segment ${!soundEnabled ? 'active' : ''}`}
                  onClick={() => handleToggleSound(false)}
                >
                  <VolumeX size={13} /> Muted
                </button>
              </div>

              {soundEnabled && (
                <button
                  type="button"
                  className="btn-action-secondary"
                  onClick={handleTestAudio}
                  title="Play current sound"
                >
                  <Play size={12} /> Test Tone
                </button>
              )}
            </div>
          </div>

          {/* Sound Presets Matrix */}
          {soundEnabled && (
            <div className="presets-block">
              <div className="presets-header">
                <span className="field-label">Available Tone Syntheses</span>
                {customSoundName && soundPreset === 'custom' && (
                  <span className="preset-active-custom">
                    <Check size={12} /> File: {customSoundName}
                  </span>
                )}
              </div>

              <div className="presets-table">
                {SOUND_PRESETS.map((preset, index) => {
                  const isSelected = soundPreset === preset.id;
                  const idxStr = String(index + 1).padStart(2, '0');
                  return (
                    <div
                      key={preset.id}
                      className={`preset-entry ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectPreset(preset.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectPreset(preset.id);
                        }
                      }}
                    >
                      <div className="entry-marker">
                        <span className="mono-idx">{idxStr}</span>
                        <span className="radio-pip">{isSelected ? '●' : '○'}</span>
                      </div>
                      <div className="entry-content">
                        <span className="entry-name">{preset.label}</span>
                        <span className="entry-desc">{preset.desc}</span>
                      </div>
                      {isSelected && (
                        <span className="entry-status-badge">CURRENT</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <div className="upload-action-row">
                <button
                  type="button"
                  className="btn-action-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={13} /> Upload Custom Audio File (.mp3, .wav, .ogg)
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 03: APPEARANCE & THEME */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-number">03</div>
          <div className="section-info">
            <h2 className="section-title">
              <Sun size={15} /> Appearance & Visual Canvas
            </h2>
            <p className="section-subtext">
              Select between warm architectural paper or dark drafting slate visual mode.
            </p>
          </div>
        </div>

        <div className="section-body">
          <div className="theme-selector-grid">
            <div
              className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('light')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleThemeChange('light');
              }}
            >
              <div className="theme-preview light-preview">
                <div className="preview-rule" />
                <div className="preview-stamp">[ M ]</div>
              </div>
              <div className="theme-text">
                <div className="theme-name">
                  <Sun size={13} /> Warm Paper Ground
                </div>
                <div className="theme-desc">Architectural vellum, carbon ink, terracotta vermilion</div>
              </div>
              <div className="theme-check">{theme === 'light' ? '● SELECTED' : '○'}</div>
            </div>

            <div
              className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('dark')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleThemeChange('dark');
              }}
            >
              <div className="theme-preview dark-preview">
                <div className="preview-rule" />
                <div className="preview-stamp">[ M ]</div>
              </div>
              <div className="theme-text">
                <div className="theme-name">
                  <Moon size={13} /> Drafting Slate Dark
                </div>
                <div className="theme-desc">Low-luminance graphite ground, calibrated contrast</div>
              </div>
              <div className="theme-check">{theme === 'dark' ? '● SELECTED' : '○'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: STORAGE & DATABASE */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-number">04</div>
          <div className="section-info">
            <div className="section-title-wrap">
              <h2 className="section-title">
                <Database size={15} /> Local Database & Telemetry
              </h2>
              <span className="status-stamp">INDEXEDDB ENGINE ACTIVE</span>
            </div>
            <p className="section-subtext">
              High-performance client-side browser database. All data resides 100% locally on your machine with zero third-party telemetry.
            </p>
          </div>
        </div>

        <div className="section-body">
          {/* Calibrated Storage Precision Rail Gauge */}
          <div className="storage-telemetry-box">
            <div className="telemetry-top">
              <div className="telemetry-label">
                <HardDrive size={13} />
                <span>STORAGE ALLOCATION GAUGE</span>
              </div>
              <div className="telemetry-numbers">
                <strong>{storageMetrics.usedKB} KB</strong> used · {storageMetrics.quotaGB} GB available
              </div>
            </div>

            <div className="precision-rail-track">
              <div
                className="precision-rail-fill"
                style={{ width: `${Math.max(1, Math.min(100, parseFloat(storageMetrics.percentUsed) * 100))}%` }}
              />
            </div>

            <div className="telemetry-meta">
              <span className="mono-sub">HEALTH: NOMINAL (V12 SCHEMA)</span>
              <span className="mono-sub">{storageMetrics.percentUsed}% CAPACITY UTILIZED</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: DATA MANAGEMENT & LIFECYCLE */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-number">05</div>
          <div className="section-info">
            <h2 className="section-title">
              <ShieldCheck size={15} /> Workspace Lifecycle & Archives
            </h2>
            <p className="section-subtext">
              Export complete structured JSON backups for offline archiving or reset the workspace ledger.
            </p>
          </div>
        </div>

        <div className="section-body">
          <div className="action-buttons-strip">
            <button type="button" className="btn-action-secondary" onClick={handleExportData}>
              <Download size={13} /> Export JSON Archive
            </button>

            <button type="button" className="btn-action-secondary" onClick={logoutUser}>
              <LogOut size={13} /> Switch Profile / Sign Out
            </button>

            <button type="button" className="btn-action-danger" onClick={handleResetSlate}>
              <RotateCcw size={13} /> Reset Workspace Slate
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .settings-document-container {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          padding: 2.25rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          margin-bottom: 2rem;
        }

        /* Masthead */
        .doc-masthead {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .masthead-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .mono-code {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          letter-spacing: var(--tracking-mono);
          color: var(--text-muted);
          font-weight: 500;
        }
        .mono-badge {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          color: var(--accent);
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          padding: 2px 7px;
          border-radius: var(--radius-xs);
          letter-spacing: 0.04em;
        }
        .doc-title {
          font-family: var(--font-heading);
          font-size: 1.65rem;
          font-weight: 700;
          letter-spacing: var(--tracking-tight);
          color: var(--text-primary);
          margin: 0;
        }
        .doc-summary {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
          max-width: 640px;
        }

        /* Sections */
        .settings-doc-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .settings-doc-section:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .section-head {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .section-number {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-faint);
          padding-top: 2px;
          min-width: 22px;
        }
        .section-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .section-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: var(--tracking-wide);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        .section-subtext {
          font-size: 0.815rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin: 0;
        }
        .status-stamp {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          color: var(--success);
          background: var(--success-light);
          border: 1px solid var(--success-border);
          padding: 2px 7px;
          border-radius: var(--radius-xs);
          letter-spacing: 0.04em;
        }

        .section-body {
          padding-left: 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Form Controls */
        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1.25rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          letter-spacing: var(--tracking-mono);
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
        }
        .input-control {
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--duration-fast) ease;
        }
        .input-control:focus {
          border-color: var(--text-primary);
          background: var(--bg-surface);
        }

        .monogram-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .monogram-input {
          width: 60px;
          text-align: center;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .monogram-live-stamp {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--accent);
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
        }

        .number-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .number-input-wrap .input-control {
          width: 80px;
          font-family: var(--font-mono);
        }
        .field-unit {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .section-action-row {
          display: flex;
          justify-content: flex-start;
          padding-top: 4px;
        }

        /* Buttons */
        .btn-action-primary {
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--text-primary);
          padding: 8px 18px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.825rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: background var(--duration-fast) ease, opacity var(--duration-fast) ease;
        }
        .btn-action-primary:hover {
          opacity: 0.9;
        }

        .btn-action-secondary {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background var(--duration-fast) ease, border-color var(--duration-fast) ease;
        }
        .btn-action-secondary:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
        }

        .btn-action-danger {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          color: var(--danger);
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all var(--duration-fast) ease;
        }
        .btn-action-danger:hover {
          background: var(--danger-light);
          border-color: var(--danger-border);
        }

        .btn-action-dashed {
          background: var(--bg-surface-sunken);
          border: 1px dashed var(--border-dashed);
          color: var(--text-secondary);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all var(--duration-fast) ease;
        }
        .btn-action-dashed:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-light);
        }

        /* Control Bar (Audio State) */
        .control-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }
        .control-bar-label .label-main {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .control-bar-label .label-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .control-bar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Segmented Switch */
        .segmented-switch {
          display: inline-flex;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          padding: 2px;
          gap: 2px;
        }
        .switch-segment {
          background: transparent;
          border: none;
          padding: 4px 10px;
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all var(--duration-fast) ease;
        }
        .switch-segment.active {
          background: var(--text-primary);
          color: var(--text-inverse);
        }

        /* Presets Matrix */
        .presets-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .presets-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .preset-active-custom {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .presets-table {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 8px;
        }
        .preset-entry {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 9px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease;
        }
        .preset-entry:hover {
          border-color: var(--border-strong);
          background: var(--bg-hover);
        }
        .preset-entry.selected {
          border-color: var(--accent);
          background: var(--accent-light);
        }
        .entry-marker {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mono-idx {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .radio-pip {
          font-size: 0.8rem;
          color: var(--accent);
        }
        .entry-content {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
        }
        .entry-name {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .entry-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
        }
        .entry-status-badge {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--accent);
          border: 1px solid var(--accent-border);
          padding: 1px 5px;
          border-radius: var(--radius-xs);
          letter-spacing: 0.05em;
        }
        .upload-action-row {
          padding-top: 4px;
        }

        /* Theme Selector */
        .theme-selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }
        .theme-option {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }
        .theme-option:hover {
          border-color: var(--border-strong);
        }
        .theme-option.selected {
          border-color: var(--accent);
          background: var(--accent-light);
        }
        .theme-preview {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xs);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid var(--border);
          flex-shrink: 0;
        }
        .light-preview {
          background: #F7F5F0;
          color: #181715;
        }
        .dark-preview {
          background: #141312;
          color: #EDEBE8;
          border-color: #38342E;
        }
        .preview-rule {
          width: 24px;
          height: 2px;
          background: currentColor;
          opacity: 0.25;
        }
        .preview-stamp {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
        }
        .theme-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .theme-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .theme-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
        }
        .theme-check {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .theme-option.selected .theme-check {
          color: var(--accent);
        }

        /* Storage Telemetry */
        .storage-telemetry-box {
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .telemetry-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .telemetry-label {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 600;
          letter-spacing: var(--tracking-mono);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .telemetry-numbers {
          font-family: var(--font-mono);
          font-size: 0.775rem;
          color: var(--text-secondary);
        }
        .precision-rail-track {
          width: 100%;
          height: 6px;
          background: var(--bg-hover);
          border: 1px solid var(--border-subtle);
          border-radius: 2px;
          overflow: hidden;
        }
        .precision-rail-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }
        .telemetry-meta {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
        }
        .mono-sub {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          color: var(--text-muted);
        }

        /* Action Buttons Strip */
        .action-buttons-strip {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* Responsive Layout */
        @media (max-width: 680px) {
          .settings-document-container {
            padding: 1.5rem 1.15rem;
            gap: 2rem;
          }
          .section-body {
            padding-left: 0;
          }
          .control-bar-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .control-bar-actions {
            width: 100%;
            justify-content: space-between;
          }
          .action-buttons-strip {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-action-secondary, .btn-action-danger {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
