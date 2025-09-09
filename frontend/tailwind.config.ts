/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#B3EBF2',   // Main light blue
          100: '#9FE7F0',  // Slightly darker
          200: '#7DDDE8',  // Medium
          300: '#5BD3E0',  // Darker
          400: '#39C9D8',  // Even darker
          500: '#17BFD0',  // Dark
          600: '#14A8B7',  // Very dark
          700: '#11919E',  // Darkest
        },
        gray: {
          10: '#F8FAFB',
          20: '#E5E7EB',
          30: '#D1D5DB',
          50: '#6B7280',
          90: '#1F2937',
        },
        accent: {
          50: '#FEF3C7',   // Light yellow for highlights
          100: '#FDE68A',  // Medium yellow
        },
        success: {
          50: '#D1FAE5',   // Light green for success states
          100: '#A7F3D0',  // Medium green
        },
      },
      backgroundImage: {
        'bg-img-1': "url('/img-1.png')",
        'bg-img-2': "url('/img-2.png')",
        'feature-bg': "url('/feature-bg.png')",
        pattern: "url('/pattern.png')",
        'pattern-2': "url('/pattern-bg.png')",
      },
      screens: {
        xs: '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
      maxWidth: {
        '10xl': '1512px',
      },
      borderRadius: {
        '5xl': '40px',
      },
    },
  },
  plugins: [],
};