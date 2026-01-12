/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nounYellow: '#FFFF00',
        nounRed: '#E63433',
        nounBlue: '#2D81FF',
        nounOffWhite: '#F2F2F2',
        honeyAmber: '#FBBF24',
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive', 'monospace'],
        'sans': ['Verdana', 'sans-serif'],
      },
      boxShadow: {
        'hard': '8px 8px 0px 0px rgba(0,0,0,1)',
        'hard-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'hard-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'flap-fast': 'flap 0.15s infinite alternate',
        'fly-around': 'fly-around 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flap: {
          '0%': { transform: 'rotate(-10deg) scaleY(1)' },
          '100%': { transform: 'rotate(10deg) scaleY(0.9)' },
        },
        'fly-around': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(30px, -40px) rotate(10deg)' },
          '50%': { transform: 'translate(-20px, -10px) rotate(-10deg)' },
          '75%': { transform: 'translate(40px, 20px) rotate(5deg)' },
        }
      }
    },
  },
  plugins: [],
}
