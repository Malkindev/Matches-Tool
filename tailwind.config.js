/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 50px rgba(59,130,246,0.35)',
      },
      colors: {
        surface: '#08080b',
        panel: 'rgba(255,255,255,0.08)',
        panelStrong: 'rgba(255,255,255,0.14)',
        border: 'rgba(255,255,255,0.10)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 45%), radial-gradient(circle at bottom right, rgba(139,92,246,0.12), transparent 30%)',
      },
    },
  },
  plugins: [],
};
