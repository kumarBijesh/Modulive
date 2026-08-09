/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6', // Off-white luxury paper tint
        foreground: '#1A1918', // Rich charcoal black
        muted: {
          DEFAULT: '#F3F0EC',
          foreground: '#736F6A',
        },
        accent: {
          DEFAULT: '#2C2B29',
          warm: '#D4A373',
          sage: '#CCD5AE',
          terracotta: '#BC6C25',
        },
        border: '#E8E5DF',
        input: '#E8E5DF',
        ring: '#1A1918',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1918',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        card: '0 4px 20px -2px rgba(26, 25, 24, 0.05)',
        hover: '0 12px 30px -4px rgba(26, 25, 24, 0.1)',
      },
    },
  },
  plugins: [],
}
