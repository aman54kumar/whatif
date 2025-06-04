<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";

  // Types
  interface AnalysisResult {
    topic: string;
    perspective: string;
    positiveOutcomes: string[];
    potentialChallenges: string[];
    generatedAt: string;
  }

  // State variables
  let topic = "";
  let perspective = "";
  let isLoading = false;
  let result: AnalysisResult | null = null;
  let error = "";
  let usageCount = 0;
  let dailyLimit = 5;

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

  // Check usage count from localStorage and server
  onMount(async () => {
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

    // Also check server-side usage (Redis)
    try {
      const response = await fetch("/.netlify/functions/check-usage");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Use the higher count between local and server
          usageCount = Math.max(usageCount, data.count || 0);
          localStorage.setItem("whatif_usage", usageCount.toString());
        }
      }
    } catch (err) {
      console.log(
        "Using local storage for usage tracking (server unavailable)"
      );
    }

    dailyLimit = parseInt(env.PUBLIC_FREE_TIER_DAILY_LIMIT || "5", 10);

    // Only show "almost at limit" warning on page load, not "daily limit reached"
    // The "daily limit reached" will be shown when user tries to explore
    if (usageCount >= dailyLimit - 1 && usageCount < dailyLimit) {
      showToastNotification(
        "Almost at limit: You have 1 exploration remaining today. Upgrade to Pro for unlimited explorations!",
        "warning"
      );
    }
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

  // Generate scenario analysis
  async function exploreScenario() {
    if (!topic.trim()) {
      error = "Please enter a scenario";
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
      const response = await fetch("/.netlify/functions/generate-pros-cons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          perspective: perspective.trim(),
        }),
      });

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

      if (data.success) {
        result = data.data;

        // Update usage count both locally and potentially on server
        usageCount++;
        localStorage.setItem("whatif_usage", usageCount.toString());

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

        // Try to update server count (best effort, don't fail if it doesn't work)
        try {
          await fetch("/.netlify/functions/check-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ increment: true }),
          });
        } catch (serverErr) {
          console.log("Server usage tracking unavailable, using local storage");
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

<div
  class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col"
>
  <!-- Toast Notification -->
  {#if showToast}
    <div
      class="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right-2 fade-in-0 duration-300"
      class:animate-out={!showToast}
      class:slide-out-to-right-2={!showToast}
      class:fade-out-0={!showToast}
    >
      <div
        class="flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 bg-white"
        class:border-yellow-400={toastType === "warning"}
        class:bg-yellow-50={toastType === "warning"}
        class:border-red-400={toastType === "error"}
        class:bg-red-50={toastType === "error"}
        class:border-blue-400={toastType === "info"}
        class:bg-blue-50={toastType === "info"}
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
            class:text-red-800={toastType === "error"}
            class:text-blue-800={toastType === "info"}
          >
            {toastMessage}
          </p>
          {#if toastType === "warning" || toastType === "error"}
            <a
              href="/pricing"
              class="text-xs underline hover:no-underline mt-1 inline-block"
              class:text-yellow-900={toastType === "warning"}
              class:text-red-900={toastType === "error"}
            >
              Upgrade to Pro →
            </a>
          {/if}
        </div>
        <button
          on:click={() => (showToast = false)}
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
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
  <header class="bg-white shadow-sm border-b border-gray-100">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            <span class="text-purple-600">What</span><span class="text-blue-600"
              >If</span
            ><span class="text-purple-500">.DIY</span>
          </h1>
          <p class="text-gray-600 mt-1">Explore every possibility with AI</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500">Free Tier</div>
          <div class="text-xs text-gray-400">
            {usageCount}/{dailyLimit} explorations today
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content - flex-grow pushes footer to bottom -->
  <main class="max-w-4xl mx-auto px-4 py-8 flex-grow">
    <!-- Input Form -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="space-y-6">
        <div>
          <label
            for="topic"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            What if scenario would you like to explore?
          </label>
          <input
            id="topic"
            type="text"
            bind:value={topic}
            placeholder="What if I started my own business? What if I moved to another country? What if I changed careers?"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            for="perspective"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Perspective (optional)
          </label>
          <input
            id="perspective"
            type="text"
            bind:value={perspective}
            placeholder="e.g., 'environmental', 'financial', 'health', 'family'"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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
              class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          {/if}
        </div>

        {#if error}
          <div
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </div>
        {/if}
      </div>
    </div>

    <!-- Results -->
    {#if result}
      <div
        class="bg-white rounded-xl shadow-lg p-6 mb-8"
        bind:this={resultsSection}
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            What if: {result.topic}
          </h2>
          <button
            on:click={copyToClipboard}
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
        </div>

        {#if result.perspective && result.perspective !== "general"}
          <div class="mb-6 bg-purple-50 border-l-4 border-purple-400 p-4">
            <div class="text-sm text-purple-700">
              <strong>Perspective:</strong>
              {result.perspective}
            </div>
          </div>
        {/if}

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Positive Outcomes -->
          <div class="space-y-4">
            <h3
              class="text-xl font-semibold text-green-800 flex items-center gap-2"
            >
              ✨ Positive Outcomes
            </h3>
            <div class="space-y-3">
              {#each result.positiveOutcomes as outcome, index}
                <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div class="text-green-900">
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
              class="text-xl font-semibold text-orange-800 flex items-center gap-2"
            >
              ⚠️ Potential Challenges
            </h3>
            <div class="space-y-3">
              {#each result.potentialChallenges as challenge, index}
                <div
                  class="bg-orange-50 border border-orange-200 p-4 rounded-lg"
                >
                  <div class="text-orange-900">
                    <span class="font-medium">{index + 1}.</span>
                    {challenge}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="mt-6 text-xs text-gray-500 text-center">
          Generated on {new Date(result.generatedAt).toLocaleDateString()} at {new Date(
            result.generatedAt
          ).toLocaleTimeString()}
        </div>
      </div>
    {/if}

    <!-- Usage Limit Warning -->
    {#if usageCount >= dailyLimit - 1 && usageCount < dailyLimit}
      <div
        class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-8"
      >
        <strong>Almost at limit:</strong> You have 1 exploration remaining
        today.
        <a href="/pricing" class="text-yellow-900 underline hover:no-underline"
          >Upgrade to Pro</a
        > for unlimited explorations!
      </div>
    {:else if usageCount >= dailyLimit}
      <div
        class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8"
      >
        <strong>Daily limit reached:</strong> You've used all {dailyLimit} explorations
        today.
        <a href="/pricing" class="text-red-900 underline hover:no-underline"
          >Upgrade to Pro</a
        > for unlimited access!
      </div>
    {/if}

    <!-- Example Scenarios -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        💡 Example Scenarios to Explore
      </h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each [{ question: "What if I started a coffee shop?", perspective: "financial and lifestyle" }, { question: "What if I learned to code?", perspective: "career and personal growth" }, { question: "What if I adopted a pet?", perspective: "lifestyle and responsibility" }, { question: "What if I moved to Japan?", perspective: "cultural and financial" }, { question: "What if I went back to school?", perspective: "career and financial" }, { question: "What if I started investing?", perspective: "financial and long-term planning" }] as example}
          <button
            on:click={async () => {
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

              // Small delay to ensure UI updates, then auto-explore
              setTimeout(() => {
                exploreScenario();
              }, 100);
            }}
            disabled={isLoading || usageCount >= dailyLimit}
            class="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              class="text-gray-700 group-hover:text-purple-700 font-medium mb-1"
            >
              {example.question}
            </div>
            <div class="text-xs text-gray-500 group-hover:text-purple-600">
              Perspective: {example.perspective}
            </div>
          </button>
        {/each}
      </div>

      <div class="mt-4 text-xs text-gray-500 text-center">
        💡 Click any example above to instantly explore that scenario with AI
        analysis
      </div>
    </div>
  </main>

  <!-- Footer - now sticks to bottom -->
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-gray-600">
          <p>&copy; 2025 WhatIf.DIY. Explore every possibility.</p>
        </div>
        <div class="flex gap-6 text-sm text-gray-500">
          <a href="/privacy" class="hover:text-gray-700 transition-colors"
            >Privacy Policy</a
          >
          <a href="/terms" class="hover:text-gray-700 transition-colors"
            >Terms of Service</a
          >
          <a href="/cookies" class="hover:text-gray-700 transition-colors"
            >Cookie Policy</a
          >
        </div>
      </div>
    </div>
  </footer>
</div>
