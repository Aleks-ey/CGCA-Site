/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        peach: "#F4DCD3",
        "rojo-red": "#DC2626", // Using kebab-case for multi-word color names
        "prussian-blue": "#1E293B",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        merri: ["Merriweather", "sans-serif"],
        serif: ["serif", "sans-serif"],
        franklin: ["Franklin Gothic Medium", "sans-serif"],
        oxygen: ["Oxygen", "sans-serif"],
      },
      objectPosition: {
        "50-10": "50% 10%",
        "50-20": "50% 20%",
        "50-30": "50% 30%",
        "50-40": "50% 40%",
        "50-50": "50% 50%",
        "50-60": "50% 60%",
        "50-70": "50% 70%",
        "50-80": "50% 80%",
        "50-90": "50% 90%",
      },
    },
  },
  variants: {
    extend: {
      objectPosition: ["responsive"],
    },
  },
  plugins: [],
};
