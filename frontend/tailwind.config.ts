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
      fontFamily: {
        display: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          footer: 'hsl(var(--sidebar-footer))',
          ring: 'hsl(var(--sidebar-ring))',
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
    // The prrapp palette: white surfaces, neutral borders and a burnt-orange
    // brand (#BB4D00) in light; a navy elevation scale in dark. Categorical
    // colour comes from the tone palette (components/ui/tone-badge.tsx), not
    // from more tokens here.
    addBase({
      ':root': {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--primary': '24.7 100% 36.7%', // #BB4D00
        '--primary-foreground': '0 0% 100%',
        '--secondary': '210 40% 96.1%',
        '--secondary-foreground': '222.2 47.4% 11.2%',
        '--muted': '210 40% 96.1%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 96.1%',
        '--accent-foreground': '222.2 47.4% 11.2%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '0 0% 89.8%', // #E5E5E5
        '--input': '0 0% 89.8%',
        '--ring': '24.7 100% 36.7%',
        '--radius': '0.5rem',
        '--success': '160 84% 30%',
        '--success-foreground': '0 0% 100%',
        '--warning': '36 100% 50%',
        '--warning-foreground': '24 100% 98%',
        '--info': '221 83% 53%',
        '--info-foreground': '0 0% 100%',
        '--error': '0 84.2% 60.2%',
        '--error-foreground': '0 0% 100%',
        '--sidebar': '0 0% 98%', // #FAFAFA
        '--sidebar-foreground': '222.2 84% 4.9%',
        '--sidebar-accent-foreground': '0 0% 0%',
        '--sidebar-border': '214 32% 91%',
        '--sidebar-footer': '0 0% 96.1%', // #F5F5F5
        '--sidebar-ring': '24.7 100% 36.7%',
      },
      '.dark': {
        '--background': '217 47% 11%', // #111A2E
        '--foreground': '216 55% 94%',
        '--card': '219 47% 11%',
        '--card-foreground': '216 55% 94%',
        '--popover': '219 47% 11%',
        '--popover-foreground': '216 55% 94%',
        '--primary': '24.7 100% 55%', // #FF781A
        '--primary-foreground': '222.2 84% 4.9%',
        '--secondary': '216 46% 16%',
        '--secondary-foreground': '216 55% 94%',
        '--muted': '217 49% 12%',
        '--muted-foreground': '217 23% 68%',
        '--accent': '218 45% 19%',
        '--accent-foreground': '216 55% 94%',
        '--destructive': '0 72% 51%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '220 36% 22%',
        '--input': '220 36% 22%',
        '--ring': '24.7 100% 55%',
        '--success': '152 60% 52%',
        '--success-foreground': '144 70% 10%',
        '--warning': '36 100% 56%',
        '--warning-foreground': '222.2 47.4% 11.2%',
        '--info': '214 95% 68%',
        '--info-foreground': '222.2 84% 4.9%',
        '--error': '0 84% 60%',
        '--error-foreground': '0 0% 98%',
        '--sidebar': '220 49% 8%',
        '--sidebar-foreground': '216 55% 94%',
        '--sidebar-accent-foreground': '216 55% 94%',
        '--sidebar-border': '220 36% 22%',
        '--sidebar-footer': '220 49% 8%',
        '--sidebar-ring': '24.7 100% 55%',
      }
    });
  })],
} satisfies Config;
