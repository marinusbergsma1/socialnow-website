/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'scroll': 'scroll var(--scroll-duration, 40s) linear infinite',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-right': 'fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'page-fade-in': 'pageFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'move-background': 'moveBackground 8s ease-in-out infinite',
        'counter-up': 'counterUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow-cyan': 'pulseGlowCyan 3s ease-in-out infinite',
        'pulse-glow-green': 'pulseGlowGreen 3s ease-in-out infinite',
        'ticker-slide': 'tickerSlide var(--ticker-duration, 30s) linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          from: { opacity: '0', transform: 'translateX(30px)', filter: 'blur(10px)' },
          to: { opacity: '1', transform: 'translateX(0)', filter: 'blur(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pageFadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)', filter: 'blur(4px)' },
          to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        moveBackground: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        counterUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlowCyan: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,163,224,0.3), 0 0 20px rgba(0,163,224,0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(0,163,224,0.6), 0 0 40px rgba(0,163,224,0.25)' },
        },
        pulseGlowGreen: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(37,211,102,0.3), 0 0 20px rgba(37,211,102,0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(37,211,102,0.6), 0 0 40px rgba(37,211,102,0.25)' },
        },
        tickerSlide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
