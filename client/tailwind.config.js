/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        fadeInUp: 'fadeInUp 600ms ease-out both',
        shimmer: 'shimmer 2s linear infinite'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.08)'
      },
      colors: {
        indigo: {
          450: '#6266F1'
        }
      }
    }
  },
  plugins: []
};


