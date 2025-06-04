// @ts-check
import { writable } from "svelte/store";
import { browser } from "$app/environment";

/**
 * @typedef {Object} Preferences
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {string} defaultPerspective
 * @property {string[]} favoriteKeywords
 * @property {'quick' | 'standard' | 'detailed'} analysisDepth
 * @property {boolean} autoScroll
 * @property {boolean} notifications
 * @property {string} language
 * @property {string[]} recentTopics
 * @property {Array<{id: number, topic: string, perspective: string, pros: string[], cons: string[], savedAt: string}>} savedAnalyses
 */

/**
 * @typedef {Object} Analysis
 * @property {string} topic
 * @property {string} perspective
 * @property {string[]} pros
 * @property {string[]} cons
 */

// Default preferences
/** @type {Preferences} */
const defaultPreferences = {
  theme: "light", // 'light' | 'dark' | 'auto'
  defaultPerspective: "",
  favoriteKeywords: [],
  analysisDepth: "standard", // 'quick' | 'standard' | 'detailed'
  autoScroll: true,
  notifications: true,
  language: "en",
  recentTopics: [],
  savedAnalyses: [],
};

// Create writable store
function createPreferences() {
  const { subscribe, set, update } = writable(defaultPreferences);

  return {
    subscribe,
    set,
    update,

    // Initialize preferences from localStorage
    init: () => {
      if (browser) {
        const stored = localStorage.getItem("whatif_preferences");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            set({ ...defaultPreferences, ...parsed });
          } catch (e) {
            console.warn("Failed to parse stored preferences:", e);
            set(defaultPreferences);
          }
        }
      }
    },

    // Save preferences to localStorage
    /**
     * @param {Preferences} prefs
     */
    save: (prefs) => {
      if (browser) {
        localStorage.setItem("whatif_preferences", JSON.stringify(prefs));
      }
      set(prefs);
    },

    // Update a specific preference
    /**
     * @param {keyof Preferences} key
     * @param {any} value
     */
    updatePreference: (key, value) => {
      update((prefs) => {
        const updated = { ...prefs, [key]: value };
        if (browser) {
          localStorage.setItem("whatif_preferences", JSON.stringify(updated));
        }
        return updated;
      });
    },

    // Add to favorites
    /**
     * @param {string} keyword
     */
    addFavoriteKeyword: (keyword) => {
      update((prefs) => {
        const favorites = [...new Set([...prefs.favoriteKeywords, keyword])];
        const updated = { ...prefs, favoriteKeywords: favorites.slice(0, 10) }; // Max 10
        if (browser) {
          localStorage.setItem("whatif_preferences", JSON.stringify(updated));
        }
        return updated;
      });
    },

    // Remove from favorites
    /**
     * @param {string} keyword
     */
    removeFavoriteKeyword: (keyword) => {
      update((prefs) => {
        const favorites = prefs.favoriteKeywords.filter((k) => k !== keyword);
        const updated = { ...prefs, favoriteKeywords: favorites };
        if (browser) {
          localStorage.setItem("whatif_preferences", JSON.stringify(updated));
        }
        return updated;
      });
    },

    // Add recent topic
    /**
     * @param {string} topic
     */
    addRecentTopic: (topic) => {
      update((prefs) => {
        const recent = [
          topic,
          ...prefs.recentTopics.filter((t) => t !== topic),
        ];
        const updated = { ...prefs, recentTopics: recent.slice(0, 5) }; // Max 5
        if (browser) {
          localStorage.setItem("whatif_preferences", JSON.stringify(updated));
        }
        return updated;
      });
    },

    // Save analysis
    /**
     * @param {Analysis} analysis
     */
    saveAnalysis: (analysis) => {
      update((prefs) => {
        const saved = [
          {
            ...analysis,
            id: Date.now(),
            savedAt: new Date().toISOString(),
          },
          ...prefs.savedAnalyses,
        ];
        const updated = { ...prefs, savedAnalyses: saved.slice(0, 20) }; // Max 20
        if (browser) {
          localStorage.setItem("whatif_preferences", JSON.stringify(updated));
        }
        return updated;
      });
    },

    // Remove saved analysis
    /**
     * @param {number} id
     */
    removeSavedAnalysis: (id) => {
      update((prefs) => {
        const saved = prefs.savedAnalyses.filter((a) => a.id !== id);
        const updated = { ...prefs, savedAnalyses: saved };
        if (browser) {
          localStorage.setItem("whatif_preferences", JSON.stringify(updated));
        }
        return updated;
      });
    },

    // Reset to defaults
    reset: () => {
      if (browser) {
        localStorage.removeItem("whatif_preferences");
      }
      set(defaultPreferences);
    },
  };
}

export const preferences = createPreferences();
