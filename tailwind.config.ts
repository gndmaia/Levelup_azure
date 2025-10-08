import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LevelUp Azure branding
        primary: {
          DEFAULT: '#0078D4', // Azure Blue
          50: '#E6F3FB',
          100: '#CCE7F7',
          200: '#99CFEF',
          300: '#66B7E7',
          400: '#339FDF',
          500: '#0078D4',
          600: '#0060AA',
          700: '#00487F',
          800: '#003055',
          900: '#00182A',
        },
        neutral: {
          50: '#FFFFFF',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        accent: {
          teal: '#14B8A6',
          purple: '#A855F7',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
