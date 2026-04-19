/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#080C14',
        'bg-surface': '#0F1927',
        'bg-card': '#111C2D',
        'accent-blue': '#0EA5E9',
        'accent-amber': '#F59E0B',
        'accent-blue-dim': 'rgba(14,165,233,0.15)',
        'text-primary': '#E2E8F0',
        'text-muted': '#94A3B8',
        'text-dim': '#475569',
        'border-subtle': 'rgba(14,165,233,0.12)',
        'glow-blue': 'rgba(14,165,233,0.35)',
        brand: {
          bg: '#080C14',
          surface: '#0F1927',
          accent: '#0EA5E9',
          amber: '#F59E0B',
          text: '#E2E8F0',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
