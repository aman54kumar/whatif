# 🛠️ DecisionAI - Development Setup Guide

## 🎯 **DEVELOPMENT OVERVIEW**

This guide covers the complete development setup for DecisionAI, from initial installation to advanced features implementation.

## 📋 **PREREQUISITES**

### **Required Software**

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: Latest version
- **VS Code**: Recommended editor
- **Terminal**: Command line access

### **Recommended VS Code Extensions**

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🚀 **PROJECT SETUP**

### **1. Clone & Install**

```bash
# Clone the repository
git clone https://github.com/yourusername/decisionai.git
cd decisionai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### **2. Environment Configuration**

Create `.env` file:

```bash
# AI API Configuration
GEMINI_API_KEY=your_google_gemini_api_key

# Redis Configuration (Optional)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Development Settings
NODE_ENV=development
PORT=8888
```

### **3. Development Server**

```bash
# Start development server with Netlify functions
npm run netlify-dev

# Alternative: Start Svelte dev only (functions won't work)
npm run dev
```

## 🏗️ **PROJECT STRUCTURE**

```
decisionai/
├── src/                          # Svelte application source
│   ├── routes/                   # SvelteKit routes
│   │   ├── +layout.svelte       # Global layout
│   │   ├── +page.svelte         # Homepage
│   │   └── api/                 # API routes (if needed)
│   ├── lib/                     # Shared components & utilities
│   │   ├── components/          # Reusable components
│   │   ├── stores/              # Svelte stores
│   │   └── utils/               # Utility functions
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles
├── netlify/                     # Netlify configuration
│   └── functions/               # Serverless functions
│       ├── generate-pros-cons.js
│       └── check-usage.js
├── static/                      # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                        # Documentation (ignored by git)
├── package.json                 # Dependencies & scripts
├── svelte.config.js            # Svelte configuration
├── tailwind.config.js          # Tailwind CSS config
├── netlify.toml                # Netlify build settings
└── .gitignore                  # Git ignore rules
```

## 🔧 **KEY TECHNOLOGIES**

### **Frontend Stack**

- **SvelteKit**: Full-stack framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Vite**: Build tool & dev server

### **Backend Stack**

- **Netlify Functions**: Serverless backend
- **Google Gemini API**: AI text generation
- **Upstash Redis**: Usage tracking & caching

### **Development Tools**

- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Playwright**: End-to-end testing

## 📝 **DEVELOPMENT SCRIPTS**

### **Available Commands**

```bash
# Development
npm run dev              # Start Vite dev server
npm run netlify-dev      # Start with Netlify functions
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript checking

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests

# Deployment
npm run deploy          # Deploy to Netlify
```

## 🎨 **STYLING SYSTEM**

### **Tailwind Configuration**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
};
```

### **Color Palette**

```css
/* Primary Colors */
--emerald-50: #ecfdf5;
--emerald-500: #10b981;
--emerald-600: #059669;

/* Secondary Colors */
--blue-50: #eff6ff;
--blue-500: #3b82f6;
--blue-600: #2563eb;

/* Status Colors */
--red-50: #fef2f2;
--red-500: #ef4444;
--green-50: #f0fdf4;
--green-500: #22c55e;
```

## 🔌 **API INTEGRATION**

### **Google Gemini API Setup**

```javascript
// lib/ai-service.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateProsAndCons(topic, perspective = "general") {
  const prompt = `
    Analyze: "${topic}"
    Perspective: ${perspective}
    
    Provide a balanced analysis with:
    - 4-6 specific pros
    - 4-6 specific cons
    
    Format as JSON:
    {
      "pros": ["point 1", "point 2", ...],
      "cons": ["point 1", "point 2", ...]
    }
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### **Redis Integration**

```javascript
// lib/redis-service.js
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function trackUsage(userIP) {
  const today = new Date().toDateString();
  const key = `usage:${userIP}:${today}`;

  const usage = await redis.incr(key);
  await redis.expire(key, 86400); // 24 hours

  return usage;
}
```

## 🧪 **TESTING STRATEGY**

### **Unit Testing**

```javascript
// tests/utils.test.js
import { describe, it, expect } from "vitest";
import { validateTopic } from "../src/lib/utils";

describe("validateTopic", () => {
  it("should return true for valid topics", () => {
    expect(validateTopic("buying a house")).toBe(true);
  });

  it("should return false for empty topics", () => {
    expect(validateTopic("")).toBe(false);
  });
});
```

### **End-to-End Testing**

