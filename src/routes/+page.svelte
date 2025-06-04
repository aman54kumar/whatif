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

  // Check usage count from localStorage
  onMount(() => {
    const today = new Date().toDateString();
    const storedUsage = localStorage.getItem("whatif_usage");
    const storedDate = localStorage.getItem("whatif_date");

    if (storedDate === today && storedUsage) {
      usageCount = parseInt(storedUsage, 10);
    } else {
      // Reset count for new day
      localStorage.setItem("whatif_date", today);
      localStorage.setItem("whatif_usage", "0");
      usageCount = 0;
    }

    dailyLimit = parseInt(env.PUBLIC_FREE_TIER_DAILY_LIMIT || "5", 10);
  });

  // Generate scenario analysis
  async function exploreScenario() {
    if (!topic.trim()) {
      error = "Please enter a scenario";
      return;
    }

    if (usageCount >= dailyLimit) {
      error = `You've reached your daily limit of ${dailyLimit} scenario explorations. Upgrade to Pro for unlimited access!`;
      return;
    }

    isLoading = true;
    error = "";
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
        throw new Error(data.error || "Failed to explore scenario");
      }

      if (data.success) {
        result = data.data;

        // Update usage count
        usageCount++;
        localStorage.setItem("whatif_usage", usageCount.toString());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      error =
        err instanceof Error ? err.message : "An unexpected error occurred";
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
      // Show success feedback (you could add a toast notification here)
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
  class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
>
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

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 py-8">
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
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
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
        {#each ["What if I started a coffee shop?", "What if I learned to code?", "What if I adopted a pet?", "What if I moved to Japan?", "What if I went back to school?", "What if I started investing?"] as example}
          <button
            on:click={() => {
              topic = example;
              perspective = "";
            }}
            class="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <div class="text-gray-700 group-hover:text-purple-700">
              {example}
            </div>
          </button>
        {/each}
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-gray-600">
          <p>&copy; 2024 WhatIf.DIY. Explore every possibility.</p>
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
