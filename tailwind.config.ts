import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0F1419',
        navy: '#1A1F2E',
        gold: { DEFAULT: '#C9A96E', hover: '#B8944F' },
        teal: { DEFAULT: '#2A5C5C', light: '#E8F0F0' },
        'warm-white': '#FAF9F7',
        'warm-gray': '#F2F1EF',
        border: '#E8E6E1',
        'text-secondary': '#6B6560',
        'text-tertiary': '#9C9690',
      },
    },
  },
  plugins: [],
}

export default config
