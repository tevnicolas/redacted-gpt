/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mywhite: 'rgb(242, 242, 242)',
        myyellow: 'rgb(238, 250, 8)',
        myconcrete: 'rgb(218, 218, 218)',
        mygrey: 'rgb(73, 73, 73)',
        mygreen: 'rgb(34, 205, 20)',
      },
      fontFamily: {
        HKnova: ['HKNova', 'Roboto', 'sans-serif'],
        Roboto: ['Roboto', 'sans-serif'],
        Righteous: ['Righteous', 'Roboto Slab', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
