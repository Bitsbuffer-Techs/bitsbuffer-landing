import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── DESIGN TOKENS ──────────────────────────────────────────────────
      // Mirror the CSS variables in globals.css. Bitsbuffer runs its own
      // light, restrained studio palette (flipped from dark 2026-07-08),
      // distinct from WF Engine's product palette, per the two-voice
      // decision (parent studio vs flagship product). No purple gradient
      // blobs, no decorative glow, that rule didn't change with the theme.
      colors: {
        bg:               'rgb(var(--color-bg-rgb) / <alpha-value>)',
        surface:          'rgb(var(--color-surface-rgb) / <alpha-value>)',
        'surface-raised': 'rgb(var(--color-surface-raised-rgb) / <alpha-value>)',
        border:           'rgb(var(--color-border-rgb) / <alpha-value>)',
        'border-subtle':  'rgb(var(--color-border-subtle-rgb) / <alpha-value>)',
        'text-primary':   'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary-rgb) / <alpha-value>)',
        'text-muted':     'rgb(var(--color-text-muted-rgb) / <alpha-value>)',

        // Theme-invariant brand marks
        accent: {
          DEFAULT: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          bright:  'rgb(var(--color-accent-bright-rgb) / <alpha-value>)',
          dim:     'rgb(var(--color-accent-dim-rgb) / <alpha-value>)',
        },
        // Deep teal, for the occasional full-bleed dark band on an
        // otherwise light page. See globals.css token comment.
        ink: {
          DEFAULT: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
          soft:    'rgb(var(--color-ink-soft-rgb) / <alpha-value>)',
        },
        // Case study / domain tags reuse one shared set, not one-off hex
        // per component, see lib/case-studies.ts
        domain: {
          ecommerce: '#F59E0B',
          fintech:   '#3B82F6',
          agritech:  '#10B981',
          erp:       '#8B5CF6',
          ai:        '#EC4899',
          edtech:    '#0EA5E9',
          // Added, both are real, live case studies (Sikhaid Global,
          // Love Anew) that had no domain color token before this pass,
          // the domain-tag utility silently did nothing for either.
          nonprofit: '#F43F5E',
          legaltech: '#6366F1',
          // Darkened variants for text on the badge's own 10%-tint
          // background, each verified >=4.5:1 (WCAG AA) against that bg.
          // The base colors above stay as-is for dots/icons/borders.
          'ecommerce-text': '#8F5C06',
          'fintech-text':   '#0A59DA',
          'agritech-text':  '#0A7350',
          'erp-text':       '#5714F2',
          'ai-text':        '#C4146B',
          'edtech-text':    '#096E9C',
          'nonprofit-text': '#C70B2B',
          'legaltech-text': '#1D21EB',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      borderRadius: {
        'sm':  '6px',
        'DEFAULT': '8px',
        'md':  '10px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
      },

      // Light-theme shadows: real depth, not glow-as-decoration. Alphas
      // softened from the old dark-theme values (0.24-0.40) since heavy
      // shadows read as muddy on a white surface, this is a studio site,
      // not a neon landing template.
      boxShadow: {
        'sm':    '0 1px 2px rgba(16,24,26,0.06)',
        'DEFAULT':'0 2px 8px rgba(16,24,26,0.08)',
        'md':    '0 4px 20px rgba(16,24,26,0.10)',
        'lg':    '0 12px 40px rgba(16,24,26,0.14)',
        'accent':'0 0 0 1px rgba(47,131,142,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
