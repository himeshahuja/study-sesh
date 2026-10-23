export type Mode = 'focus' | 'short' | 'long';

export type Settings = {
  focus: number; // minutes
  short: number;
  long: number;
  longEvery: number; // a long break after this many focus sessions
  autoStart: boolean;
  notify: boolean;
};

export type Task = {
  id: string;
  title: string;
  done: boolean;
  sessions: number; // focus sessions completed while this task was selected
};

export type Session = {
  at: string; // ISO time the session ended
  minutes: number;
  taskId: string | null;
};

export type Deadline = {
  id: string;
  title: string;
  due: string; // YYYY-MM-DD
};

export type Theme = 'system' | 'light' | 'dark';

export const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  autoStart: false,
  notify: false,
};

export const MODE_LABEL: Record<Mode, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
};
