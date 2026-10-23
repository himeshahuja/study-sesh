import { useState, useEffect, type FC, useMemo } from 'react';

const accentThemes = [
    {
        id: 'mauve',
        label: 'Mauve Pulse',
        primary: '#cba6f7',
        secondary: '#f5c2e7',
        glow: 'rgba(203, 166, 247, 0.35)',
    },
] as const;

const TimerComponent: FC = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const accentTheme = accentThemes[0];

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setSeconds((prev) => (prev > 0 ? prev - 1 : prev));
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        if (seconds === 0 && isActive) {
            setIsFlashing(true);
            const timeout = window.setTimeout(() => setIsFlashing(false), 900);
            return () => window.clearTimeout(timeout);
        }
        return () => void 0;
    }, [seconds, isActive]);

    useEffect(() => {
        if (seconds === 0) setIsActive(false);
    }, [seconds]);

    const toggleTimer = () => setIsActive((prev) => !prev);

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(0);
        setIsFlashing(false);
    };

    const isReady = seconds === 0 && !isActive;

    const timeParts = useMemo(() => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainder = seconds % 60;
        return {
            hours,
            minutes,
            remainder,
        };
    }, [seconds]);

    const updateFromParts = (hoursValue: number, minutesValue: number, secondsValue: number) => {
        const boundedMinutes = Math.min(59, Math.max(0, minutesValue));
        const boundedSeconds = Math.min(59, Math.max(0, secondsValue));
        const boundedHours = Math.max(0, hoursValue);
        const total = boundedHours * 3600 + boundedMinutes * 60 + boundedSeconds;
        setSeconds(total);
        setIsActive(false);
    };

    const adjustUnit = (unit: 'hours' | 'minutes' | 'seconds', delta: number) => {
        const { hours, minutes, remainder } = timeParts;
        if (unit === 'hours') {
            updateFromParts(Math.max(0, hours + delta), minutes, remainder);
            return;
        }
        if (unit === 'minutes') {
            updateFromParts(hours, Math.min(59, Math.max(0, minutes + delta)), remainder);
            return;
        }
        updateFromParts(hours, minutes, Math.min(59, Math.max(0, remainder + delta)));
    };    

    const accentGradient = useMemo(
        () => `linear-gradient(120deg, ${accentTheme.primary}, ${accentTheme.secondary}, #89dceb)`,
        [accentTheme.primary, accentTheme.secondary]
    );

    const timeToggles = [
        { id: 'hours', label: 'Hours', value: timeParts.hours, unit: 'hours' as const },
        { id: 'minutes', label: 'Minutes', value: timeParts.minutes, unit: 'minutes' as const },
        { id: 'seconds', label: 'Seconds', value: timeParts.remainder, unit: 'seconds' as const },
    ];
    return (
        <div
            className="glass relative flex h-full flex-col overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.06)] p-3 shadow-xl transition-all duration-200"
            style={{ background: `radial-gradient(circle at 20% 12%, ${accentTheme.glow}, rgba(17,17,27,0.92))` }}
        >
            <span
                className="pointer-events-none absolute -left-16 -top-12 h-48 w-48 rounded-full blur-[110px]"
                style={{ background: accentTheme.glow }}
                aria-hidden
            />
            <span
                className="pointer-events-none absolute -right-10 top-1/3 h-40 w-40 rounded-full blur-[120px]"
                style={{ background: 'rgba(9,167,219,0.25)' }}
                aria-hidden
            />

            <div className="relative flex flex-col gap-5" aria-live="polite">
                <div className="grid grid-cols-3 gap-4 mt-3">
                    {timeToggles.map(({ id, label, value, unit }) => {
                        const disableDecrease = value <= 0;
                        const disableIncrease = unit === 'hours' ? false : value >= 59;
                        return (
                            <div
                                key={id}
                                className="flex flex-col items-center gap-3 text-center "
                            >
                                <button
                                    type="button"
                                    onClick={() => adjustUnit(unit, 1)}
                                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-sm text-white transition hover:border-white/40 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-40"
                                    disabled={disableIncrease || isActive || isFlashing}
                                    aria-label={`Increase ${label}`}
                                >
                                    &uarr;
                                </button>
                                <div
                                    className={`ml-3 text-4xl font-semibold tracking-[0.35em] ${
                                        isFlashing ? 'timer-flash-text' : 'text-white'
                                    }`}
                                >
                                    {value.toString().padStart(2, '0')}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => adjustUnit(unit, -1)}
                                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-sm text-white transition hover:border-white/40 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-40"
                                    disabled={disableDecrease || isActive || isFlashing}
                                    aria-label={`Decrease ${label}`}
                                >
                                    &darr;
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
                    <button
                        type="button"
                        onClick={toggleTimer}
                        disabled={isReady}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(203,166,247,0.45)] disabled:translate-y-0 disabled:opacity-50"
                        style={{
                            backgroundImage: accentGradient,
                            boxShadow: `0 18px 35px ${accentTheme.glow}`,
                        }}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                        type="button"
                        onClick={resetTimer}
                        disabled={isReady && !isFlashing}
                        className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--cp-text)] transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};


export default TimerComponent;