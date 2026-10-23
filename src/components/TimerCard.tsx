import { useEffect, useRef, useState } from 'react';
import type { Timer } from '../lib/useTimer';
import { MODE_LABEL, type Mode, type Settings, type Task } from '../lib/types';
import { formatClock } from '../lib/dates';
import { playNoise, setNoiseVolume, type Noise } from '../lib/sound';
import { useStored } from '../lib/useStored';
import { ExpandIcon, PauseIcon, PlayIcon, ResetIcon, SettingsIcon, SkipIcon } from './icons';

type Props = {
  timer: Timer;
  settings: Settings;
  setSettings: (s: Settings) => void;
  tasks: Task[];
  currentTaskId: string | null;
  setCurrentTaskId: (id: string | null) => void;
  onFocusMode: () => void;
};

export function Ring({ timer, size }: { timer: Timer; size: number }) {
  const stroke = Math.max(4, size / 40);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = timer.total ? 1 - timer.left / timer.total : 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} className="ring__track" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="ring__fill"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

const MODES: Mode[] = ['focus', 'short', 'long'];

function SettingsPopover({ settings, setSettings, onClose }: { settings: Settings; setSettings: (s: Settings) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const minutes = (key: 'focus' | 'short' | 'long' | 'longEvery', label: string, max: number) => (
    <label className="field field--inline">
      <span>{label}</span>
      <input
        type="number"
        min={1}
        max={max}
        value={settings[key]}
        onChange={(e) => {
          const v = Math.round(Number(e.target.value));
          if (v >= 1 && v <= max) setSettings({ ...settings, [key]: v });
        }}
      />
    </label>
  );

  const toggleNotify = async (on: boolean) => {
    if (on && 'Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') return;
    }
    setSettings({ ...settings, notify: on && 'Notification' in window && Notification.permission === 'granted' });
  };

  return (
    <div className="popover" ref={ref} role="dialog" aria-label="Timer settings">
      <p className="popover__title">Timer settings</p>
      {minutes('focus', 'Focus (min)', 180)}
      {minutes('short', 'Short break (min)', 60)}
      {minutes('long', 'Long break (min)', 90)}
      {minutes('longEvery', 'Long break after', 12)}
      <label className="check">
        <input type="checkbox" checked={settings.autoStart} onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })} />
        Start the next session automatically
      </label>
      <label className="check">
        <input type="checkbox" checked={settings.notify} onChange={(e) => void toggleNotify(e.target.checked)} />
        Notify me when a session ends
      </label>
    </div>
  );
}

export default function TimerCard({ timer, settings, setSettings, tasks, currentTaskId, setCurrentTaskId, onFocusMode }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [noise, setNoise] = useState<Noise>('off'); // never auto-plays after a reload
  const [volume, setVolume] = useStored('volume', 0.4);
  const open = tasks.filter((t) => !t.done);

  useEffect(() => {
    playNoise(noise, volume);
    // Volume changes are applied without restarting the sound.
  }, [noise]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setNoiseVolume(volume), [volume]);
  useEffect(() => () => playNoise('off', 0), []);

  return (
    <section className="card timer" aria-labelledby="timer-title">
      <header className="card__head">
        <h2 id="timer-title">Timer</h2>
        <div className="card__actions">
          <button type="button" className="icon-btn" onClick={onFocusMode} aria-label="Focus mode">
            <ExpandIcon />
          </button>
          <div className="popover-anchor">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowSettings((v) => !v)}
              aria-label="Timer settings"
              aria-expanded={showSettings}
            >
              <SettingsIcon />
            </button>
            {showSettings && <SettingsPopover settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}
          </div>
        </div>
      </header>

      <div className="segmented" role="tablist" aria-label="Session type">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={timer.mode === m}
            className={timer.mode === m ? 'is-on' : ''}
            onClick={() => timer.switchMode(m)}
          >
            {MODE_LABEL[m]} <span className="muted num">{settings[m]}</span>
          </button>
        ))}
      </div>

      <div className="timer__body">
        <div className="timer__dial">
          <Ring timer={timer} size={208} />
          <div className="timer__readout">
            <span className="timer__time num" aria-live="off">{formatClock(timer.left)}</span>
            <span className="timer__meta">
              {timer.mode === 'focus' ? `Session ${timer.sessionNumber} of ${settings.longEvery}` : MODE_LABEL[timer.mode]}
            </span>
          </div>
        </div>

        <div className="timer__side">
          <label className="field">
            <span>Working on</span>
            <select value={currentTaskId ?? ''} onChange={(e) => setCurrentTaskId(e.target.value || null)}>
              <option value="">Nothing in particular</option>
              {open.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </label>

          <div className="controls">
            <button type="button" className="btn btn--primary" onClick={timer.toggle}>
              {timer.running ? <PauseIcon /> : <PlayIcon />}
              {timer.running ? 'Pause' : timer.left < timer.total ? 'Resume' : 'Start'}
            </button>
            <button type="button" className="btn" onClick={timer.reset} aria-label="Reset">
              <ResetIcon />
            </button>
            <button type="button" className="btn" onClick={timer.skip} aria-label="Skip to next session">
              <SkipIcon />
            </button>
          </div>

          <div className="sound">
            <label className="field">
              <span>Focus sound</span>
              <select value={noise} onChange={(e) => setNoise(e.target.value as Noise)}>
                <option value="off">Off</option>
                <option value="brown">Brown noise</option>
                <option value="pink">Pink noise</option>
                <option value="white">White noise</option>
              </select>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Sound volume"
              disabled={noise === 'off'}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
