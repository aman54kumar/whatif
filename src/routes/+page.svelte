<script lang="ts">
  import { onMount } from "svelte";
  import SEO from "$lib/components/SEO.svelte";

  // Types
  interface AnalysisResult {
    topic: string;
    perspective: string;
    positiveOutcomes: string[];
    potentialChallenges: string[];
    generatedAt: string;
  }

  interface UserSettings {
    darkMode: boolean;
    resultsCount: number;
    lastUpdated: string;
  }

  // State variables
  let topic = "";
  let perspective = "";
  let isLoading = false;
  let result: AnalysisResult | null = null;
  let error = "";
  let usageCount = 0;
  let dailyLimit = 10;

  // User settings
  let userSettings: UserSettings = {
    darkMode: false,
    resultsCount: 7,
    lastUpdated: new Date().toISOString(),
  };

  // SEO data based on current state
  $: seoTitle = result
    ? `What if: ${result.topic} - WhatIf.DIY Analysis`
    : "WhatIf.DIY - AI-Powered Scenario Explorer | Free Decision Making Tool";

  $: seoDescription = result
    ? `Explore the scenario "${result.topic}" with ${result.positiveOutcomes.length} positive outcomes and ${result.potentialChallenges.length} potential challenges. AI-powered analysis for better decision making.`
    : "Explore any what if scenario with AI-powered analysis. Get instant insights into positive outcomes and potential challenges for smarter decision making. Free tool with unlimited possibilities.";

  $: seoKeywords = result
    ? `what if ${result.topic}, ${result.topic} analysis, ${result.topic} outcomes, ${result.topic} challenges, scenario planning, decision making, AI analysis`
    : "what if analysis, scenario planning, decision making tool, AI scenario explorer, future planning, risk assessment, opportunity analysis, decision support, what if scenarios, free planning tool";

  // Structured data for the current scenario
  $: structuredData = result
    ? {
        "@context": "https://schema.org",
        "@type": ["WebPage", "AnalysisReport"],
        name: `What if: ${result.topic}`,
        headline: `AI Analysis: ${result.topic}`,
        description: seoDescription,
        url: "https://whatif.diy/",
        dateCreated: result.generatedAt,
        datePublished: result.generatedAt,
        about: {
          "@type": "Thing",
          name: result.topic,
          description: `Scenario analysis of: ${result.topic}`,
        },
        publisher: {
          "@type": "Organization",
          name: "WhatIf.DIY",
          url: "https://whatif.diy/",
          logo: {
            "@type": "ImageObject",
            url: "https://whatif.diy/favicon.png",
          },
        },
        mainEntity: {
          "@type": "AnalysisReport",
          name: `Analysis: ${result.topic}`,
          description: `Comprehensive analysis showing ${result.positiveOutcomes.length} positive outcomes and ${result.potentialChallenges.length} potential challenges`,
          dateCreated: result.generatedAt,
          creator: {
            "@type": "SoftwareApplication",
            name: "WhatIf.DIY AI Engine",
          },
        },
        potentialAction: {
          "@type": "AnalyzeAction",
          name: "Analyze Scenario",
          description: "Get AI-powered analysis of any what-if scenario",
          target: "https://whatif.diy/",
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": ["WebPage", "SoftwareApplication"],
        name: "WhatIf.DIY - AI Scenario Explorer",
        headline: "Explore Every Possibility with AI-Powered Analysis",
        description: seoDescription,
        url: "https://whatif.diy/",
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free tier with 10 daily scenario explorations",
        },
        featureList: [
          "AI-powered scenario analysis",
          "Positive outcome identification",
          "Challenge assessment",
          "Decision support",
          "Real-time insights",
        ],
        publisher: {
          "@type": "Organization",
          name: "WhatIf.DIY",
          url: "https://whatif.diy/",
          logo: {
            "@type": "ImageObject",
            url: "https://whatif.diy/favicon.png",
          },
        },
        potentialAction: {
          "@type": "UseAction",
          name: "Explore Scenario",
          description: "Analyze any what-if scenario with AI",
          target: "https://whatif.diy/",
          object: {
            "@type": "WebPageElement",
            description: "Scenario input form",
          },
        },
      };

  // Function to apply dark mode to document
  function applyDarkMode(isDark: boolean) {
    if (typeof document !== "undefined") {
      console.log("Applying dark mode:", isDark);
      console.log(
        "Document classes before:",
        document.documentElement.className
      );

      // Force remove and add to ensure clean state
      document.documentElement.classList.remove("dark");

      if (isDark) {
        document.documentElement.classList.add("dark");
      }

      console.log(
        "Document classes after:",
        document.documentElement.className
      );
      console.log(
        "Has dark class:",
        document.documentElement.classList.contains("dark")
      );

      // Force a style recalculation
      document.documentElement.style.setProperty(
        "--force-update",
        Math.random().toString()
      );
    }
  }

  // Reactive statement to ensure dark mode is applied whenever userSettings.darkMode changes
  $: {
    console.log(
      "Reactive statement triggered, darkMode:",
      userSettings.darkMode
    );
    applyDarkMode(userSettings.darkMode);
  }

  let showSettings = false;

  // Toast notification state
  let showToast = false;
  let toastMessage = "";
  let toastType: "warning" | "error" | "info" = "warning";

  // Reference to results section for auto-scrolling
  let resultsSection: HTMLElement;

  // Show toast notification
  function showToastNotification(
    message: string,
    type: "warning" | "error" | "info" = "warning"
  ) {
    toastMessage = message;
    toastType = type;
    showToast = true;
    // Auto-hide after 5 seconds
    setTimeout(() => {
      showToast = false;
    }, 5000);
  }

  // Load user settings from Redis
  async function loadUserSettings() {
    try {
      const response = await fetch(
        "/.netlify/functions/user-data?action=settings"
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          console.log("Loaded settings from server:", data.settings);

          // Update userSettings with proper reactivity
          userSettings = {
            ...userSettings,
            ...data.settings,
          };

          console.log("Final userSettings after loading:", userSettings);

          // Explicitly apply dark mode after loading
          applyDarkMode(userSettings.darkMode);
        }
      }
    } catch (err) {
      console.log("Failed to load user settings, using defaults");
      // Ensure default light mode is applied
      applyDarkMode(false);
    }
  }

  // Save user settings to Redis
  async function saveUserSettings() {
    try {
      const response = await fetch(
        "/.netlify/functions/user-data?action=settings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userSettings),
        }
      );

      if (response.ok) {
        showToastNotification("Settings saved successfully!", "info");
      }
    } catch (err) {
      console.log("Failed to save user settings");
    }
  }

  // Toggle dark mode
  function toggleDarkMode() {
    console.log(
      "Toggle dark mode called, current state:",
      userSettings.darkMode
    );

    const newDarkMode = !userSettings.darkMode;
    console.log("New dark mode state will be:", newDarkMode);

    // Update the userSettings object with proper reactivity
    userSettings = {
      ...userSettings,
      darkMode: newDarkMode,
      lastUpdated: new Date().toISOString(),
    };

    console.log("Updated userSettings:", userSettings);

    // Immediately apply the dark mode change
    applyDarkMode(newDarkMode);

    // Save to server
    saveUserSettings();
  }

  // Update results count
  function updateResultsCount(count: number) {
    if (count >= 3 && count <= 10) {
      userSettings.resultsCount = count;
      userSettings.lastUpdated = new Date().toISOString();
      saveUserSettings();
    }
  }

  // Check usage count from localStorage and server
  onMount(async () => {
    console.log("onMount called, initial userSettings:", userSettings);

    // Load user settings first
    await loadUserSettings();

    console.log("After loadUserSettings, userSettings:", userSettings);

    const today = new Date().toDateString();
    const storedUsage = localStorage.getItem("whatif_usage");
    const storedDate = localStorage.getItem("whatif_date");

    // Reset local storage for new day
    if (storedDate !== today) {
      localStorage.setItem("whatif_date", today);
      localStorage.setItem("whatif_usage", "0");
      usageCount = 0;
    } else if (storedUsage) {
      usageCount = parseInt(storedUsage, 10);
    }

    // Check server-side usage (Redis) and sync
    try {
      const response = await fetch(
        "/.netlify/functions/user-data?action=usage"
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redisAvailable) {
          // Use Redis count as source of truth
          usageCount = data.count || 0;
          dailyLimit = data.limit || 10;

          // Sync localStorage with Redis
          localStorage.setItem("whatif_usage", usageCount.toString());
          localStorage.setItem("whatif_limit", dailyLimit.toString());
        }
      }
    } catch (err) {
      console.log("Redis unavailable, using localStorage fallback");
    }

    // Set the daily limit
    dailyLimit = parseInt("10", 10);

    // Only show "almost at limit" warning on page load, not "daily limit reached"
    // The "daily limit reached" will be shown when user tries to explore
    if (usageCount >= dailyLimit - 1 && usageCount < dailyLimit) {
      showToastNotification(
        "Almost at limit: You have 1 exploration remaining today. Upgrade to Pro for unlimited explorations!",
        "warning"
      );
    }

    // Final check and force apply dark mode state
    console.log(
      "Final onMount check - applying darkMode:",
      userSettings.darkMode
    );
    applyDarkMode(userSettings.darkMode);
  });

  // Calculate hours remaining until midnight (daily reset)
  function getHoursUntilReset(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    const diffMs = tomorrow.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60)); // Convert to hours, round up
  }

  // Security utilities
  function sanitizeInput(input: string): string {
    if (!input) return "";

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove HTML/XML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/javascript:/gi, "") // Remove javascript: schemes
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .substring(0, 500); // Limit length
  }

  function validateTopic(topic: string): { valid: boolean; error?: string } {
    if (!topic || topic.trim().length < 3) {
      return { valid: false, error: "Please enter at least 3 characters" };
    }

    if (topic.length > 500) {
      return { valid: false, error: "Topic is too long (max 500 characters)" };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /<script/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\.|window\./i,
      /\.innerHTML/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(topic)) {
        return { valid: false, error: "Invalid characters detected" };
      }
    }

    return { valid: true };
  }

  // Generate scenario analysis
  async function exploreScenario() {
    // Validate and sanitize inputs
    const validation = validateTopic(topic);
    if (!validation.valid) {
      error = validation.error || "Invalid input";
      return;
    }

    const sanitizedTopic = sanitizeInput(topic);
    const sanitizedPerspective = sanitizeInput(perspective);

    if (!sanitizedTopic.trim()) {
      error = "Please enter a valid scenario";
      return;
    }

    if (usageCount >= dailyLimit) {
      const hoursRemaining = getHoursUntilReset();
      const hourText = hoursRemaining === 1 ? "hour" : "hours";
      const message = `You've reached your daily limit of ${dailyLimit} scenario explorations. Upgrade to Pro for unlimited access or wait ${hoursRemaining} ${hourText} to try again!`;
      error = message;
      showToastNotification(message, "error");
      return;
    }

    // Clear previous error
    error = "";
    isLoading = true;
    result = null;

    try {
      const requestBody = {
        topic: sanitizedTopic,
        perspective: sanitizedPerspective,
        resultsCount: userSettings.resultsCount,
      };

      // Add request size validation
      const requestSize = JSON.stringify(requestBody).length;
      if (requestSize > 10240) {
        // 10KB limit
        error = "Request too large. Please shorten your input.";
        return;
      }

      const response = await fetch("/.netlify/functions/generate-pros-cons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // CSRF protection
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          const waitTime = retryAfter ? `${retryAfter} seconds` : "a moment";
          error = `Rate limit exceeded. Please wait ${waitTime} before trying again.`;
          showToastNotification(error, "error");
          return;
        } else if (response.status === 413) {
          error = "Request too large. Please shorten your input.";
          return;
        } else if (response.status >= 500) {
          error = "Service temporarily unavailable. Please try again.";
          return;
        }
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors with specific messages
        if (response.status === 400) {
          error = data.error || "Please enter a valid scenario";
        } else {
          error = data.error || "Failed to explore scenario";
        }
        return;
      }

      if (data.success && data.data) {
        // Validate response data structure
        if (
          !data.data.positiveOutcomes ||
          !data.data.potentialChallenges ||
          !Array.isArray(data.data.positiveOutcomes) ||
          !Array.isArray(data.data.potentialChallenges)
        ) {
          error = "Invalid response format. Please try again.";
          return;
        }

        result = data.data;

        // Update usage count with enhanced error handling
        try {
          const usageResponse = await fetch(
            "/.netlify/functions/user-data?action=usage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },
              body: JSON.stringify({ increment: true }),
            }
          );

          if (usageResponse.ok) {
            const usageData = await usageResponse.json();
            if (usageData.success && usageData.redisAvailable) {
              // Use Redis count as source of truth
              usageCount = usageData.count;
              dailyLimit = usageData.limit || 10;
              localStorage.setItem("whatif_usage", usageCount.toString());
              localStorage.setItem("whatif_limit", dailyLimit.toString());
            } else {
              // Fallback to localStorage
              usageCount++;
              localStorage.setItem("whatif_usage", usageCount.toString());
            }
          } else if (usageResponse.status === 429) {
            // Rate limited on usage check
            console.warn("Usage check rate limited");
          } else {
            // Fallback to localStorage
            usageCount++;
            localStorage.setItem("whatif_usage", usageCount.toString());
          }
        } catch (serverErr) {
          console.log("Redis unavailable, using localStorage");
          usageCount++;
          localStorage.setItem("whatif_usage", usageCount.toString());
        }

        // Show usage warning toasts after successful exploration
        if (usageCount >= dailyLimit) {
          const hoursRemaining = getHoursUntilReset();
          const hourText = hoursRemaining === 1 ? "hour" : "hours";
          showToastNotification(
            `Daily limit reached! You've used all ${dailyLimit} explorations today. Upgrade to Pro for unlimited access or wait ${hoursRemaining} ${hourText} for reset!`,
            "error"
          );
        } else if (usageCount >= dailyLimit - 1) {
          showToastNotification(
            "Almost at limit: You have 1 exploration remaining today. Upgrade to Pro for unlimited explorations!",
            "warning"
          );
        }

        // Auto-scroll to results section after a brief delay to ensure DOM update
        setTimeout(() => {
          if (resultsSection) {
            resultsSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        error = "Invalid response format. Please try again.";
      }
    } catch (err) {
      if (err instanceof Error) {
        error = err.message.includes("fetch")
          ? "Network error. Please check your connection and try again."
          : err.message;
      } else {
        error = "An unexpected error occurred. Please try again.";
      }
    } finally {
      isLoading = false;
    }
  }

  // Clear results
  function clearResults() {
    result = null;
    error = "";
    topic = "";
    perspective = "";
  }

  // Copy to clipboard
  async function copyToClipboard() {
    if (!result) return;

    const text = `What if: ${result.topic}
${result.perspective !== "general" ? `Perspective: ${result.perspective}` : ""}

POSITIVE OUTCOMES:
${result.positiveOutcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join("\n")}

POTENTIAL CHALLENGES:
${result.potentialChallenges.map((challenge, i) => `${i + 1}. ${challenge}`).join("\n")}

Explored with WhatIf.DIY`;

    try {
      await navigator.clipboard.writeText(text);
      showToastNotification("Analysis copied to clipboard!", "info");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }
</script>

<svelte:head>
  <title>WhatIf.DIY - Explore Every Possibility with AI</title>
  <meta
    name="description"
    content="Explore any what if scenario with AI-powered analysis. Discover positive outcomes and potential challenges for better decision making."
  />
  <meta
    name="keywords"
    content="what if analysis, scenario planning, decision making, AI, possibilities, outcomes"
  />
  <meta
    name="google-site-verification"
    content="eJ5Y3n92tpo5o4XHf0P2peoaHmFea-TOYq7DAFAtOUc"
  />
  <!-- Google Analytics -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-3MVWQJVYYM"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-3MVWQJVYYM");
  </script>
</svelte:head>

<SEO
  title={seoTitle}
  description={seoDescription}
  keywords={seoKeywords}
  {structuredData}
  image="https://whatif.diy/og-image.png"
  imageAlt="WhatIf.DIY - AI-powered scenario exploration and analysis tool"
/>

<div
  class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex flex-col transition-colors duration-300"
  itemscope
  itemtype="https://schema.org/WebPage"
>
  <meta itemprop="name" content={seoTitle} />
  <meta itemprop="description" content={seoDescription} />

  <!-- Toast Notification -->
  {#if showToast}
    <div
      class="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right-2 fade-in-0 duration-300"
      class:animate-out={!showToast}
      class:slide-out-to-right-2={!showToast}
      class:fade-out-0={!showToast}
    >
      <div
        class="flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 bg-white dark:bg-gray-800"
        class:border-yellow-400={toastType === "warning"}
        class:bg-yellow-50={toastType === "warning"}
        class:dark:bg-yellow-900={toastType === "warning"}
        class:border-red-400={toastType === "error"}
        class:bg-red-50={toastType === "error"}
        class:dark:bg-red-900={toastType === "error"}
        class:border-blue-400={toastType === "info"}
        class:bg-blue-50={toastType === "info"}
        class:dark:bg-blue-900={toastType === "info"}
      >
        <div class="flex-shrink-0">
          {#if toastType === "warning"}
            <span class="text-2xl">⚠️</span>
          {:else if toastType === "error"}
            <span class="text-2xl">🚫</span>
          {:else}
            <span class="text-2xl">ℹ️</span>
          {/if}
        </div>
        <div class="flex-1">
          <p
            class="text-sm font-medium"
            class:text-yellow-800={toastType === "warning"}
            class:dark:text-yellow-200={toastType === "warning"}
            class:text-red-800={toastType === "error"}
            class:dark:text-red-200={toastType === "error"}
            class:text-blue-800={toastType === "info"}
            class:dark:text-blue-200={toastType === "info"}
          >
            {toastMessage}
          </p>
          {#if toastType === "warning" || toastType === "error"}
            <a
              href="/pricing"
              class="text-xs underline hover:no-underline mt-1 inline-block"
              class:text-yellow-900={toastType === "warning"}
              class:dark:text-yellow-300={toastType === "warning"}
              class:text-red-900={toastType === "error"}
              class:dark:text-red-300={toastType === "error"}
            >
              Upgrade to Pro →
            </a>
          {/if}
        </div>
        <button
          on:click={() => (showToast = false)}
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <span class="sr-only">Close</span>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <!-- Header -->
  <header
    class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors duration-300"
    itemscope
    itemtype="https://schema.org/WPHeader"
  >
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div itemscope itemtype="https://schema.org/Organization">
          <h1
            class="text-3xl font-bold text-gray-900 dark:text-white"
            itemprop="name"
          >
            <span class="text-purple-600 dark:text-purple-400">What</span><span
              class="text-blue-600 dark:text-blue-400">If</span
            ><span class="text-purple-500 dark:text-purple-300">.DIY</span>
          </h1>
          <p
            class="text-gray-600 dark:text-gray-300 mt-1"
            itemprop="description"
          >
            Explore every possibility with AI
          </p>
          <meta itemprop="url" content="https://whatif.diy/" />
          <meta itemprop="logo" content="https://whatif.diy/favicon.png" />
        </div>
        <div class="flex items-center gap-4">
          <!-- Dark mode toggle -->
          <button
            on:click={toggleDarkMode}
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={userSettings.darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"}
          >
            {#if userSettings.darkMode}
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clip-rule="evenodd"
                />
              </svg>
            {:else}
              <svg
                class="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                />
              </svg>
            {/if}
          </button>

          <!-- Settings button -->
          <button
            on:click={() => (showSettings = !showSettings)}
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Settings"
          >
            <svg
              class="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <div class="text-right">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Free Tier
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500">
              {usageCount}/{dailyLimit} explorations today
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Settings Panel -->
  {#if showSettings}
    <div
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <div class="max-w-4xl mx-auto px-4 py-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚙️ Settings
        </h2>

        <div class="space-y-4">
          <!-- Results Count Setting -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Number of results per exploration
            </label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="10"
                bind:value={userSettings.resultsCount}
                on:change={() => updateResultsCount(userSettings.resultsCount)}
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <span
                class="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center"
              >
                {userSettings.resultsCount}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose between 3-10 positive outcomes and challenges for each
              exploration
            </p>
          </div>

          <!-- Dark Mode Setting -->
          <div class="flex items-center justify-between">
            <div>
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Dark Mode
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Toggle between light and dark theme
              </p>
            </div>
            <button
              on:click={toggleDarkMode}
              class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                userSettings.darkMode ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <span
                class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userSettings.darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          💡 Settings are automatically saved to your account
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Content - flex-grow pushes footer to bottom -->
  <main
    class="max-w-4xl mx-auto px-4 py-8 flex-grow"
    itemscope
    itemtype="https://schema.org/WebPageElement"
    itemprop="mainContentOfPage"
  >
    <!-- Input Form -->
    <section
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300"
      itemscope
      itemtype="https://schema.org/WebPageElement"
      itemprop="mainEntity"
      aria-label="Scenario Analysis Form"
    >
      <div class="space-y-6">
        <div>
          <label
            for="topic"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            What if scenario would you like to explore?
          </label>
          <input
            id="topic"
            type="text"
            bind:value={topic}
            placeholder="What if I started my own business? What if I moved to another country? What if I changed careers?"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
            aria-describedby="topic-description"
            itemprop="query"
          />
          <div id="topic-description" class="sr-only">
            Enter any what-if scenario you'd like to explore with AI analysis
          </div>
        </div>

        <div>
          <label
            for="perspective"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Perspective (optional)
          </label>
          <input
            id="perspective"
            type="text"
            bind:value={perspective}
            placeholder="e.g., 'environmental', 'financial', 'health', 'family'"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
        </div>

        <div class="flex gap-4">
          <button
            on:click={exploreScenario}
            disabled={isLoading || !topic.trim() || usageCount >= dailyLimit}
            class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {#if isLoading}
              <div
                class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
              ></div>
              Exploring...
            {:else}
              🔮 Explore This Scenario
            {/if}
          </button>

          {#if result}
            <button
              on:click={clearResults}
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          {/if}
        </div>

        {#if error}
          <div
            class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg"
          >
            {error}
          </div>
        {/if}
      </div>
    </section>

    <!-- Results -->
    {#if result}
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300"
        bind:this={resultsSection}
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            What if: {result.topic}
          </h2>
          <button
            on:click={copyToClipboard}
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
        </div>

        {#if result.perspective && result.perspective !== "general"}
          <div
            class="mb-6 bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-400 p-4"
          >
            <div class="text-sm text-purple-700 dark:text-purple-200">
              <strong>Perspective:</strong>
              {result.perspective}
            </div>
          </div>
        {/if}

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Positive Outcomes -->
          <div class="space-y-4">
            <h3
              class="text-xl font-semibold text-green-800 dark:text-green-300 flex items-center gap-2"
            >
              ✨ Positive Outcomes
            </h3>
            <div class="space-y-3">
              {#each result.positiveOutcomes as outcome, index}
                <div
                  class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded-lg"
                >
                  <div class="text-green-900 dark:text-green-100">
                    <span class="font-medium">{index + 1}.</span>
                    {outcome}
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Potential Challenges -->
          <div class="space-y-4">
            <h3
              class="text-xl font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-2"
            >
              ⚠️ Potential Challenges
            </h3>
            <div class="space-y-3">
              {#each result.potentialChallenges as challenge, index}
                <div
                  class="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 p-4 rounded-lg"
                >
                  <div class="text-orange-900 dark:text-orange-100">
                    <span class="font-medium">{index + 1}.</span>
                    {challenge}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          Generated on {new Date(result.generatedAt).toLocaleDateString()} at {new Date(
            result.generatedAt
          ).toLocaleTimeString()}
        </div>
      </div>
    {/if}

    <!-- Usage Limit Warning -->
    {#if usageCount >= dailyLimit - 1 && usageCount < dailyLimit}
      <div
        class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg mb-8"
      >
        <strong>Almost at limit:</strong> You have 1 exploration remaining
        today.
        <a
          href="/pricing"
          class="text-yellow-900 dark:text-yellow-300 underline hover:no-underline"
          >Upgrade to Pro</a
        > for unlimited explorations!
      </div>
    {:else if usageCount >= dailyLimit}
      <div
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-8"
      >
        <strong>Daily limit reached:</strong> You've used all {dailyLimit} explorations
        today.
        <a
          href="/pricing"
          class="text-red-900 dark:text-red-300 underline hover:no-underline"
          >Upgrade to Pro</a
        > for unlimited access!
      </div>
    {/if}

    <!-- Example Scenarios -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        💡 Example Scenarios to Explore
      </h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each [{ question: "What if I started a coffee shop?", perspective: "financial and lifestyle" }, { question: "What if I learned to code?", perspective: "career and personal growth" }, { question: "What if I adopted a pet?", perspective: "lifestyle and responsibility" }, { question: "What if I moved to Japan?", perspective: "cultural and financial" }, { question: "What if I went back to school?", perspective: "career and financial" }, { question: "What if I started investing?", perspective: "financial and long-term planning" }] as example}
          <button
            on:click={() => {
              // Check usage limit before proceeding
              if (usageCount >= dailyLimit) {
                const hoursRemaining = getHoursUntilReset();
                const hourText = hoursRemaining === 1 ? "hour" : "hours";
                const message = `You've reached your daily limit of ${dailyLimit} scenario explorations. Upgrade to Pro for unlimited access or wait ${hoursRemaining} ${hourText} to try again!`;
                error = message;
                showToastNotification(message, "error");
                return;
              }

              // Set the form values
              topic = example.question;
              perspective = example.perspective;

              // Clear any previous errors
              error = "";

              // Auto-explore immediately
              exploreScenario();
            }}
            disabled={isLoading || usageCount >= dailyLimit}
            class="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors group"
            class:hover:border-purple-300={!(
              isLoading || usageCount >= dailyLimit
            )}
            class:hover:bg-purple-50={!(isLoading || usageCount >= dailyLimit)}
            class:dark:hover:bg-purple-900={!(
              isLoading || usageCount >= dailyLimit
            )}
            class:disabled:opacity-50={isLoading || usageCount >= dailyLimit}
            class:disabled:cursor-not-allowed={isLoading ||
              usageCount >= dailyLimit}
            class:bg-white={!(isLoading || usageCount >= dailyLimit)}
            class:dark:bg-gray-800={!(isLoading || usageCount >= dailyLimit)}
            class:bg-gray-100={isLoading || usageCount >= dailyLimit}
            class:dark:bg-gray-700={isLoading || usageCount >= dailyLimit}
          >
            <div
              class="font-medium mb-1 transition-colors"
              class:text-gray-700={!(isLoading || usageCount >= dailyLimit)}
              class:dark:text-gray-300={!(
                isLoading || usageCount >= dailyLimit
              )}
              class:group-hover:text-purple-700={!(
                isLoading || usageCount >= dailyLimit
              )}
              class:dark:group-hover:text-purple-300={!(
                isLoading || usageCount >= dailyLimit
              )}
              class:text-gray-400={isLoading || usageCount >= dailyLimit}
              class:dark:text-gray-500={isLoading || usageCount >= dailyLimit}
            >
              {example.question}
            </div>
            <div
              class="text-xs transition-colors"
              class:text-gray-500={!(isLoading || usageCount >= dailyLimit)}
              class:dark:text-gray-400={!(
                isLoading || usageCount >= dailyLimit
              )}
              class:group-hover:text-purple-600={!(
                isLoading || usageCount >= dailyLimit
              )}
              class:dark:group-hover:text-purple-400={!(
                isLoading || usageCount >= dailyLimit
              )}
              class:text-gray-400={isLoading || usageCount >= dailyLimit}
              class:dark:text-gray-600={isLoading || usageCount >= dailyLimit}
            >
              Perspective: {example.perspective}
            </div>
          </button>
        {/each}
      </div>

      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Click any example above to instantly explore that scenario with AI
        analysis
      </div>
    </div>

    <!-- Newsletter Signup for Monetization -->
    <div
      class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-xl shadow-lg p-6 mt-8"
    >
      <div class="text-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          📧 Get Weekly Scenario Planning Tips
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Join 1000+ decision makers who receive exclusive scenario templates,
          decision-making frameworks, and strategic planning insights.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Subscribe
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Free forever. Unsubscribe anytime. No spam.
        </p>
      </div>
    </div>

    <!-- Sponsored Content Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 border-l-4 border-blue-500"
    >
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          🎯 Recommended for Decision Makers
        </h3>
        <span
          class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
        >
          Sponsored
        </span>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <a
          href="https://www.skillshare.com/browse/business"
          target="_blank"
          rel="noopener noreferrer"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="font-medium text-gray-900 dark:text-white mb-1">
            📚 Strategic Thinking Courses
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Learn advanced decision-making frameworks and scenario planning
            techniques from industry experts.
          </div>
        </a>

        <a
          href="https://www.notion.so/templates"
          target="_blank"
          rel="noopener noreferrer"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="font-medium text-gray-900 dark:text-white mb-1">
            📋 Planning Templates
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Professional templates for business planning, decision matrices, and
            strategic analysis.
          </div>
        </a>
      </div>

      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 These resources help you implement insights from your scenario
        analysis
      </div>
    </div>
  </main>

  <!-- Footer - now sticks to bottom -->
  <footer
    class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300"
  >
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 WhatIf.DIY. Explore every possibility.</p>
        </div>
        <div class="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
          <a
            href="/privacy"
            class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >Privacy Policy</a
          >
          <a
            href="/terms"
            class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >Terms of Service</a
          >
          <a
            href="/cookies"
            class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >Cookie Policy</a
          >
        </div>
      </div>
    </div>
  </footer>
</div>
