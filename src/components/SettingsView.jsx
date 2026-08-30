import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { playCompletionSound } from '../utils/audio';
import { getStorageMetrics } from '../utils/db';
import { Volume2, VolumeX, RotateCcw, Download, User, Sparkles, Music, Upload, Check, Play, LogOut, Database, HardDrive } from 'lucide-react';

const SOUND_PRESETS = [
  { id: 'chime', label: '🔔 Zen Chime', desc: 'Serene dual-frequency chime' },
  { id: 'bell', label: '🔮 Crystal Bell', desc: 'Resonant high crystal bell tone' },
  { id: 'pop', label: '🫧 Bubble Pop', desc: 'Playful crisp bubble pop' },
  { id: 'success', label: '🎉 Level Up Triad', desc: 'Vibrant tri-tone achievement chord' },
  { id: 'marimba', label: '🪵 Wooden Marimba', desc: 'Deep organic wood block chime' },
  { id: 'custom', label: '📁 Upload Custom System Audio...', desc: 'Set your own .mp3, .wav or .ogg file from computer' },
];

export default function SettingsView() {
  const { user, settings, updateUser, updateSettings, resetData, logoutUser, tasks, activityLog } = useApp();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || user.name.charAt(0));
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  const [soundPreset, setSoundPreset] = useState(settings.soundPreset || 'chime');
  const [customSoundUri, setCustomSoundUri] = useState(settings.customSoundUri || null);
  const [customSoundName, setCustomSoundName] = useState(settings.customSoundName || null);

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
    e.preventDefault();
    updateUser({ name, avatar: avatar.toUpperCase() });
    updateSettings({
      dailyGoal: Number(dailyGoal),
      soundEnabled,
      soundPreset,
      customSoundUri,
      customSoundName,
    });
  };

  const handleTestAudio = () => {
    playCompletionSound(true, soundPreset, customSoundUri);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read audio file as Base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result;
      if (dataUri) {
        setCustomSoundUri(dataUri);
        setCustomSoundName(file.name);
        setSoundPreset('custom');
        // Preview uploaded audio immediately
        playCompletionSound(true, 'custom', dataUri);
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
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `momentum_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="settings-container">
      <div className="section-header">
        <h1 className="main-title">Settings</h1>
      </div>

      <form onSubmit={handleSaveProfile} className="settings-section glass-card">
        <h3 className="section-title">
          <User size={18} /> Profile & Preferences
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarthak"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Initials</label>
            <input
              type="text"
              className="form-input avatar-input"
              maxLength={2}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="S"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Daily Goal (Tasks)</label>
            <input
              type="number"
              min={1}
              max={20}
              className="form-input"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
            />
          </div>
        </div>

        {/* Completion Sound Options */}
        <div className="sound-settings-group">
          <div className="setting-row">
            <div className="setting-label-group">
              {soundEnabled ? <Volume2 size={20} className="icon-mint" /> : <VolumeX size={20} className="icon-muted" />}
              <div>
                <div className="setting-heading">Completion Sound</div>
                <div className="setting-sub">Play audio feedback upon completing a task</div>
              </div>
            </div>
            <div className="audio-actions">
              <button
                type="button"
                className="btn-test-audio"
                onClick={handleTestAudio}
              >
                <Play size={13} /> Test Sound
              </button>
              <button
                type="button"
                className={`toggle-switch ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>

          {/* Sound Presets Dropdown & Selector */}
          {soundEnabled && (
            <div className="preset-selector-box">
              <div className="preset-label-row">
                <label className="form-label"><Music size={14} /> Sound Preset & Custom Audio</label>
                {customSoundName && soundPreset === 'custom' && (
                  <span className="uploaded-tag">
                    <Check size={12} /> {customSoundName}
                  </span>
                )}
              </div>

              <div className="preset-options-grid">
                {SOUND_PRESETS.map((preset) => {
                  const isSelected = soundPreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`preset-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (preset.id === 'custom') {
                          fileInputRef.current?.click();
                        } else {
                          setSoundPreset(preset.id);
                          playCompletionSound(true, preset.id);
                        }
                      }}
                    >
                      <div className="preset-label">{preset.label}</div>
                      <div className="preset-desc">{preset.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Hidden File Input for Custom System Audio Upload */}
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <div className="upload-trigger-row">
                <button
                  type="button"
                  className="btn-upload-sound"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={14} /> Upload Custom System Audio File (.mp3, .wav)
                </button>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="btn-save">
          Save Preferences
        </button>
      </form>

      {/* Database & Storage Management Section */}
      <div className="settings-section glass-card">
        <div className="storage-header-row">
          <h3 className="section-title">
            <Database size={18} /> Storage Database & Backup
          </h3>
          <span className="db-active-badge">
            <Check size={12} /> IndexedDB Engine Active
          </span>
        </div>

        <p className="section-desc">
          Your Momentum workspace uses a high-performance <strong>IndexedDB browser database</strong> with gigabytes of local storage capacity for unlimited tasks, custom audio files, and activity logs.
        </p>

        {/* Live Storage Gauge */}
        <div className="storage-gauge-box">
          <div className="gauge-label-row">
            <span className="gauge-title"><HardDrive size={14} strokeWidth={2} /> Storage Capacity Gauge</span>
            <span className="gauge-stats">
              <strong>{storageMetrics.usedKB} KB</strong> used of {storageMetrics.quotaGB} GB available
            </span>
          </div>
          <div className="gauge-track">
            <div
              className="gauge-fill"
              style={{ width: `${Math.max(1, Math.min(100, parseFloat(storageMetrics.percentUsed) * 100))}%` }}
            />
          </div>
          <div className="gauge-sub-info">
            <span>Status: Healthy • {storageMetrics.percentUsed}% storage utilized</span>
            <span>Capacity Limit: Virtually Unlimited (~50 GB)</span>
          </div>
        </div>

        <div className="data-buttons">
          <button type="button" className="btn-outline" onClick={logoutUser}>
            <LogOut size={15} /> Sign Out / Switch Profile
          </button>
          <button type="button" className="btn-outline" onClick={handleExportData}>
            <Download size={15} /> Export Workspace Backup
          </button>
          <button type="button" className="btn-outline danger" onClick={resetData}>
            <RotateCcw size={15} /> Reset Workspace Slate
          </button>
        </div>
      </div>

      <style>{`
        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .storage-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .db-active-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-primary);
          background: var(--accent-light);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--accent-border);
        }
        .storage-gauge-box {
          background: rgba(22, 27, 34, 0.5);
          border: var(--border-light);
          border-radius: var(--radius-md);
          padding: 1rem 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gauge-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.825rem;
        }
        .gauge-title {
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .gauge-stats {
          color: var(--text-secondary);
        }
        .gauge-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }
        .gauge-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: var(--radius-pill);
          transition: width 0.3s ease;
        }
        .gauge-sub-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.725rem;
          color: var(--text-muted);
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .form-input {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: var(--border-light);
          background: var(--bg-surface-solid);
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .form-input:focus {
          border-color: var(--accent-primary);
        }
        .avatar-input {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .sound-settings-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 1rem;
          border-top: var(--border-light);
        }
        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .setting-label-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .setting-heading {
          font-weight: 600;
          font-size: 0.925rem;
        }
        .setting-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .audio-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-test-audio {
          background: rgba(46, 160, 67, 0.15);
          border: 1px solid var(--accent-border);
          color: var(--accent-primary);
          padding: 5px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
        }
        .btn-test-audio:hover {
          background: var(--accent-secondary);
          color: white;
        }
        .toggle-switch {
          width: 44px;
          height: 24px;
          border-radius: 99px;
          background: var(--bg-hover);
          border: var(--border-light);
          padding: 2px;
          cursor: pointer;
          transition: background 0.2s ease;
          position: relative;
        }
        .toggle-switch.active {
          background: var(--accent-primary);
        }
        .toggle-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }
        .toggle-switch.active .toggle-thumb {
          transform: translateX(20px);
        }
        .preset-selector-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(22, 27, 34, 0.4);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: var(--border-light);
          margin-top: 4px;
        }
        .preset-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .uploaded-tag {
          font-size: 0.75rem;
          color: var(--accent-primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .preset-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 8px;
        }
        .preset-card {
          background: var(--bg-surface-solid);
          border: var(--border-light);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .preset-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(35, 42, 56, 0.8);
        }
        .preset-card.selected {
          border-color: var(--accent-primary);
          background: rgba(46, 160, 67, 0.12);
          box-shadow: 0 0 12px rgba(46, 160, 67, 0.2);
        }
        .preset-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .preset-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .upload-trigger-row {
          display: flex;
          padding-top: 4px;
        }
        .btn-upload-sound {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-upload-sound:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: rgba(46, 160, 67, 0.1);
        }
        .btn-save {
          align-self: flex-start;
          background: var(--text-main);
          color: var(--text-inverse);
          border: none;
          padding: 9px 22px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
          margin-top: 0.5rem;
        }
        .btn-save:hover {
          opacity: 0.9;
        }
        .data-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-solid);
          border: var(--border-light);
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-outline:hover {
          color: var(--text-main);
          border-color: rgba(180, 175, 165, 0.8);
        }
        .btn-outline.danger:hover {
          color: var(--badge-coral-text);
          border-color: var(--badge-coral-border);
          background: var(--badge-coral-bg);
        }
        .icon-mint { color: var(--accent-primary); }
        .icon-muted { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
