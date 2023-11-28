/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        peach: '#F4DCD3',
        'rojo-red': '#DC2626', // Using kebab-case for multi-word color names
        'prussian-blue': '#1E293B',
      },
    },
  },
  plugins: [],
}