```javascript
// tests/e2e/homepage.test.js
import { test, expect } from "@playwright/test";

test("should generate pros and cons", async ({ page }) => {
  await page.goto("/");

  await page.fill('[data-testid="topic-input"]', "working from home");
  await page.click('[data-testid="generate-button"]');

  await expect(page.locator('[data-testid="results"]')).toBeVisible();
  await expect(page.locator('[data-testid="pros-list"]')).toContainText("pros");
  await expect(page.locator('[data-testid="cons-list"]')).toContainText("cons");
});
```

## 🔒 **SECURITY CONSIDERATIONS**

### **Environment Variables**

- Never commit `.env` files
- Use different keys for development/production
- Rotate API keys regularly

### **Input Validation**

```javascript
// lib/validation.js
export function sanitizeInput(input) {
  return input
    .trim()
    .slice(0, 200) // Limit length
    .replace(/[<>]/g, ""); // Remove potential HTML
}

export function validateTopic(topic) {
  if (!topic || topic.length < 3) return false;
  if (topic.length > 200) return false;
  if (/[<>]/.test(topic)) return false;
  return true;
}
```

### **Rate Limiting**

```javascript
// netlify/functions/rate-limit.js
const rateLimits = new Map();

export function checkRateLimit(ip, limit = 10, window = 60000) {
  const now = Date.now();
  const userLimits = rateLimits.get(ip) || {
    count: 0,
    resetTime: now + window,
  };

  if (now > userLimits.resetTime) {
    userLimits.count = 0;
    userLimits.resetTime = now + window;
  }

  if (userLimits.count >= limit) {
    return false;
  }

  userLimits.count++;
  rateLimits.set(ip, userLimits);
  return true;
}
```

## 📊 **PERFORMANCE OPTIMIZATION**

### **Bundle Optimization**

```javascript
// vite.config.js
import { sveltekit } from "@sveltejs/kit/vite";

export default {
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["@google/generative-ai"],
          utils: ["src/lib/utils"],
        },
      },
    },
  },
};
```

### **Image Optimization**

```html
<!-- Optimized image loading -->
<img
  src="/images/hero.webp"
  alt="Decision making illustration"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
/>
```

### **Code Splitting**

```javascript
// Dynamic imports for large components
import { onMount } from "svelte";

let AdvancedFeatures;

onMount(async () => {
  const module = await import("$lib/components/AdvancedFeatures.svelte");
  AdvancedFeatures = module.default;
});
```

## 🔄 **STATE MANAGEMENT**

### **Svelte Stores**

```javascript
// lib/stores/app.js
import { writable } from "svelte/store";

export const user = writable(null);
export const usageCount = writable(0);
export const isLoading = writable(false);

// Derived stores
export const canGenerate = derived(
  usageCount,
  ($usageCount) => $usageCount < 5
);
```

### **Local Storage Integration**

```javascript
// lib/stores/persistent.js
import { writable } from "svelte/store";
import { browser } from "$app/environment";

function createPersistentStore(key, initialValue) {
  const { subscribe, set, update } = writable(initialValue);

  return {
    subscribe,
    set: (value) => {
      if (browser) {
        localStorage.setItem(key, JSON.stringify(value));
      }
      set(value);
    },
    update,
  };
}

export const savedDecisions = createPersistentStore("decisions", []);
```

## 🚀 **FEATURE DEVELOPMENT**

### **Adding New Features**

1. Create feature branch: `git checkout -b feature/export-pdf`
2. Implement feature with tests
3. Update documentation
4. Create pull request
5. Deploy to staging
6. Test thoroughly
7. Deploy to production

### **Feature Flags**

```javascript
// lib/feature-flags.js
export const features = {
  exportPDF: process.env.NODE_ENV === "production",
  teamFeatures: false,
  advancedAI: false,
};
```

## 🐛 **DEBUGGING**

### **Common Issues**

1. **Functions not working in dev**

   ```bash
   # Use netlify-dev instead of regular dev
   npm run netlify-dev
   ```

2. **Environment variables not loading**

   ```bash
   # Check .env file exists and has correct format
   # Restart development server
   ```

3. **Build failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .svelte-kit
   npm install
   npm run build
   ```

### **Debugging Tools**

```javascript
// Debug utility
export function debug(label, data) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEBUG] ${label}:`, data);
  }
}
```

## 📦 **DEPLOYMENT PREPARATION**

### **Pre-deployment Checklist**

- [ ] Update environment variables
- [ ] Test all functionality
- [ ] Run build locally
- [ ] Check bundle size
- [ ] Verify SEO metadata
- [ ] Test mobile responsiveness

### **Build Command**

```bash
# Production build
npm run build

# Test production build locally
npm run preview
```

This development guide provides everything needed to work effectively on DecisionAI, from setup to advanced features.
