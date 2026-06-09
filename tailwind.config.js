/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pomodoro: '#FF4757', // Vibrant red
        shortBreak: '#2ED573', // Vibrant green
        longBreak: '#1E90FF', // Vibrant blue
        darkbg: '#0B0E14', // Very dark background
        glass: 'rgba(255, 255, 255, 0.05)', // Glassmorphism base
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
