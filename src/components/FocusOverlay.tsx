import { useEffect } from 'react';
import type { Timer } from '../lib/useTimer';
import { MODE_LABEL } from '../lib/types';
import { formatClock } from '../lib/dates';
import { Ring } from './TimerCard';
import { PauseIcon, PlayIcon, SkipIcon } from './icons';

type Props = { timer: Timer; taskTitle: string | null; onExit: () => void };

// Everything but the timer goes away.
export default function FocusOverlay({ timer, taskTitle, onExit }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onExit();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onExit]);

  return (
    <div className="focus" role="dialog" aria-modal="true" aria-label="Focus mode">
      <div className="focus__dial">
        <Ring timer={timer} size={Math.min(440, Math.round(window.innerWidth * 0.8))} />
        <div className="focus__readout">
          <span className="focus__mode">{MODE_LABEL[timer.mode]}</span>
          <span className="focus__time num">{formatClock(timer.left)}</span>
          {taskTitle && <span className="focus__task">{taskTitle}</span>}
        </div>
      </div>
      <div className="controls">
        <button type="button" className="btn btn--primary" onClick={timer.toggle}>
          {timer.running ? <PauseIcon /> : <PlayIcon />}
          {timer.running ? 'Pause' : 'Start'}
        </button>
        <button type="button" className="btn" onClick={timer.skip} aria-label="Skip to next session">
          <SkipIcon />
        </button>
      </div>
      <button type="button" className="text-btn focus__exit" onClick={onExit}>
        Exit
      </button>
    </div>
  );
}
