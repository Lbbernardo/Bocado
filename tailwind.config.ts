import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bocado: {
          orange: '#FFA600',
          yellow: '#FFC107',
          dark: '#111111',
          darker: '#0A0A0A',
          cream: '#FFF8EE',
          'cream-dark': '#FFF0D6',
        },
        ld: {
          orange:      '#FF9E00',
          'orange-2':  '#FFA600',
          'orange-deep':'#F07A12',
          yellow:      '#FFC107',
          cream:       '#FBF5E9',
          'cream-2':   '#FDF9F0',
          ink:         '#2E2A24',
          'ink-soft':  '#6B6358',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', '"Baloo 2"', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      maxWidth: { content: '1180px' },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'bocado': '0 20px 60px -10px rgba(255, 166, 0, 0.4)',
        'bocado-sm': '0 8px 30px -5px rgba(255, 166, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
