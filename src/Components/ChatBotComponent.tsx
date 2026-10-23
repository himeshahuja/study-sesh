import { useState, FormEvent } from 'react';

type ChatMessage = { role: 'user' | 'bot'; text: string };

const ChatBotComponent = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');

    const handleSend = (event: FormEvent) => {
        event.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: input.trim() };
        const botMessage: ChatMessage = {
            role: 'bot',
            text: `You said: "${input.trim()}"`,
        };

        setMessages((messages) => [...messages, userMessage, botMessage]);
        setInput('');
    };

    return (
        <div className="glass relative flex h-full flex-col rounded-3xl border border-[rgba(255,255,255,0.06)] p-3 shadow-xl">
            <span
                className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-3xl bg-gradient-to-r from-[rgba(203,166,247,0.25)] via-[rgba(148,163,255,0.15)] to-[rgba(9,167,219,0.2)] blur-3xl"
                aria-hidden
            />
            <header className="relative mb-2 flex items-center justify-center text-center">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--cp-muted)]">Study Assistant</p>
                </div>
            </header>

            <div className="relative flex-1">
                <div
                    className="scrollbar-thin overflow-y-scroll scrollbar-thumb-[rgba(255,255,255,0.15)] scrollbar-track-transparent flex h-full flex-col gap-3 overflow-y-auto rounded-2xl border border-white/5 bg-[rgba(8,8,20,0.65)] px-2 py-3"
                    ref={(node) => {
                        if (node) {
                            node.scrollTop = node.scrollHeight;
                        }
                    }}
                >
                    {messages.length === 0 && (
                        <div className="text-center text-sm text-[var(--cp-muted)]">
                            Ask anything about your study plan to get started.
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl p-2 text-sm shadow-lg transition ${
                                msg.role === 'user'
                                    ? 'self-end bg-gradient-to-r from-[#cba6f7] to-[#89dceb] text-slate-900'
                                    : 'self-start border border-white/10 bg-white/5 text-[var(--cp-text)]'
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSend} className="relative mt-2 flex flex-wrap items-center gap-0 rounded-2xl border border-white/10 bg-[rgba(12,12,24,0.75)] px-3 py-2">
                <input
                    className="min-w-0 flex-1 mr-10 bg-transparent text-sm text-white placeholder:text-[var(--cp-muted)] focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask away..."
                />
                <button
                    type="submit"
                    className="flex-shrink-0 rounded-2xl bg-gradient-to-r from-[#cba6f7] to-[#89dceb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBotComponent;