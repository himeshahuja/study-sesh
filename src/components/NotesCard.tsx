type Props = { notes: string; setNotes: (s: string) => void };

export default function NotesCard({ notes, setNotes }: Props) {
  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  return (
    <section className="card notes" aria-labelledby="notes-title">
      <header className="card__head">
        <h2 id="notes-title">Notes</h2>
        <span className="card__count num">{words ? `${words} ${words === 1 ? 'word' : 'words'}` : ''}</span>
      </header>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write anything"
        aria-label="Notes"
        spellCheck
      />
    </section>
  );
}
