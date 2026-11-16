/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cpvs: {
          blue: '#07599b',
          'blue-dark': '#053f6e',
          'blue-light': '#1474be',
          cyan: '#00a0e0',
          'cyan-light': '#e8f6fd',
          ice: '#f4f7ff',
          surface: '#ffffff',
          'surface-light': '#fafcfe',
          dark: '#1a1c2e',
          'dark-border': '#3a3c4e',
          text: '#1a1c1e',
          muted: '#4f5153',
          success: '#038547',
          'success-light': '#e6f7ee',
          warning: '#eaae3e',
          'warning-light': '#fdf6e7',
          danger: '#dd3333',
          'danger-light': '#fdeeed'
        }
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cpvs': '0 3px 6px -2px rgba(0, 0, 0, 0.15)',
        'cpvs-lg': '0 6px 16px -4px rgba(7, 89, 155, 0.12)',
        'cpvs-header': '0 4px 6px -2px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}
