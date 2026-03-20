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
        primary: { DEFAULT: '#4F46E5', hover: '#4338CA' },
        accent: { DEFAULT: '#06B6D4' },
        surface: '#FFFFFF',
        muted: '#64748B',
        bg: '#F8FAFC',
      },
    },
  },
  plugins: [],
}

export default config
