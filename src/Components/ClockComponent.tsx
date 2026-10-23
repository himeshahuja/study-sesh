import { useEffect, useMemo, useState, type FC } from 'react';
import Clock, { type ClockOptions } from 'react-custom-clock';

const accentThemes = [
    {
        id: 'mauve',
        label: 'Mauve Pulse',
        primary: '#cba6f7',
        secondary: '#f5c2e7',
        glow: 'rgba(203, 166, 247, 0.35)',
    },
] as const;

const timezonePresets = [
    { value: 'local', label: 'System default' },
    { value: 'America/New_York', label: 'New York (ET)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Kolkata', label: 'Bengaluru (IST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
] as const;

const ClockComponent: FC = () => {
    const [baseTime, setBaseTime] = useState(() => new Date());
    const [timeZone] = useState<typeof timezonePresets[number]['value']>('local');
    const [showSeconds] = useState(true);
    const [is24Hour] = useState(false);
    const [size] = useState(150);
    const [currentTab, setCurrentTab] = useState('Analog');
    const tabOptions = [
        { id: 'Analog', label: 'Analog' },
        { id: 'Digital', label: 'Digital' },
    ] as const;


    useEffect(() => {
        const tick = window.setInterval(() => setBaseTime(new Date()), 1000);
        return () => window.clearInterval(tick);
    }, []);

    const accentTheme = accentThemes[0]

    const clockTime = useMemo(() => {
        if (timeZone === 'local') {
        return baseTime;
        }

        const localized = baseTime.toLocaleString('en-US', {
        timeZone,
        hour12: false,
        });

        return new Date(localized);
    }, [baseTime, timeZone]);

    const clockOptions = useMemo<ClockOptions>(() => {
        const secondHandOptions = showSeconds ? {
            front: {
                alignment: 'TICK' as const,
                width: 0,
                height: 0,
                radius: 0,
            },
            frontBase: {
                background: accentTheme.secondary,
                width: 3,
                height: 58,
                radius: size * 0.01,
            },
            back: {
                height: 0,
                width: 0,
            },
        }
        : { show: false as const };

        return {
            size,
            face: {
                background: `radial-gradient(circle at 30% 30%, ${accentTheme.glow} 0%, rgba(17,17,27,0.85) 60%, rgba(17,17,27,0.92) 100%)`,
                padding: 18,
                ticks: {
                    regular: { show: false },
                    secondary: {
                        background: 'rgba(255,255,255,0.18)',
                        height: 12,
                        width: 2,
                        radius: 999,
                    },
                    primary: {
                        height: 0,

                    },
                },
                counts: {
                    secondary: { show: false },
                    primary: {
                        size: 18,
                        color: 'rgba(255,255,255,0.82)',
                        background: 'transparent',
                        gap: -10,
                    },
                },
            },
            interface: {
                dynamic: true,
                transition: 320,
                pivot: {
                size: 16,
                background: accentTheme.primary,
                },
                hourHand: {
                    front: {
                        alignment: 'TICK' as const,
                        width: 0,
                        height: 0,
                        radius: 0,
                    },
                    frontBase: {
                        background: 'rgba(255,255,255,0.82)',
                        width: 5,
                        height: 36,
                        radius: size * 0.01,
                    },
                    back: {
                        height: 0,
                        width: 0,
                    }
                },
                minuteHand: {
                    front: {
                        alignment: 'TICK' as const,
                        width: 0,
                        height: 0,
                        radius: 0,
                    },
                    frontBase: {
                        background: 'rgba(255,255,255,0.82)',
                        width: 3,
                        height: 54,
                        radius: size * 0.01,
                    },
                    back: {
                        height: 0,
                        width: 0,
                    },
                },
                secondHand: secondHandOptions,
            },
        } satisfies ClockOptions;
    }, [accentTheme, showSeconds, size]);

    const formattedTime = useMemo(() => {
        const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone === 'local' ? undefined : timeZone,
        hourCycle: is24Hour ? 'h23' : 'h12',
        hour: 'numeric',
        minute: 'numeric',
        second: showSeconds ? 'numeric' : undefined,
        });
        return formatter.format(baseTime);
    }, [baseTime, is24Hour, showSeconds, timeZone]);

    const formattedDate = useMemo(() => {
        const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone === 'local' ? undefined : timeZone,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        });
        return formatter.format(baseTime);
    }, [baseTime, timeZone]);
    
    return (
        <div className="glass flex h-full flex-col rounded-3xl border border-[rgba(255,255,255,0.06)] p-3 shadow-xl">
            <div className="relative flex flex-1 items-center justify-center pb-3">
                { currentTab === "Analog" ? (
                    <>
                        <div className="absolute inset-0 rounded-full blur-3xl" aria-hidden />
                        <Clock className="relative" options={clockOptions} time={clockTime} />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-3xl font-semibold font-mono text-[var(--lavender)] drop-shadow-[0_0_22px_rgba(203,166,247,0.55)]" aria-live="polite">
                            {formattedTime}
                        </p>
                        <p className="text-lg text-[var(--text-muted)] tracking-[0.35em] uppercase">
                            {formattedDate}
                        </p>
                    </div>
                )}
            </div>
            <nav className="flex justify-center gap-3 text-sm font-medium">
                {tabOptions.map((tab) => {
                    const isActive = currentTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setCurrentTab(tab.id)}
                            aria-pressed={isActive}
                            className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition focus-visible:outline-none focus-visible:ring-2 ${
                                isActive
                                    ? 'border border-[rgba(203,166,247,0.5)] bg-[rgba(203,166,247,0.12)] text-white shadow-[0_0_22px_rgba(203,166,247,0.4)]'
                                    : 'border border-white/15 text-[var(--cp-text)] hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5 focus-visible:ring-white/20'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default ClockComponent;
