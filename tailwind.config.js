/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          950: '#150A06',
          900: '#2B160F', // Primary Deep chocolate brown
          800: '#3A2118', // Dark cocoa
          700: '#4D2F23',
          600: '#674132',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF9F0', // Very light warm cream
          200: '#FFF3DE', // Warm cream (primary brand cream)
          300: '#F5E4C4',
          400: '#EBD0A4',
        },
        caramel: {
          400: '#D49354',
          500: '#B9783D', // Caramel
          600: '#9C5F2B',
          700: '#7F4A1F',
        },
        gold: {
          400: '#E7C898',
          500: '#D9B27C', // Golden beige
          600: '#B8925A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(43, 22, 15, 0.12)',
        'warm-lg': '0 20px 40px -15px rgba(43, 22, 15, 0.22)',
        'warm-glow': '0 0 40px -10px rgba(185, 120, 61, 0.25)',
      }
    },
  },
  plugins: [],
}
