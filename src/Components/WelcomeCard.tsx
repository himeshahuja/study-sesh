import React, { useEffect, useState } from 'react';

const greetingFor = (hour: number) => {
    if (hour < 5) return 'Burning the midnight oil';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const WelcomeCard: React.FC = () => {
    const [now, setNow] = useState(() => new Date());

    // Refresh once a minute so the greeting and date stay current.
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);

    const date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div>
            <div className="text-xl font-bold neon" style={{ color: 'var(--cp-text)' }}>
                {greetingFor(now.getHours())}
            </div>
            <div className="text-sm text-[var(--cp-muted)] mt-1">{date}</div>
            <p className="mt-5 text-sm text-[var(--cp-muted)]">
                Welcome to StudySesh. Start the timer when you are ready to focus.
            </p>
        </div>
    );
};

export default WelcomeCard;
