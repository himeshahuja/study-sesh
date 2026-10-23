import { useState, type FormEvent } from 'react';
import type { Task } from '../lib/types';
import { newId } from '../lib/useStored';
import { CheckIcon, CloseIcon } from './icons';

type Props = {
  tasks: Task[];
  setTasks: (fn: (tasks: Task[]) => Task[]) => void;
  currentTaskId: string | null;
  setCurrentTaskId: (id: string | null) => void;
};

export default function TasksCard({ tasks, setTasks, currentTaskId, setCurrentTaskId }: Props) {
  const [title, setTitle] = useState('');
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const add = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const task: Task = { id: newId(), title: t, done: false, sessions: 0 };
    setTasks((all) => [...all, task]);
    if (!currentTaskId) setCurrentTaskId(task.id);
    setTitle('');
  };

  const toggle = (id: string) => {
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    if (id === currentTaskId) setCurrentTaskId(null);
  };

  const remove = (id: string) => {
    setTasks((all) => all.filter((t) => t.id !== id));
    if (id === currentTaskId) setCurrentTaskId(null);
  };

  const row = (t: Task) => (
    <li key={t.id} className={`task ${t.done ? 'is-done' : ''} ${t.id === currentTaskId ? 'is-current' : ''}`}>
      <button
        type="button"
        className="task__check"
        onClick={() => toggle(t.id)}
        aria-label={t.done ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`}
        aria-pressed={t.done}
      >
        {t.done && <CheckIcon />}
      </button>
      <button
        type="button"
        className="task__title"
        onClick={() => !t.done && setCurrentTaskId(t.id === currentTaskId ? null : t.id)}
        disabled={t.done}
      >
        {t.title}
      </button>
      <span className="task__meta num">
        {t.id === currentTaskId ? 'Now' : t.sessions ? `${t.sessions} × focus` : ''}
      </span>
      <button type="button" className="icon-btn icon-btn--quiet" onClick={() => remove(t.id)} aria-label={`Delete "${t.title}"`}>
        <CloseIcon />
      </button>
    </li>
  );

  return (
    <section className="card tasks" aria-labelledby="tasks-title">
      <header className="card__head">
        <h2 id="tasks-title">Tasks</h2>
        {tasks.length > 0 && <span className="card__count num">{done.length} of {tasks.length} done</span>}
      </header>

      <form className="add" onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" aria-label="New task" />
      </form>

      <div className="scroll">
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet.</p>
        ) : (
          <>
            <ul className="list">{open.map(row)}</ul>
            {done.length > 0 && (
              <>
                <div className="list__sub">
                  <span>Done</span>
                  <button type="button" className="text-btn" onClick={() => setTasks((all) => all.filter((t) => !t.done))}>
                    Clear
                  </button>
                </div>
                <ul className="list">{done.map(row)}</ul>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
