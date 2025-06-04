<script>
  import { onMount } from "svelte";

  onMount(() => {
    document.title = "Cookie Policy - WhatIf.DIY";
  });
</script>

<svelte:head>
  <title>Cookie Policy - WhatIf.DIY</title>
  <meta
    name="description"
    content="Cookie Policy for WhatIf.DIY - How we use cookies and how you can manage your cookie preferences."
  />
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold">
            <a href="/" class="hover:opacity-80 transition-opacity">
              <span
                class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                >What</span
              ><span
                class="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
                >If</span
              ><span class="text-gray-700">.DIY</span>
            </a>
          </h1>
          <p class="text-gray-600 mt-1">Cookie Policy</p>
        </div>
        <a
          href="/"
          class="text-purple-600 hover:text-purple-700 transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>

      <div class="prose prose-gray max-w-none">
        <p class="text-sm text-gray-500 mb-8">Last updated: January 2024</p>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            1. What Are Cookies?
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or
            mobile device when you visit our website. They are widely used to
            make websites work more efficiently and provide information to
            website owners.
          </p>
          <p class="text-gray-700 leading-relaxed">
            WhatIf.DIY uses cookies to enhance your experience, remember your
            preferences, and analyze how our service is used to help us improve
            it.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            2. How We Use Cookies
          </h2>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-blue-800 mb-2">
              🍪 Our Cookie Approach
            </h4>
            <p class="text-blue-700 text-sm">
              We use minimal, essential cookies and respect your privacy
              choices. You can control most cookies through your browser
              settings.
            </p>
          </div>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Essential Cookies (Always Active)
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            These cookies are necessary for the website to function and cannot
            be switched off:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Session Management:</strong> Keep you logged in during your
              visit
            </li>
            <li>
              <strong>Security:</strong> Protect against cross-site request forgery
            </li>
            <li>
              <strong>Preferences:</strong> Remember your choices (like dark mode,
              if implemented)
            </li>
            <li>
              <strong>Rate Limiting:</strong> Enforce daily usage limits for free
              users
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Analytics Cookies (Optional)
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            These cookies help us understand how visitors use our website:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Google Analytics:</strong> Anonymized usage statistics and
              performance data
            </li>
            <li>
              <strong>Page Views:</strong> Which pages are visited most often
            </li>
            <li>
              <strong>User Journey:</strong> How users navigate through our site
            </li>
            <li>
              <strong>Feature Usage:</strong> Which features are used and how often
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Marketing Cookies (Optional)
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            Currently, we do not use marketing cookies, but we may in the future
            for:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Advertising:</strong> Show relevant ads on other websites
            </li>
            <li><strong>Social Media:</strong> Enable sharing features</li>
            <li>
              <strong>Remarketing:</strong> Reach visitors who have used our service
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            3. Types of Cookies We Use
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 rounded-lg">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Cookie Name</th
                  >
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Purpose</th
                  >
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Duration</th
                  >
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Type</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700 font-mono"
                    >whatif_session</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >User session management</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700">Session</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Essential</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700 font-mono"
                    >usage_count</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Daily usage tracking</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700">24 hours</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Essential</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700 font-mono"
                    >user_preferences</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Remember user settings</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700">1 year</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Essential</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700 font-mono">_ga</td>
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Google Analytics tracking</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700">2 years</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Analytics</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700 font-mono">_gid</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Google Analytics session tracking</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700">24 hours</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Analytics</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700 font-mono"
                    >cookie_consent</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Remember cookie preferences</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700">1 year</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Essential</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            4. Managing Your Cookie Preferences
          </h2>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Browser Settings
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            You can control cookies through your browser settings. Here's how to
            manage cookies in popular browsers:
          </p>

          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Chrome</h4>
              <p class="text-sm text-gray-700">
                Settings > Privacy and security > Cookies and other site data
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Firefox</h4>
              <p class="text-sm text-gray-700">
                Settings > Privacy & Security > Cookies and Site Data
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Safari</h4>
              <p class="text-sm text-gray-700">
                Preferences > Privacy > Manage Website Data
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">Edge</h4>
              <p class="text-sm text-gray-700">
                Settings > Cookies and site permissions > Cookies and site data
              </p>
            </div>
          </div>

          <h3 class="text-xl font-medium text-gray-800 mb-3">Do Not Track</h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            We respect the "Do Not Track" browser setting. When enabled, we
            will:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Disable Google Analytics tracking</li>
            <li>Not set any analytics cookies</li>
            <li>Still use essential cookies for functionality</li>
            <li>Honor your privacy preference</li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Opt-Out Options
          </h3>
          <div class="space-y-3">
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 class="font-semibold text-purple-800 mb-2">
                Google Analytics Opt-Out
              </h4>
              <p class="text-purple-700 text-sm mb-3">
                You can opt out of Google Analytics tracking by installing the
                Google Analytics Opt-out Browser Add-on.
              </p>
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                class="text-purple-600 hover:text-purple-700 underline text-sm"
              >
                Download Google Analytics Opt-out Add-on →
              </a>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            5. Third-Party Cookies
          </h2>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Google Analytics
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            We use Google Analytics to understand how our website is used.
            Google Analytics may set cookies to collect information about your
            visit, including:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Pages you visit and time spent on each page</li>
            <li>How you arrived at our site (referrer information)</li>
            <li>Your approximate geographic location (country/city level)</li>
            <li>Your device and browser information</li>
          </ul>
          <p class="text-gray-700 leading-relaxed mb-4">
            This information is anonymized and aggregated. Google's privacy
            policy applies to their use of this data:
            <a
              href="https://policies.google.com/privacy"
              class="text-purple-600 hover:text-purple-700 underline"
              target="_blank"
              rel="noopener">Google Privacy Policy</a
            >
          </p>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Payment Processing
          </h3>
          <p class="text-gray-700 leading-relaxed">
            When you make a payment (Pro/Enterprise subscriptions), Stripe may
            set cookies for fraud prevention and payment processing. We don't
            control these cookies - they are managed by Stripe according to
            their privacy policy.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            6. Cookies and Local Storage
          </h2>

          <h3 class="text-xl font-medium text-gray-800 mb-3">Local Storage</h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            In addition to cookies, we may use browser local storage to:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Usage Tracking Fallback:</strong> If Redis is unavailable,
              we store usage counts locally
            </li>
            <li>
              <strong>User Preferences:</strong> Remember your settings between visits
            </li>
            <li>
              <strong>Temporary Data:</strong> Cache scenario results during your
              session
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Clearing Local Storage
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">
            You can clear local storage through your browser's developer tools:
          </p>
          <ol class="list-decimal list-inside text-gray-700 mb-4 space-y-2">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Application/Storage tab</li>
            <li>Select Local Storage > whatif.diy</li>
            <li>Delete all items or specific entries</li>
          </ol>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            7. Mobile Apps and Cookies
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Currently, WhatIf.DIY is a web-based service. When we develop mobile
            applications in the future, they may use similar tracking
            technologies but will be governed by mobile app privacy practices
            and this policy will be updated accordingly.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibent text-gray-900 mb-4">
            8. Changes to This Cookie Policy
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We may update this Cookie Policy from time to time to reflect
            changes in:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>The cookies and technologies we use</li>
            <li>Legal requirements or regulatory guidance</li>
            <li>Our business practices and services</li>
          </ul>
          <p class="text-gray-700 leading-relaxed">
            When we make significant changes, we will notify you through our
            website or by email (if you have an account). The "Last updated"
            date at the top of this policy indicates when it was last revised.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            9. Contact Us
          </h2>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 class="font-semibold text-purple-800 mb-3">
              Questions About Cookies?
            </h4>
            <div class="space-y-2 text-purple-700">
              <p>
                <strong>Privacy Questions:</strong>
                <a
                  href="mailto:privacy@whatif.diy"
                  class="hover:text-purple-800">privacy@whatif.diy</a
                >
              </p>
              <p>
                <strong>General Support:</strong>
                <a href="mailto:hello@whatif.diy" class="hover:text-purple-800"
                  >hello@whatif.diy</a
                >
              </p>
              <p>
                <strong>Technical Issues:</strong>
                <a
                  href="mailto:support@whatif.diy"
                  class="hover:text-purple-800">support@whatif.diy</a
                >
              </p>
            </div>
            <p class="text-purple-600 text-sm mt-4">
              We're committed to transparency about our cookie usage and will
              help you understand and control your privacy settings.
            </p>
          </div>
        </section>

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
          <h3 class="font-semibold text-gray-800 mb-2">Cookie Summary</h3>
          <p class="text-gray-700 text-sm">
            We use minimal, essential cookies for functionality and optional
            analytics cookies to improve our service. You have full control over
            non-essential cookies through your browser settings or by contacting
            us.
          </p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="max-w-4xl mx-auto px-4 py-6 text-center">
      <p class="text-gray-500 text-sm">
        © 2024 WhatIf.DIY. Empowering smarter decisions through exploration.
      </p>
    </div>
  </footer>
</div>
