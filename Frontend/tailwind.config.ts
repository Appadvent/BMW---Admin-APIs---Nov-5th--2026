/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* your existing color palette */ },
        secondary: { /* your existing color palette */ },
        success: { 500: '#10B981' },
        warning: { 500: '#F59E0B' },
        error: { 500: '#EF4444' },
        gray: { /* your existing gray palette */ },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        thicccboi: ['THICCCBOI', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'], 
      },
      animation: {
        customScroll: "scroll 20s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(10%)" },
          "100%": { transform: "translateX(-15%)" },
        },
      },
    },
  },
  plugins: [],
};
