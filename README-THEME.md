# 🎨 WhatIf.DIY Theme Configuration

A beautiful purple-blue gradient theme with dark mode support, extracted from the WhatIf.DIY application. This theme provides a modern, professional look perfect for web applications, landing pages, and SaaS products.

## 🌟 Features

- **Beautiful Color Palette**: Purple-blue gradient theme with carefully selected shades
- **Dark Mode Support**: Seamless light/dark mode transitions
- **Component Library**: Pre-built component styles for buttons, inputs, cards, and more
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Framework Agnostic**: Works with React, Vue, Svelte, or any web framework
- **Tailwind CSS Compatible**: Designed for Tailwind CSS v4.0+

## 🚀 Quick Start

### 1. Installation

Copy the `theme-config.js` file to your project:

```bash
# Copy the theme configuration file
cp theme-config.js your-project/src/
```

### 2. Import and Use

```javascript
// In your component file
import { whatifTheme, exampleUsage } from "./theme-config.js";

// Use pre-built component styles
const MyButton = () => (
  <button className={whatifTheme.components.button.primary}>Click me!</button>
);

// Use gradient backgrounds
const MyPage = () => (
  <div className={whatifTheme.gradients.backgroundFull}>
    <div className={whatifTheme.layout.container}>
      <h1
        className={`${whatifTheme.typography.h1} ${whatifTheme.gradients.titleGradient}`}
      >
        Welcome to My App
      </h1>
    </div>
  </div>
);
```

### 3. Tailwind CSS Configuration

Add the theme extension to your `tailwind.config.js`:

```javascript
import { tailwindConfigExtension } from "./src/theme-config.js";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      ...tailwindConfigExtension.theme.extend,
    },
  },
  plugins: [],
};
```

## 🎯 Usage Examples

### Page Layout

```html
<!-- Full page with gradient background -->
<div
  class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-300"
>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    <!-- Your content here -->
  </div>
</div>
```

### Buttons

```html
<!-- Primary button with gradient -->
<button
  class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
>
  Get Started
</button>

<!-- Secondary button -->
<button
  class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
>
  Learn More
</button>
```

### Form Inputs

```html
<!-- Text input with focus states -->
<input
  type="text"
  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
  placeholder="Enter your text..."
/>
```

### Cards

```html
<!-- Interactive card -->
<div
  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer p-6"
>
  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    Card Title
  </h3>
  <p class="text-gray-700 dark:text-gray-300">Card content goes here...</p>
</div>
```

### Typography

```html
<!-- Main title with gradient text -->
<h1
  class="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
>
  Beautiful Title
</h1>

<!-- Body text -->
<p class="text-lg text-gray-700 dark:text-gray-300">
  This is body text that adapts to light and dark mode.
</p>

<!-- Links -->
<a
  href="#"
  class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors"
>
  Learn more
</a>
```

## 🌙 Dark Mode Implementation

### React/Next.js

```javascript
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-gray-200 dark:bg-purple-600"
    >
      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-0 dark:translate-x-5" />
    </button>
  );
};
```

### Svelte

```svelte
<script>
  import { whatifTheme } from './theme-config.js';

  let darkMode = false;

  $: if (typeof document !== 'undefined') {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<button
  on:click={() => darkMode = !darkMode}
  class="{whatifTheme.darkMode.toggle} {darkMode ? whatifTheme.darkMode.toggleActive : whatifTheme.darkMode.toggleInactive}"
>
  <span class="{whatifTheme.darkMode.toggleSwitch} {darkMode ? whatifTheme.darkMode.toggleSwitchActive : whatifTheme.darkMode.toggleSwitchInactive}"></span>
</button>
```

## 🎨 Color Palette

### Primary Colors (Purple)

- `purple-50`: #faf5ff (Very light purple)
- `purple-600`: #9333ea (Main brand color)
- `purple-700`: #7c3aed (Darker purple)

### Secondary Colors (Blue)

- `blue-50`: #eff6ff (Very light blue)
- `blue-600`: #2563eb (Secondary brand color)
- `blue-700`: #1d4ed8 (Darker blue)

### Neutral Colors

- `gray-50`: #f9fafb (Very light gray)
- `gray-700`: #374151 (Dark gray)
- `gray-900`: #111827 (Very dark gray)

## 📦 Component Categories

### 1. Layout Components

- Containers (narrow, regular, wide)
- Full-height sections
- Responsive spacing

### 2. Form Components

- Text inputs with focus states
- Buttons (primary, secondary, ghost)
- Form validation styles

### 3. Content Components

- Cards (static, interactive, hover effects)
- Typography hierarchy
- Links and navigation

### 4. Feedback Components

- Alerts and notifications
- Toast messages
- Loading states

## 🔧 Customization

### Modify Colors

```javascript
// In theme-config.js, modify the colors object
export const whatifTheme = {
  colors: {
    purple: {
      600: "#your-custom-purple", // Change primary purple
      // ... other shades
    },
  },
  // ... rest of config
};
```

### Add New Component Styles

```javascript
// Add to the components section
components: {
  // ... existing components
  navbar: {
    base: 'bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700',
    sticky: 'sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95'
  }
}
```

## 📱 Framework-Specific Examples

### React Component

```jsx
import { whatifTheme } from "./theme-config";

const Hero = () => (
  <section
    className={`${whatifTheme.gradients.backgroundFull} ${whatifTheme.layout.fullHeight}`}
  >
    <div className={whatifTheme.layout.container}>
      <h1
        className={`${whatifTheme.typography.h1} ${whatifTheme.gradients.titleGradient}`}
      >
        Welcome to Our App
      </h1>
      <button className={whatifTheme.components.button.primary}>
        Get Started
      </button>
    </div>
  </section>
);
```

### Vue Component

```vue
<template>
  <section :class="backgroundClasses">
    <div :class="containerClasses">
      <h1 :class="titleClasses">Welcome to Our App</h1>
      <button :class="buttonClasses">Get Started</button>
    </div>
  </section>
</template>

<script>
import { whatifTheme } from "./theme-config";

export default {
  computed: {
    backgroundClasses() {
      return `${whatifTheme.gradients.backgroundFull} ${whatifTheme.layout.fullHeight}`;
    },
    containerClasses() {
      return whatifTheme.layout.container;
    },
    titleClasses() {
      return `${whatifTheme.typography.h1} ${whatifTheme.gradients.titleGradient}`;
    },
    buttonClasses() {
      return whatifTheme.components.button.primary;
    },
  },
};
</script>
```

## 🚀 Production Tips

1. **Tree Shaking**: Only import the parts of the theme you need
2. **CSS Purging**: Ensure your build process includes CSS purging for smaller bundles
3. **Performance**: Use the pre-built class combinations for better performance
4. **Consistency**: Stick to the defined component styles for design consistency
5. **Accessibility**: The theme includes focus states and proper contrast ratios

## 📄 License

This theme configuration is extracted from the WhatIf.DIY project and is provided as-is for reuse in your projects.

---

**Happy theming! 🎨✨**
