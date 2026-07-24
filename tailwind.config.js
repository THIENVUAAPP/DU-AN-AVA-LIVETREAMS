/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0A0A',
          card: '#121216',
          border: '#1F2937',
          red: '#EF4444',
          redHover: '#DC2626',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          white: '#FFFFFF',
          gray: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Be Vietnam Pro', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.35)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.35)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
      },
    },
  },
  plugins: [],
};
