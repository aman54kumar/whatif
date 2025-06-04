/**
 * WhatIf.DIY Theme Configuration
 *
 * This file contains the complete theme configuration from the WhatIf.DIY app.
 * You can use this in any new project to replicate the same beautiful styling.
 *
 * Compatible with: Tailwind CSS v4.0+, SvelteKit, React, Vue, or any web framework
 */

export const whatifTheme = {
  // ===== COLOR PALETTE =====
  colors: {
    // Primary Colors (Purple-Blue Gradient Theme)
    primary: {
      50: "#f3f4f6", // Very light gray
      100: "#e5e7eb", // Light gray
      200: "#d1d5db", // Gray
      300: "#9ca3af", // Medium gray
      400: "#6b7280", // Dark gray
      500: "#374151", // Very dark gray
      600: "#1f2937", // Almost black
      700: "#111827", // Black
      800: "#030712", // Pure black
      900: "#000000", // Absolute black
    },

    // Purple Shades (Main Brand Color)
    purple: {
      50: "#faf5ff", // Very light purple
      100: "#f3e8ff", // Light purple
      200: "#e9d5ff", // Soft purple
      300: "#d8b4fe", // Medium purple
      400: "#c084fc", // Bright purple
      500: "#a855f7", // Standard purple
      600: "#9333ea", // Dark purple (Primary)
      700: "#7c3aed", // Darker purple
      800: "#6b21a8", // Very dark purple
      900: "#581c87", // Deepest purple
    },

    // Blue Shades (Secondary Brand Color)
    blue: {
      50: "#eff6ff", // Very light blue
      100: "#dbeafe", // Light blue
      200: "#bfdbfe", // Soft blue
      300: "#93c5fd", // Medium blue
      400: "#60a5fa", // Bright blue
      500: "#3b82f6", // Standard blue
      600: "#2563eb", // Dark blue (Secondary)
      700: "#1d4ed8", // Darker blue
      800: "#1e40af", // Very dark blue
      900: "#1e3a8a", // Deepest blue
    },

    // Indigo Shades (Accent Color)
    indigo: {
      50: "#eef2ff", // Very light indigo
      100: "#e0e7ff", // Light indigo
      200: "#c7d2fe", // Soft indigo
      300: "#a5b4fc", // Medium indigo
      400: "#818cf8", // Bright indigo
      500: "#6366f1", // Standard indigo
      600: "#4f46e5", // Dark indigo
      700: "#4338ca", // Darker indigo
      800: "#3730a3", // Very dark indigo
      900: "#312e81", // Deepest indigo
    },
  },

  // ===== GRADIENT DEFINITIONS =====
  gradients: {
    // Background Gradients
    backgroundLight:
      "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50",
    backgroundDark: "dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900",
    backgroundFull:
      "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900",

    // Button Gradients
    primaryButton: "bg-gradient-to-r from-purple-600 to-blue-600",
    primaryButtonHover: "hover:from-purple-700 hover:to-blue-700",
    primaryButtonFull:
      "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",

    // Text Gradients
    titleGradient:
      "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent",
    subtitleGradient:
      "bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent",
  },

  // ===== COMPONENT STYLES =====
  components: {
    // Form Input Styling
    input: {
      base: "w-full px-4 py-3 border rounded-lg transition-colors",
      light: "border-gray-300 bg-white text-gray-900 placeholder-gray-500",
      dark: "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400",
      focus: "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      full: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
    },

    // Button Styling
    button: {
      primary:
        "bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2",
      secondary:
        "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors",
      ghost:
        "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors",
    },

    // Card Styling
    card: {
      base: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors",
      hover:
        "hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all",
      interactive:
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer",
    },

    // Alert/Toast Styling
    alert: {
      info: "border-blue-400 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      success:
        "border-green-400 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200",
      warning:
        "border-yellow-400 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      error:
        "border-red-400 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200",
      purple:
        "bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-400 text-purple-700 dark:text-purple-200",
    },
  },

  // ===== LAYOUT & SPACING =====
  layout: {
    container: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
    containerWide: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
    containerNarrow: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8",
    fullHeight: "min-h-screen",
    section: "py-12 sm:py-16 lg:py-20",
  },

  // ===== TYPOGRAPHY =====
  typography: {
    // Headings
    h1: "text-4xl sm:text-5xl lg:text-6xl font-bold",
    h2: "text-3xl sm:text-4xl font-bold",
    h3: "text-2xl sm:text-3xl font-bold",
    h4: "text-xl sm:text-2xl font-semibold",
    h5: "text-lg sm:text-xl font-semibold",

    // Body Text
    body: "text-gray-700 dark:text-gray-300",
    bodyLarge: "text-lg text-gray-700 dark:text-gray-300",
    bodySmall: "text-sm text-gray-600 dark:text-gray-400",

    // Links
    link: "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors",
    linkUnderline:
      "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors",
  },

  // ===== EFFECTS & ANIMATIONS =====
  effects: {
    transition: "transition-colors duration-300",
    transitionAll: "transition-all duration-300",
    shadow: "shadow-lg shadow-purple-500/10",
    ring: "focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
    backdrop: "backdrop-blur-sm bg-white/80 dark:bg-gray-900/80",
  },

  // ===== DARK MODE TOGGLE =====
  darkMode: {
    toggle:
      "relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
    toggleActive: "bg-purple-600",
    toggleInactive: "bg-gray-200",
    toggleSwitch:
      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
    toggleSwitchActive: "translate-x-5",
    toggleSwitchInactive: "translate-x-0",
  },
};

// ===== USAGE EXAMPLES =====
export const exampleUsage = {
  // Page Background
  pageBackground: `class="${whatifTheme.gradients.backgroundFull} ${whatifTheme.layout.fullHeight} ${whatifTheme.effects.transition}"`,

  // Primary Button
  primaryButton: `class="${whatifTheme.components.button.primary}"`,

  // Form Input
  formInput: `class="${whatifTheme.components.input.full}"`,

  // Interactive Card
  interactiveCard: `class="${whatifTheme.components.card.interactive} p-6"`,

  // Main Title with Gradient
  mainTitle: `class="${whatifTheme.typography.h1} ${whatifTheme.gradients.titleGradient}"`,

  // Container Layout
  container: `class="${whatifTheme.layout.container} ${whatifTheme.layout.section}"`,
};

// ===== TAILWIND CONFIG EXTENSION =====
export const tailwindConfigExtension = {
  theme: {
    extend: {
      colors: {
        primary: whatifTheme.colors.primary,
        purple: whatifTheme.colors.purple,
        blue: whatifTheme.colors.blue,
        indigo: whatifTheme.colors.indigo,
      },
      backgroundImage: {
        "gradient-main":
          "linear-gradient(to bottom right, rgb(139 92 246 / 0.1), rgb(59 130 246 / 0.1), rgb(99 102 241 / 0.1))",
        "gradient-main-dark":
          "linear-gradient(to bottom right, rgb(17 24 39), rgb(31 41 55), rgb(99 102 241 / 0.2))",
        "gradient-button":
          "linear-gradient(to right, rgb(147 51 234), rgb(37 99 235))",
        "gradient-button-hover":
          "linear-gradient(to right, rgb(126 58 237), rgb(29 78 216))",
      },
    },
  },
};

export default whatifTheme;
