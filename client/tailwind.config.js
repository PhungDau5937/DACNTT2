module.exports = {
  darkMode: 'class', 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    theme: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
        mono: ['Source Sans Pro', 'monospace'],
      },
    },
    print: {
      '@media print': {
        '.print': {
          width: '100%',
          height: '100%',
          padding: '1.5rem',
          backgroundColor: '#fff',
          boxShadow: 'none',
        },
        '.print *': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        '.print h1, .print h2, .print h3, .print h4, .print h5, .print h6': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: '0.5rem 0',
        },
        '.print p': {
          fontSize: '1rem',
          margin: '0.5rem 0',
        },
        '.print table': {
          width: '100%',
          borderCollapse: 'collapse',
        },
        '.print th, .print td': {
          border: '1px solid #ddd',
          padding: '0.5rem',
        },
        '.print td': {
          verticalAlign: 'top',
        },
      },
    },
  },
  plugins: [],
}
