/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        point: {
          bg: '#f4f4f4',      // Tvoje industriální pozadí
          accent: '#E4664F',  // Váš červený/oranžový akcent
          dark: '#111111',    // Hluboká černá na texty/rámečky
        }
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'], // Pokud používáš mono fonty
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      },
      borderRadius: {
        // Můžeš si tady sjednotit, jak ostré nebo kulaté to má být
        none: '0px',
        DEFAULT: '4px',
      }
    },
  },
  plugins: [],
}