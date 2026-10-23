import { useCallback, useEffect, useRef, useState } from 'react';
import { useStored } from './useStored';
import type { Mode, Settings } from './types';

type TimerState = {
  mode: Mode;
  running: boolean;
  endAt: number; // epoch ms, while running
  remaining: number; // seconds, while paused
  cycle: number; // focus sessions finished since the last long break
};

// The timer counts down to a fixed end time rather than ticking a counter, so
// it stays right in a background tab and survives a reload mid-session.
export function useTimer(settings: Settings, onComplete: (mode: Mode) => void) {
  const full = useCallback((mode: Mode) => settings[mode] * 60, [settings]);

  const [state, setState] = useStored<TimerState>('timer', {
    mode: 'focus',
    running: false,
    endAt: 0,
    remaining: settings.focus * 60,
    cycle: 0,
  });
  const [now, setNow] = useState(() => Date.now());
  const completedAt = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.running]);

  const left = state.running ? Math.max(0, Math.ceil((state.endAt - now) / 1000)) : state.remaining;

  const nextMode = useCallback(
    (s: TimerState, finishedFocus: boolean): Pick<TimerState, 'mode' | 'cycle'> => {
      if (s.mode !== 'focus') return { mode: 'focus', cycle: s.cycle };
      const cycle = finishedFocus ? s.cycle + 1 : s.cycle;
      if (finishedFocus && cycle >= settings.longEvery) return { mode: 'long', cycle: 0 };
      return { mode: 'short', cycle };
    },
    [settings.longEvery]
  );

  // A session ends: report it once, then move on to the next mode.
  useEffect(() => {
    if (!state.running || state.endAt > now || completedAt.current === state.endAt) return;
    completedAt.current = state.endAt;
    onCompleteRef.current(state.mode);
    const next = nextMode(state, true);
    setState({
      ...next,
      running: settings.autoStart,
      endAt: Date.now() + full(next.mode) * 1000,
      remaining: full(next.mode),
    });
  }, [now, state, settings.autoStart, full, nextMode, setState]);

  // New lengths apply right away to a session that isn't running. Only when
  // they actually change, so a reload never resets a paused session.
  const lengths = `${settings.focus}/${settings.short}/${settings.long}`;
  const lastLengths = useRef(lengths);
  useEffect(() => {
    if (lastLengths.current === lengths) return;
    lastLengths.current = lengths;
    setState((s) => (s.running ? s : { ...s, remaining: full(s.mode) }));
  }, [lengths, full, setState]);

  const start = () => setState((s) => ({ ...s, running: true, endAt: Date.now() + s.remaining * 1000 }));
  const pause = () => setState((s) => ({ ...s, running: false, remaining: left }));
  const toggle = () => (state.running ? pause() : start());
  const reset = () => setState((s) => ({ ...s, running: false, remaining: full(s.mode) }));
  const skip = () =>
    setState((s) => {
      const next = nextMode(s, false);
      return { ...next, running: false, endAt: 0, remaining: full(next.mode) };
    });
  const switchMode = (mode: Mode) =>
    setState((s) => ({ ...s, mode, running: false, endAt: 0, remaining: full(mode) }));

  return {
    mode: state.mode,
    running: state.running,
    left,
    total: full(state.mode),
    sessionNumber: state.cycle + 1,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
  };
}

export type Timer = ReturnType<typeof useTimer>;
