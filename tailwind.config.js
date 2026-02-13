/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lender': {
          'bg': '#000000',
          'card': '#171717',
          'card-hover': '#262626',
          'border': '#525252',
          'text': '#ffffff',
          'text-secondary': '#a3a3a3',
          'accent': '#4ade80',
          'accent-hover': '#86efac',
          'warning': '#facc15',
        }
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem'
      }
    },
  },
  plugins: [],
}
