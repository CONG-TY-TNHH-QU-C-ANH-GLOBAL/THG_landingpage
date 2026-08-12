import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // The brand type stacks resolve through the CSS variables declared in globals.css, so
      // `font-mono` means IBM Plex Mono (the registered mono face) instead of Tailwind's generic
      // default, and `font-sans` cannot silently diverge from the body face.
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        navy: "hsl(var(--navy))",
        olive: {
          DEFAULT: "hsl(var(--olive))",
          light: "hsl(var(--olive-light))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        thg: {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          surfaceSubtle: '#F1F3F5',
          border: '#E2E8F0',
          borderHover: '#CBD5E1',
          gold: '#C29B38',
          goldBg: '#FDF8EC',
          textMain: '#0F172A',
          textMuted: '#64748B',
          // The third text step. It existed as a bare #94A3B8 in eleven places across the
          // fulfill sections; naming it is what stops the next component inventing a twelfth.
          textSubtle: '#94A3B8',
          cyanTech: '#0284C7',
        }
      },
      boxShadow: {
        'thg-goldGlow': '0 0 30px rgba(212, 175, 55, 0.15)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "counter": {
          from: { "--num": "0" },
          to: { "--num": "var(--target)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(36 50% 48% / 0.1)" },
          "50%": { boxShadow: "0 0 40px hsl(36 50% 48% / 0.25)" },
        },
        "pulse-3d": {
          "0%, 100%": { transform: "scale(1) perspective(800px) rotateY(0deg)" },
          "50%": { transform: "scale(1.02) perspective(800px) rotateY(1deg)" },
        },
        "rotate-in-3d": {
          from: { opacity: "0", transform: "perspective(1200px) rotateY(-15deg) translateZ(-50px)" },
          to: { opacity: "1", transform: "perspective(1200px) rotateY(0) translateZ(0)" },
        },
        "fade-in-up-3d": {
          from: { opacity: "0", transform: "translateY(40px) perspective(1200px) rotateX(2deg)" },
          to: { opacity: "1", transform: "translateY(0) perspective(1200px) rotateX(0)" },
        },
        "line-flow": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
        "particle": {
          "0%": { offsetDistance: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { offsetDistance: "100%", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "pulse-3d": "pulse-3d 4s ease-in-out infinite",
        "rotate-in-3d": "rotate-in-3d 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "fade-in-up-3d": "fade-in-up-3d 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "line-flow": "line-flow 1s linear infinite",
        "particle": "particle 2s linear infinite",
      },
    },
  },
  // typography plugin joins with the first prose consumer (blog/policy slices); the
  // ported shell/home surface uses no prose classes.
  plugins: [tailwindcssAnimate],
} satisfies Config;
