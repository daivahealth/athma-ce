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
        '--background': '30 33% 98%', // Warm off-white
        '--foreground': '18 20% 12%', // Warm graphite
        '--card': '0 0% 100%',
        '--card-foreground': '18 20% 12%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '18 20% 12%',
        '--primary': '20 85% 48%', // Softer burnt orange/terracotta (less eye fatigue)
        '--primary-foreground': '24 100% 98%',
        '--secondary': '31 56% 95%', // Warm sand
        '--secondary-foreground': '18 20% 16%',
        '--muted': '30 24% 95%',
        '--muted-foreground': '22 10% 43%',
        '--accent': '35 100% 96%', // Soft amber tint
        '--accent-foreground': '14 100% 44%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '28 35% 88%',
        '--input': '28 35% 88%',
        '--ring': '20 85% 48%',
        '--radius': '1rem', // More rounded
        '--success': '142 76% 36%',
        '--success-foreground': '355 100% 100%',
        '--warning': '36 100% 50%',
        '--warning-foreground': '24 100% 98%',
        '--info': '199 89% 48%',
        '--info-foreground': '0 0% 100%',
        '--error': '0 84.2% 60.2%',
        '--error-foreground': '0 0% 100%',
      },
      '.dark': {
        '--background': '230 28% 8%', // Charcoal navy
        '--foreground': '30 30% 96%',
        '--card': '228 24% 11%', // Soft charcoal
        '--card-foreground': '30 30% 96%',
        '--popover': '228 24% 11%',
        '--popover-foreground': '30 30% 96%',
        '--primary': '24 85% 55%', // Softer orange for dark mode
        '--primary-foreground': '18 25% 10%',
        '--secondary': '226 18% 18%',
        '--secondary-foreground': '30 30% 96%',
        '--muted': '226 18% 18%',
        '--muted-foreground': '28 12% 68%',
        '--accent': '226 18% 18%',
        '--accent-foreground': '30 30% 96%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '226 16% 22%',
        '--input': '226 16% 22%',
        '--ring': '24 100% 60%',
        '--success': '142 70% 45%',
        '--success-foreground': '144 70% 10%',
        '--warning': '36 100% 56%',
        '--warning-foreground': '222.2 47.4% 11.2%',
        '--info': '199 89% 48%',
        '--info-foreground': '0 0% 100%',
        '--error': '0 84% 60%',
        '--error-foreground': '0 0% 98%',
      }
    });
  })],
} satisfies Config;
