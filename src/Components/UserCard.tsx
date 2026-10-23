import React from 'react';
import { User } from 'firebase/auth';

type Props = {
    user: User;
    onSignOut: () => void;
};

const UserCard: React.FC<Props> = ({ user, onSignOut }) => {
    const initials = (user.displayName || user.email || 'U').charAt(0).toUpperCase();

    return (
        <div
        >
            <div className="relative mb-2">
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" 
                    style={{ boxShadow: '0 4px 20px rgba(124,58,237,0.12)', border: '2px solid rgba(124,58,237,0.12)' }}>
                    {user.photoURL ? (
                        <img src={user.photoURL} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-[var(--cp-muted)] font-extrabold text-xl">{initials}</div>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div>
                    <div className="text-xl font-bold neon" style={{ color: 'var(--cp-text)' }}>{user.displayName ?? 'Anonymous'}</div>
                    <div className="text-sm text-[var(--cp-muted)] mt-1">{user.email}</div>
                    </div>
                </div>

                <div className="mt-5 flex gap-3">
                    <button
                    onClick={onSignOut}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg shadow-indigo-900/40 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                        background: 'linear-gradient(90deg,#ef4444, #f97316)',
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(239,68,68,0.12)'
                    }}
                    >
                    SIGN OUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
