import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // Theme-aware colors
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), plugin(({ addBase }) => {
    addBase({
      ':root': {
        '--background': '224 71% 98%', // Light blue-tinted white for richness
        '--foreground': '224 71% 4%', // Deep dark blue-black
        '--card': '0 0% 100%',
        '--card-foreground': '224 71% 4%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '224 71% 4%',
        '--primary': '262 83% 58%', // Vibrant Purple/Indigo
        '--primary-foreground': '210 40% 98%',
        '--secondary': '220 14% 96%', // Cool gray
        '--secondary-foreground': '220.9 39.3% 11%',
        '--muted': '220 14% 96%',
        '--muted-foreground': '220 8.9% 46.1%',
        '--accent': '262 83% 97%', // Light purple tint
        '--accent-foreground': '262 83% 58%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '220 13% 91%',
        '--input': '220 13% 91%',
        '--ring': '262 83% 58%',
        '--radius': '1rem', // More rounded
        '--success': '142 76% 36%',
        '--success-foreground': '355 100% 100%',
        '--warning': '38 92% 50%',
        '--warning-foreground': '0 0% 100%',
        '--info': '199 89% 48%',
        '--info-foreground': '0 0% 100%',
        '--error': '0 84.2% 60.2%',
        '--error-foreground': '0 0% 100%',
      },
      '.dark': {
        '--background': '224 71% 4%', // Deepest blue-black
        '--foreground': '210 40% 98%',
        '--card': '224 71% 6%', // Slightly lighter than bg
        '--card-foreground': '210 40% 98%',
        '--popover': '224 71% 6%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '263 70% 65%', // Lighter purple for dark mode
        '--primary-foreground': '210 40% 98%',
        '--secondary': '215 27.9% 16.9%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '215 27.9% 16.9%',
        '--muted-foreground': '217.9 10.6% 64.9%',
        '--accent': '215 27.9% 16.9%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '215 27.9% 16.9%',
        '--input': '215 27.9% 16.9%',
        '--ring': '263 70% 65%',
        '--success': '142 70% 45%',
        '--success-foreground': '144 70% 10%',
        '--warning': '48 96% 53%',
        '--warning-foreground': '222.2 47.4% 11.2%',
        '--info': '199 89% 48%',
        '--info-foreground': '0 0% 100%',
        '--error': '0 84% 60%',
        '--error-foreground': '0 0% 98%',
      }
    });
  })],
} satisfies Config;
