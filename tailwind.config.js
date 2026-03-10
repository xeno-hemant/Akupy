/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Hidden Hues Core ── */
        ivory: '#F3F0E2',
        cream: '#F0EADD',
        linen: '#E8E0D6',
        silver: '#D9D5D2',
        taupe: '#8E867B',
        dark: '#3d3830',

        /* ── Semantic tokens (via CSS var) ── */
        primary: 'var(--accent-primary)',
        'primary-dark': 'var(--bg-button-hover)',
        bg: 'var(--bg-page)',
        'bg-gray': 'var(--bg-section-alt)',
        'bg-dark': 'var(--color-dark)',
        'bg-card': 'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-red': 'var(--error)',
        'accent-yellow': 'var(--warning)',
        'accent-success': 'var(--success)',
        border: 'var(--border)',
        'border-medium': 'var(--border-medium)',

        /* ── Status ── */
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',

        /* ── Legacy aliases so nothing breaks ── */
        background: 'var(--bg-page)',
        foreground: 'var(--text-primary)',
        card: 'var(--bg-card)',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'akupy': '0 4px 16px rgba(142,134,123,0.16)',
        'sm': '0 1px 4px rgba(142,134,123,0.12)',
        'md': '0 4px 16px rgba(142,134,123,0.16)',
        'lg': '0 8px 32px rgba(142,134,123,0.20)',
        'xl': '0 16px 48px rgba(142,134,123,0.24)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
      },
    },
  },
  plugins: [],
}
