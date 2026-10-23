import React, { useState, useEffect } from 'react';

type ViewOffOverlayProps = {
    view: boolean;
};

const ViewOffOverlay: React.FC<ViewOffOverlayProps> = ({ view }) => {
    const [now, setNow] = useState(() => new Date());
    const [currentTab, setCurrentTab] = useState('Clock');
    const [currentView, setCurrentView] = useState(view);
    
    useEffect(() => {
        setCurrentView(view);
    }, [view]);

    useEffect(() => {
        if (!currentView) {
            setNow(new Date());
            const interval = setInterval(() => setNow(new Date()), 1000);
            return () => clearInterval(interval);
        }

        return () => {
        // no active interval when the dashboard is visible
        };
    }, [currentView]);
    const clockTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const clockDate = now.toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const tabOptions = [
        { id: 'Clock', label: 'Clock' },
        { id: 'Timer', label: 'Timer' },
    ] as const;

    return (
        <div
            className={`absolute inset-0 flex items-center justify-center px-6 transition-all duration-500 ${
                currentView
                    ? 'opacity-0 translate-y-6 scale-95 pointer-events-none ease-in'
                    : 'opacity-100 translate-y-0 scale-100 pointer-events-auto ease-out'
            }`}
        >
            <div className="max-w-3xl absolute w-full glass border border-[rgba(255,255,255,0.05)] rounded-3xl p-10 md:p-14 shadow-[0_25px_60px_rgba(49,40,68,0.45)] backdrop-blur-lg text-center space-y-8">
                <nav className="flex justify-center gap-3 text-sm font-medium">
                    {tabOptions.map((tab) => {
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setCurrentTab(tab.id)}
                                aria-pressed={isActive}
                                className={`px-5 py-2.5 rounded-2xl transition-all duration-300 backdrop-blur-sm ${
                                    isActive
                                        ? 'bg-[rgba(203,166,247,0.2)] border-[rgba(203,166,247,0.45)] text-[var(--lavender)] shadow-[0_0_18px_rgba(203,166,247,0.45)]'
                                        : 'bg-[rgba(30,30,46,0.65)] text-[var(--text-muted)] hover:text-[var(--lavender)] hover:border-[rgba(203,166,247,0.25)] hover:bg-[rgba(49,50,68,0.85)]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="space-y-4">
                    <p className="text-6xl md:text-8xl font-semibold font-mono text-[var(--lavender)] drop-shadow-[0_0_22px_rgba(203,166,247,0.55)]" aria-live="polite">
                        {clockTime}
                    </p>
                    <p className="text-lg md:text-xl text-[var(--text-muted)] tracking-[0.35em] uppercase">
                        {clockDate}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewOffOverlay;
