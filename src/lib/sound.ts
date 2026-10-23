// Everything is synthesised with the Web Audio API: no audio files to load.

export type Noise = 'off' | 'brown' | 'pink' | 'white';

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let source: AudioBufferSourceNode | null = null;
const buffers = new Map<Noise, AudioBuffer>();

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

// A soft two-note chime for the end of a session.
export function chime() {
  const c = audio();
  const start = c.currentTime;
  [660, 990].forEach((freq, i) => {
    const t = start + i * 0.22;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 1.2);
  });
}

function makeNoise(c: AudioContext, kind: Exclude<Noise, 'off'>): AudioBuffer {
  const length = c.sampleRate * 6;
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === 'white') {
      data[i] = white * 0.35;
    } else if (kind === 'brown') {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    } else {
      // Paul Kellet's refined pink-noise filter.
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

export function playNoise(kind: Noise, volume: number) {
  if (source) {
    source.stop();
    source.disconnect();
    source = null;
  }
  if (kind === 'off') return;
  const c = audio();
  if (!gain) {
    gain = c.createGain();
    gain.connect(c.destination);
  }
  gain.gain.value = volume;
  if (!buffers.has(kind)) buffers.set(kind, makeNoise(c, kind));
  source = c.createBufferSource();
  source.buffer = buffers.get(kind) ?? null;
  source.loop = true;
  source.connect(gain);
  source.start();
}

export function setNoiseVolume(volume: number) {
  if (gain) gain.gain.value = volume;
}
