import { useEffect, useState, type FC } from 'react';

const SmallScreenOverlay: FC = () => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
    if (!copied) {
        return undefined;
    }

    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
    }, [copied]);

    return (
    <div className="viewed">
        <div className="viewed__content">
        <span className="relative inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-catppuccin-mauve/80 to-catppuccin-sapphire/70 text-3xl shadow-[0_18px_40px_rgba(124,58,237,0.35)]">
            📱
            <span className="absolute inset-0 rounded-2xl bg-white/20 blur-xl" aria-hidden />
        </span>

        <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-[var(--cp-text)]">Best experienced on larger screens</h1>
            <p className="text-sm leading-relaxed text-catppuccin-subtext1">
            StudySesh shines on desktops and tablets. Switch to a wider display to unlock your dashboard.
            </p>
        </div>
        </div>
    </div>
    );
};

export default SmallScreenOverlay;