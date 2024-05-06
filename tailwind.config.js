/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // tailwind funcionará en todas estas extensiones
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

