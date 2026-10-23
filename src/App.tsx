import { useCallback, useEffect, useState } from 'react';
import { useStored } from './lib/useStored';
import { useTimer } from './lib/useTimer';
import { chime } from './lib/sound';
import { dayKey, daysUntil, dueLabel, formatClock, formatMinutes } from './lib/dates';
import { DEFAULT_SETTINGS, MODE_LABEL, type Deadline, type Mode, type Session, type Settings, type Task, type Theme } from './lib/types';
import TimerCard from './components/TimerCard';
import TasksCard from './components/TasksCard';
import DeadlinesCard from './components/DeadlinesCard';
import WeekCard from './components/WeekCard';
import NotesCard from './components/NotesCard';
import FocusOverlay from './components/FocusOverlay';
import { MoonIcon, SunIcon } from './components/icons';

const KEEP_DAYS = 120; // focus history older than this is dropped

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

export default function App() {
  const [storedSettings, setSettings] = useStored<Settings>('settings', DEFAULT_SETTINGS);
  const settings = { ...DEFAULT_SETTINGS, ...storedSettings };
  const [tasks, setTasks] = useStored<Task[]>('tasks', []);
  const [currentTaskId, setCurrentTaskId] = useStored<string | null>('currentTask', null);
  const [sessions, setSessions] = useStored<Session[]>('sessions', []);
  const [deadlines, setDeadlines] = useStored<Deadline[]>('deadlines', []);
  const [notes, setNotes] = useStored('notes', '');
  const [theme, setTheme] = useStored<Theme>('theme', 'system');
  const [focusMode, setFocusMode] = useState(false);
  const now = useNow(15_000);

  const onComplete = useCallback(
    (mode: Mode) => {
      if (mode === 'focus') {
        const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
        setSessions((all) => [
          ...all.filter((s) => new Date(s.at).getTime() >= cutoff),
          { at: new Date().toISOString(), minutes: settings.focus, taskId: currentTaskId },
        ]);
        if (currentTaskId) {
          setTasks((all) => all.map((t) => (t.id === currentTaskId ? { ...t, sessions: t.sessions + 1 } : t)));
        }
      }
      chime();
      if (settings.notify && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(mode === 'focus' ? 'Focus session done' : 'Break is over', {
          body: mode === 'focus' ? 'Take a breather.' : 'Ready for the next focus session?',
        });
      }
    },
    [settings.focus, settings.notify, currentTaskId, setSessions, setTasks]
  );

  const timer = useTimer(settings, onComplete);

  // Theme: follow the system unless the user picked one.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [theme]);
  const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  // The tab title shows the countdown, so it can be watched from another tab.
  useEffect(() => {
    document.title = timer.running ? `${formatClock(timer.left)} · ${MODE_LABEL[timer.mode]} · StudySesh` : 'StudySesh';
  }, [timer.running, timer.left, timer.mode]);

  // Space starts or pauses, F toggles focus mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === 'Space') {
        e.preventDefault();
        timer.toggle();
      } else if (e.key === 'f' || e.key === 'F') {
        setFocusMode((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [timer]);

  // Keep the selected task valid if it was finished or deleted elsewhere.
  const currentTask = tasks.find((t) => t.id === currentTaskId && !t.done) ?? null;

  // The title row's one line, built from the same data as the cards.
  const todayKey = dayKey(now);
  const todayMinutes = sessions.filter((s) => dayKey(new Date(s.at)) === todayKey).reduce((a, s) => a + s.minutes, 0);
  const doneCount = tasks.filter((t) => t.done).length;
  const next = [...deadlines].filter((d) => daysUntil(d.due, now) >= 0).sort((a, b) => a.due.localeCompare(b.due))[0];
  const summary = [
    `${formatMinutes(todayMinutes)} focused today`,
    tasks.length ? `${doneCount} of ${tasks.length} tasks done` : null,
    next ? `${next.title} ${dueLabel(next.due, now).replace(/^Due/, 'due')}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <header className="bar">
        <div className="brand">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="brand__mark">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
            <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>StudySesh</span>
        </div>
        <div className="bar__right">
          <span className="bar__clock num">
            {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" className="btn btn--small" onClick={() => setFocusMode(true)}>
            Focus mode
          </button>
        </div>
      </header>

      <main className="page">
        <div className="title-row">
          <h1>Today</h1>
          <p>{summary}</p>
        </div>

        {/* 12-column grid, 16px gutters: timer 5 + tasks 4 + deadlines 3 = 12; week 5 + notes 7 = 12. */}
        <div className="grid">
          <TimerCard
            timer={timer}
            settings={settings}
            setSettings={setSettings}
            tasks={tasks}
            currentTaskId={currentTask?.id ?? null}
            setCurrentTaskId={setCurrentTaskId}
            onFocusMode={() => setFocusMode(true)}
          />
          <TasksCard tasks={tasks} setTasks={setTasks} currentTaskId={currentTask?.id ?? null} setCurrentTaskId={setCurrentTaskId} />
          <DeadlinesCard deadlines={deadlines} setDeadlines={setDeadlines} today={now} />
          <WeekCard sessions={sessions} today={now} />
          <NotesCard notes={notes} setNotes={setNotes} />
        </div>

      </main>

      {focusMode && <FocusOverlay timer={timer} taskTitle={currentTask?.title ?? null} onExit={() => setFocusMode(false)} />}
    </>
  );
}
