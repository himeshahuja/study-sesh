import { useState, type FormEvent } from 'react';
import type { Deadline } from '../lib/types';
import { newId } from '../lib/useStored';
import { dayKey, daysUntil, dueLabel, fromKey } from '../lib/dates';
import { CloseIcon } from './icons';

type Props = {
  deadlines: Deadline[];
  setDeadlines: (fn: (d: Deadline[]) => Deadline[]) => void;
  today: Date;
};

export default function DeadlinesCard({ deadlines, setDeadlines, today }: Props) {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState(dayKey(today));
  const sorted = [...deadlines].sort((a, b) => a.due.localeCompare(b.due));

  const add = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || !due) return;
    setDeadlines((all) => [...all, { id: newId(), title: t, due }]);
    setTitle('');
  };

  return (
    <section className="card deadlines" aria-labelledby="deadlines-title">
      <header className="card__head">
        <h2 id="deadlines-title">Deadlines</h2>
        {deadlines.length > 0 && (
          <span className="card__count num">{deadlines.filter((d) => daysUntil(d.due, today) >= 0).length} upcoming</span>
        )}
      </header>

      <form className="add add--stack" onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a deadline" aria-label="Deadline name" />
        <div className="add__row">
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date" />
          <button type="submit" className="btn">Add</button>
        </div>
      </form>

      <div className="scroll">
        {sorted.length === 0 ? (
          <p className="empty">Nothing due.</p>
        ) : (
          <ul className="list">
            {sorted.map((d) => {
              const n = daysUntil(d.due, today);
              return (
                <li key={d.id} className="deadline">
                  <div className="deadline__text">
                    <span className="deadline__title">{d.title}</span>
                    <span className={`deadline__when ${n < 0 ? 'is-overdue' : n <= 2 ? 'is-soon' : ''}`}>
                      {dueLabel(d.due, today)}
                      <span className="muted"> · {fromKey(d.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="icon-btn icon-btn--quiet"
                    onClick={() => setDeadlines((all) => all.filter((x) => x.id !== d.id))}
                    aria-label={`Delete "${d.title}"`}
                  >
                    <CloseIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
