/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark Mode Palette
        'app-bg': '#0a0a0b', // Deep rich black, not pure black
        surface: {
          50: '#17171a',  // Card background
          100: '#1f1f23', // Hover state
          200: '#2a2a30', // Active state
          300: '#3e3e46', // Borders
        },
        primary: {
          DEFAULT: '#6366f1', // Indigo 500
          hover: '#4f46e5',   // Indigo 600
          glow: 'rgba(99, 102, 241, 0.5)',
        },
        secondary: {
          DEFAULT: '#8b5cf6', // Violet 500
          hover: '#7c3aed',   // Violet 600
        },
        accent: {
          pink: '#ec4899',
          cyan: '#06b6d4',
          purple: '#a855f7',
        },
        success: '#10b981', // Emerald 500
        warning: '#f59e0b', // Amber 500
        error: '#ef4444',   // Red 500
        text: {
          primary: '#f9fafb', // Gray 50
          secondary: '#9ca3af', // Gray 400
          muted: '#6b7280',     // Gray 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // If available, otherwise falls back
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { opacity: '.8', boxShadow: '0 0 10px rgba(99, 102, 241, 0.1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
      }
    },
  },
  plugins: [],
}

