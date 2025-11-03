import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
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
          glow: "hsl(var(--primary-glow))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        status: {
          success: "hsl(var(--status-success))",
          "success-foreground": "hsl(var(--status-success-foreground))",
          warning: "hsl(var(--status-warning))",
          "warning-foreground": "hsl(var(--status-warning-foreground))",
          error: "hsl(var(--status-error))",
          "error-foreground": "hsl(var(--status-error-foreground))",
        },
        portal: {
          fahrer: "hsl(var(--portal-fahrer))",
          "fahrer-foreground": "hsl(var(--portal-fahrer-foreground))",
          kunde: "hsl(var(--portal-kunde))",
          "kunde-foreground": "hsl(var(--portal-kunde-foreground))",
          public: "hsl(var(--portal-public))",
          "public-foreground": "hsl(var(--portal-public-foreground))",
          // V28.2.19: Portal-Theming Tokens
          customer: "hsl(43, 46%, 85%)",
          "customer-hover": "hsl(43, 40%, 78%)",
          driver: "hsl(258, 90%, 66%)",
          "driver-hover": "hsl(258, 90%, 61%)",
        },
        video: {
          background: "hsl(var(--video-background))",
          foreground: "hsl(var(--video-foreground))",
        },
        // V26.1 UNIFIED_DESIGN_TOKENS Extensions
        dunkelblau: {
          DEFAULT: "hsl(var(--dunkelblau))",
          80: "hsl(var(--dunkelblau-80))",
          cc: "hsl(var(--dunkelblau-cc))",
          99: "hsl(var(--dunkelblau-99))",
          overlay: {
            70: "hsl(var(--dunkelblau-overlay-70))",
            60: "hsl(var(--dunkelblau-overlay-60))",
            50: "hsl(var(--dunkelblau-overlay-50))",
          },
        },
        beige: {
          DEFAULT: "hsl(var(--beige))",
          80: "hsl(var(--beige-80))",
          20: "hsl(var(--beige-20))",
          30: "hsl(var(--beige-30))",
          glow: {
            15: "hsl(var(--beige-glow-15))",
            30: "hsl(var(--beige-glow-30))",
            40: "hsl(var(--beige-glow-40))",
          },
        },
        weiss: "hsl(var(--weiss))",
        canvas: "hsl(var(--canvas))",
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'glow': 'var(--shadow-glow)',
        'sharp': 'var(--shadow-sharp)',
        'crisp': 'var(--shadow-crisp)',
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        // V26.1 Extensions
        'glow-beige': '0 0 20px hsl(var(--beige-glow-30))',
        'glow-beige-lg': '0 0 30px hsl(var(--beige-glow-40))',
        'hero-map': '0 10px 40px rgba(0, 0, 0, 0.1)',
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
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "var(--shadow-glow)" },
          "50%": { opacity: "0.8", boxShadow: "var(--shadow-elegant)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-out",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out",
        // V32.1: Animation Delay Classes
        "fade-in-delay-100": "fade-in 0.5s ease-out 0.1s forwards",
        "fade-in-delay-200": "fade-in 0.5s ease-out 0.2s forwards",
        "fade-in-delay-300": "fade-in 0.5s ease-out 0.3s forwards",
        "fade-in-delay-400": "fade-in 0.5s ease-out 0.4s forwards",
        "fade-in-delay-500": "fade-in 0.5s ease-out 0.5s forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // V28.3: Subpixel Antialiasing
        ".subpixel-antialiased": {
          "-webkit-font-smoothing": "auto",
          "-moz-osx-font-smoothing": "auto",
        },
        // V28.3: Image Rendering Crisp
        ".image-rendering-crisp": {
          "image-rendering": "crisp-edges",
          "image-rendering": "-webkit-optimize-contrast",
        },
        ".image-rendering-auto": {
          "image-rendering": "auto",
        },
        // V28.3: Pixel-Perfect GPU Acceleration
        ".pixel-perfect": {
          "transform": "translateZ(0)",
          "backface-visibility": "hidden",
          "perspective": "1000px",
        },
      });
    }),
  ],
} satisfies Config;
