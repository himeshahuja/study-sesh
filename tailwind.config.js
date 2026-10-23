/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        catppuccin: {
          rosewater: '#f5e0dc',
          flamingo: '#f2cdcd',
          pink: '#f5c2e7',
          mauve: '#c6a0f6',
          red: '#f28fad',
          maroon: '#e8a2af',
          peach: '#f8bd96',
          yellow: '#fae3b0',
          green: '#abe9b3',
          teal: '#b5e8e0',
          sky: '#bae6fd',
          sapphire: '#7dc4e4',
          blue: '#96befe',
          lavender: '#c9cbff',
          text: '#cdd6f4',
          subtext1: '#b6b9d6',
          surface0: '#1e1e2e',
          surface1: '#313244',
          surface2: '#45475a',
          overlay0: '#6c6f85',
          muted: '#6e6f91',
          subtle: '#54546a',
          border: '#313244',
          none: 'transparent',
        },
      },
    },
  },
  plugins: [],
};
