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
  { id: 'custom', label: 'Custom Audio', desc: 'User-selected audio file (.mp3, .wav)' },
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
    downloadAnchor.setAttribute("download", `momentum_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetSlate = () => {
    if (window.confirm("WARNING: This will permanently delete all local tasks, history, and preferences. Are you sure?")) {
      resetData();
    }
  };

  return (
    <div className="settings-document-container">
      {/* Settings Header */}
      <header className="doc-masthead">
        <h1 className="doc-title">Settings</h1>
        <p className="doc-summary">
          Manage your profile, sound preferences, appearance, and local data.
        </p>
      </header>

      {/* SECTION 01: PROFILE */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-info">
            <h2 className="section-title">
              <User size={16} /> Profile
            </h2>
            <p className="section-subtext">
              Your name, initials monogram, and daily completion target.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="section-body">
          <div className="fields-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="user-name">Your name</label>
              <input
                id="user-name"
                type="text"
                className="input-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarthak"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="user-avatar">Monogram</label>
              <div className="monogram-input-wrap">
                <input
                  id="user-avatar"
                  type="text"
                  className="input-control monogram-input font-mono"
                  maxLength={2}
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                  placeholder="M"
                />
                <div className="monogram-live-stamp font-mono">
                  [{avatar || '?'}]
                </div>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="user-goal">Daily goal (tasks)</label>
              <div className="number-input-wrap">
                <input
                  id="user-goal"
                  type="number"
                  min={1}
                  max={20}
                  className="input-control font-mono"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                />
                <span className="field-unit">tasks / day</span>
              </div>
            </div>
          </div>

          <div className="section-action-row">
            <button type="submit" className="btn-action-primary">
              Save changes
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 02: SOUNDS */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-info">
            <h2 className="section-title">
              <Music size={16} /> Sounds
            </h2>
            <p className="section-subtext">
              Audio feedback played when completing tasks.
            </p>
          </div>
        </div>

        <div className="section-body">
          {/* Master Audio Control Switch & Test */}
          <div className="control-bar-row">
            <div className="control-bar-label">
              <div className="label-main">Completion sound</div>
              <div className="label-sub">Play a gentle tone when checking off a task</div>
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
                  <Play size={12} /> Test sound
                </button>
              )}
            </div>
          </div>

          {/* Sound Presets Matrix */}
          {soundEnabled && (
            <div className="presets-block">
              <div className="presets-header">
                <span className="field-label">Sound theme</span>
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
                        <span className="mono-idx font-mono">{idxStr}</span>
                        <span className="radio-pip">{isSelected ? '●' : '○'}</span>
                      </div>
                      <div className="entry-content">
                        <span className="entry-name">{preset.label}</span>
                        <span className="entry-desc">{preset.desc}</span>
                      </div>
                      {isSelected && (
                        <span className="entry-status-badge">ACTIVE</span>
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
                  <Upload size={13} /> Upload custom audio (.mp3, .wav)
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 03: APPEARANCE */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-info">
            <h2 className="section-title">
              <Sun size={16} /> Appearance
            </h2>
            <p className="section-subtext">
              Choose your preferred workspace aesthetic.
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
                <div className="theme-desc">Architectural paper, carbon ink, terracotta accent</div>
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
                <div className="theme-desc">Warm charcoal slate, calm low-contrast ground</div>
              </div>
              <div className="theme-check">{theme === 'dark' ? '● SELECTED' : '○'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: STORAGE */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-info">
            <div className="section-title-wrap">
              <h2 className="section-title">
                <Database size={16} /> Storage
              </h2>
              <span className="status-stamp">INDEXEDDB · LOCAL</span>
            </div>
            <p className="section-subtext">
              All your tasks, streaks, and history reside privately on your device.
            </p>
          </div>
        </div>

        <div className="section-body">
          <div className="storage-card-box">
            <div className="storage-top">
              <div className="storage-label">
                <HardDrive size={13} />
                <span>Local storage</span>
              </div>
              <div className="storage-numbers font-mono">
                <strong>{storageMetrics.usedKB} KB</strong> used · {storageMetrics.quotaGB} GB available
              </div>
            </div>

            <div className="precision-rail-track">
              <div
                className="precision-rail-fill"
                style={{ width: `${Math.max(1, Math.min(100, parseFloat(storageMetrics.percentUsed) * 100))}%` }}
              />
            </div>

            <div className="storage-meta">
              <span className="mono-sub">100% PRIVATE · STORED ON THIS DEVICE</span>
              <span className="mono-sub font-mono">{storageMetrics.percentUsed}% USED</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: YOUR DATA */}
      <section className="settings-doc-section">
        <div className="section-head">
          <div className="section-info">
            <h2 className="section-title">
              <ShieldCheck size={16} /> Your Data
            </h2>
            <p className="section-subtext">
              Export complete JSON backups or reset your workspace data.
            </p>
          </div>
        </div>

        <div className="section-body">
          <div className="action-buttons-strip">
            <button type="button" className="btn-action-secondary" onClick={handleExportData}>
              <Download size={13} /> Export data (JSON)
            </button>

            <button type="button" className="btn-action-secondary" onClick={logoutUser}>
              <LogOut size={13} /> Switch profile / Sign out
            </button>

            <button type="button" className="btn-action-danger" onClick={handleResetSlate}>
              <RotateCcw size={13} /> Reset all data
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .settings-document-container {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 2rem 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
          margin-bottom: 2rem;
        }

        /* Masthead */
        .doc-masthead {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .doc-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .doc-summary {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Section Layout */
        .settings-doc-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .settings-doc-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .section-head {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .section-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .status-stamp {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          background: var(--bg-subtle);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
          letter-spacing: var(--tracking-wide);
        }

        .section-subtext {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .section-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Form Fields Grid */
        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .field-group {
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

        .input-control {
          width: 100%;
          padding: 7px 10px !important;
          background: var(--bg-surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius-xs) !important;
          font-family: var(--font-heading) !important;
          font-size: 0.875rem !important;
          color: var(--text-primary) !important;
          outline: none;
        }

        .input-control:focus {
          border-color: var(--accent) !important;
        }

        .monogram-input-wrap,
        .number-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .monogram-input {
          width: 50px !important;
          text-align: center;
          text-transform: uppercase;
        }

        .monogram-live-stamp {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--accent);
        }

        .field-unit {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .section-action-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 4px;
        }

        .btn-action-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--text-primary);
          padding: 7px 16px;
          border-radius: var(--radius-xs);
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--duration-fast) ease, border-color var(--duration-fast) ease;
        }

        .btn-action-primary:hover {
          background: var(--accent);
          border-color: var(--accent);
        }

        /* Sound Controls */
        .control-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: var(--bg-subtle);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          flex-wrap: wrap;
          gap: 12px;
        }

        .control-bar-label .label-main {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .control-bar-label .label-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .control-bar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .segmented-switch {
          display: inline-flex;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          padding: 2px;
          gap: 2px;
        }

        .switch-segment {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border: none;
          background: transparent;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          border-radius: 2px;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .switch-segment.active {
          background: var(--text-primary);
          color: var(--text-inverse);
        }

        .btn-action-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 5px 12px;
          border-radius: var(--radius-xs);
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .btn-action-secondary:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
          border-color: var(--border-strong);
        }

        .btn-action-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--danger-border);
          color: var(--danger);
          padding: 5px 12px;
          border-radius: var(--radius-xs);
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .btn-action-danger:hover {
          background: var(--danger-light);
          border-color: var(--danger);
        }

        /* Sound Presets Table */
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
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.725rem;
          color: var(--accent);
          font-weight: 600;
        }

        .presets-table {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          overflow: hidden;
        }

        .preset-entry {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          gap: 12px;
          transition: background-color var(--duration-fast) ease;
        }

        .preset-entry:last-child {
          border-bottom: none;
        }

        .preset-entry:hover {
          background: var(--bg-hover);
        }

        .preset-entry.selected {
          background: var(--bg-subtle);
        }

        .entry-marker {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .mono-idx {
          font-size: 0.7rem;
          color: var(--text-faint);
        }

        .radio-pip {
          font-size: 0.8rem;
          color: var(--accent);
        }

        .entry-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .entry-name {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .entry-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .entry-status-badge {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          background: var(--accent-light);
          color: var(--accent);
          border: 1px solid var(--accent-border);
          letter-spacing: var(--tracking-wide);
        }

        .upload-action-row {
          display: flex;
          padding-top: 4px;
        }

        .btn-action-dashed {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          background: var(--bg-surface);
          border: 1px dashed var(--border);
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 600;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .btn-action-dashed:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-light);
        }

        /* Theme Selector */
        .theme-selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }

        .theme-option {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 1rem;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .theme-option:hover {
          border-color: var(--border-strong);
          background: var(--bg-hover);
        }

        .theme-option.selected {
          border-color: var(--accent);
          background: var(--bg-subtle);
        }

        .theme-preview {
          height: 60px;
          border: 1px solid var(--border);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px;
        }

        .theme-preview.light-preview {
          background: #FAF8F5;
          color: #181716;
        }

        .theme-preview.dark-preview {
          background: #181716;
          color: #F0ECE1;
        }

        .preview-rule {
          height: 2px;
          background: var(--accent);
          width: 24px;
        }

        .preview-stamp {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
        }

        .theme-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .theme-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .theme-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .theme-check {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent);
        }

        /* Storage Box */
        .storage-card-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 1rem 1.15rem;
          background: var(--bg-subtle);
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
        }

        .storage-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .storage-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .storage-numbers {
          font-size: 0.775rem;
          color: var(--text-secondary);
        }

        .precision-rail-track {
          width: 100%;
          height: 4px;
          background: var(--bg-surface-sunken);
          border-radius: 1px;
          overflow: hidden;
        }

        .precision-rail-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .storage-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-heading);
          font-size: 0.675rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: var(--tracking-wide);
        }

        /* Action Buttons Strip */
        .action-buttons-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 680px) {
          .settings-document-container {
            padding: 1.25rem 1rem;
            gap: 1.75rem;
          }

          .fields-grid {
            grid-template-columns: 1fr;
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

          .action-buttons-strip button {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
