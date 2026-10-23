import type { Session } from '../lib/types';
import { addDays, dayKey, formatMinutes } from '../lib/dates';

type Props = { sessions: Session[]; today: Date };

// Minutes of focus per local day.
function minutesByDay(sessions: Session[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const s of sessions) {
    const key = dayKey(new Date(s.at));
    out.set(key, (out.get(key) ?? 0) + s.minutes);
  }
  return out;
}

// Consecutive days with focus, ending today (or yesterday, if today has none yet).
function streak(byDay: Map<string, number>, today: Date): number {
  let day = byDay.get(dayKey(today)) ? today : addDays(today, -1);
  let n = 0;
  while (byDay.get(dayKey(day))) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export default function WeekCard({ sessions, today }: Props) {
  const byDay = minutesByDay(sessions);
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const values = days.map((d) => byDay.get(dayKey(d)) ?? 0);
  const week = values.reduce((a, b) => a + b, 0);
  const todayMin = values[6];
  const days_ = streak(byDay, today);
  const sessionsToday = sessions.filter((s) => dayKey(new Date(s.at)) === dayKey(today)).length;

  // Round the scale up to a whole half hour so the gridlines land on clean times.
  const max = Math.max(60, Math.ceil(Math.max(...values) / 30) * 30);
  const ticks = [max, max / 2, 0];

  return (
    <section className="card week" aria-labelledby="week-title">
      <header className="card__head">
        <h2 id="week-title">Last 7 days</h2>
      </header>

      <dl className="kpis">
        <div>
          <dt>Today</dt>
          <dd className="num">{formatMinutes(todayMin)}</dd>
          <span className="kpis__sub num">{sessionsToday} {sessionsToday === 1 ? 'session' : 'sessions'}</span>
        </div>
        <div>
          <dt>This week</dt>
          <dd className="num">{formatMinutes(week)}</dd>
          <span className="kpis__sub">Last 7 days</span>
        </div>
        <div>
          <dt>Streak</dt>
          <dd className="num">{days_} {days_ === 1 ? 'day' : 'days'}</dd>
          <span className="kpis__sub">{days_ ? 'In a row' : 'No sessions yet'}</span>
        </div>
      </dl>

      <div className="chart" role="img" aria-label={`Focus minutes per day for the last 7 days: ${values.join(', ')}.`}>
        <div className="chart__plot">
          {ticks.map((t) => (
            <div key={t} className="chart__grid" style={{ bottom: `${(t / max) * 100}%` }}>
              <span className="num">{t === 0 ? '0' : formatMinutes(t)}</span>
            </div>
          ))}
          <div className="chart__bars">
            {values.map((v, i) => (
              <div key={i} className="chart__col">
                <div className={`chart__bar ${i === 6 ? 'is-today' : ''}`} style={{ height: `${(v / max) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="chart__labels">
          {days.map((d, i) => (
            <span key={i} className={i === 6 ? 'is-today' : ''}>
              {i === 6 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
