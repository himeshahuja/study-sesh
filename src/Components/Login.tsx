import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-8 rounded-2xl glass card-glow border border-[rgba(255,255,255,0.03)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold neon" style={{ color: 'var(--cp-text)' }}>
              StudySesh
            </h1>
            <p className="text-sm text-[var(--cp-muted)]">Home to study sessions.</p>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="p-6 rounded-lg" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
            <h2 className="text-lg font-semibold mb-2">Welcome</h2>
            <p className="text-sm text-[var(--cp-muted)]">Organize your study flow, create sessions, and collaborate live.</p>
            <div className="mt-6">
            <div className="flex items-center">
              <button
                onClick={handleSignIn}
                className="accent-btn"
                style={{ background: 'linear-gradient(90deg,#7c3aed22,#06b6d433)', color: 'var(--cp-text)' }}
                disabled={loading}
              >
                {/* Real Google SVG (from attachment) */}
                <svg width="20" height="20" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path fill="#EA4335" d="M23 10c3.9 0 7 1.6 9.3 3.9l7.1-7.1C37.3 2.8 30.5 0 23 0 14.5 0 6.9 4.1 2.8 10.1l8.9 6.9C14 14 18.2 10 23 10z"/>
                  <path fill="#4285F4" d="M46 23.5c0-1.5-.1-2.7-.3-3.9H23v7.4h12.6c-.5 2.9-2.6 7-7 10l.1.7 5.6 4.3C41.2 42 46 33.7 46 23.5z"/>
                  <path fill="#FBBC05" d="M9.7 29.5C8.9 26.9 8.9 24 8.9 21s0-5 0-8.5L1 12.1C0.4 15.4 0 19.8 0 23.5c0 3.6.4 7.1 1.1 10.4l8.6-4.4z"/>
                  <path fill="#34A853" d="M23 46c6.6 0 12.6-2.1 16.9-5.8l-7.8-6.1c-3 1.9-6.9 3-9.1 3-6 0-11.1-3.9-13.1-9.2L1 33.5C5 39.4 13 46 23 46z"/>
                </svg>
                <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Login;
