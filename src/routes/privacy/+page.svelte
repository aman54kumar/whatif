<script>
  import { onMount } from "svelte";

  onMount(() => {
    document.title = "Privacy Policy - WhatIf.DIY";
  });
</script>

<svelte:head>
  <title>Privacy Policy - WhatIf.DIY</title>
  <meta
    name="description"
    content="Privacy Policy for WhatIf.DIY - How we protect your data and respect your privacy while you explore scenarios."
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
          <p class="text-gray-600 mt-1">Privacy Policy</p>
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
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <div class="prose prose-gray max-w-none">
        <p class="text-sm text-gray-500 mb-8">Last updated: January 2024</p>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            WhatIf.DIY ("we", "our", or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website <a
              href="https://whatif.diy"
              class="text-purple-600 hover:text-purple-700">whatif.diy</a
            > and use our AI-powered decision exploration service.
          </p>
          <p class="text-gray-700 leading-relaxed">
            We believe in transparency and your right to privacy. This policy
            will help you understand what information we collect, how we use it,
            and what choices you have.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            2. Information We Collect
          </h2>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Information You Provide
          </h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Scenario Queries:</strong> The "What if" questions and topics
              you enter for analysis
            </li>
            <li>
              <strong>Perspective Preferences:</strong> Optional perspective specifications
              you provide
            </li>
            <li>
              <strong>Account Information:</strong> If you create an account (Pro
              users), we collect email address and chosen password
            </li>
            <li>
              <strong>Payment Information:</strong> For Pro subscriptions, payment
              data is processed by Stripe (we don't store credit card information)
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Information Automatically Collected
          </h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Usage Data:</strong> How you interact with our service (pages
              visited, features used, time spent)
            </li>
            <li>
              <strong>Device Information:</strong> Browser type, operating system,
              IP address (for rate limiting)
            </li>
            <li>
              <strong>Analytics Data:</strong> Anonymized usage statistics via Google
              Analytics
            </li>
            <li>
              <strong>Cookies:</strong> Essential cookies for functionality, analytics
              cookies for improvement
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            3. How We Use Your Information
          </h2>

          <h3 class="text-xl font-medium text-gray-800 mb-3">Primary Uses</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Service Delivery:</strong> Generate AI-powered pros and cons
              analysis for your scenarios
            </li>
            <li>
              <strong>Usage Tracking:</strong> Monitor daily usage limits for free
              tier users
            </li>
            <li>
              <strong>Account Management:</strong> Manage your account, subscriptions,
              and preferences
            </li>
            <li>
              <strong>Customer Support:</strong> Respond to your questions and provide
              assistance
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">Secondary Uses</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Service Improvement:</strong> Analyze usage patterns to enhance
              our AI models and features
            </li>
            <li>
              <strong>Security:</strong> Detect and prevent fraud, abuse, and security
              incidents
            </li>
            <li>
              <strong>Legal Compliance:</strong> Comply with applicable laws and
              regulations
            </li>
            <li>
              <strong>Communications:</strong> Send service updates, security alerts,
              and promotional content (with consent)
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            4. Data Storage and Security
          </h2>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-green-800 mb-2">
              🔒 Privacy-First Approach
            </h4>
            <p class="text-green-700 text-sm">
              Your scenario queries are processed in real-time and are NOT
              stored on our servers. Once your analysis is generated and
              delivered, your input is immediately discarded.
            </p>
          </div>

          <h3 class="text-xl font-medium text-gray-800 mb-3">What We Store</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Usage Counts:</strong> Daily usage limits (stored for 24 hours,
              then automatically deleted)
            </li>
            <li>
              <strong>Account Data:</strong> Email, hashed passwords, subscription
              status (Pro users only)
            </li>
            <li>
              <strong>Analytics:</strong> Anonymized usage statistics (no personal
              identifiers)
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Security Measures
          </h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure cloud infrastructure (Netlify, Upstash Redis)</li>
            <li>Regular security audits and updates</li>
            <li>Limited access controls and employee training</li>
            <li>Automatic data deletion policies</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            5. Third-Party Services
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 rounded-lg">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Service</th
                  >
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Purpose</th
                  >
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >Data Shared</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Google Gemini AI</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >AI analysis generation</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Your scenario queries (not stored by Google)</td
                  >
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Upstash Redis</td>
                  <td class="px-4 py-2 text-sm text-gray-700">Usage tracking</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >IP address, usage counts</td
                  >
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Google Analytics</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Website analytics</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Anonymized usage data</td
                  >
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Stripe</td>
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Payment processing</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Payment information (Pro users)</td
                  >
                </tr>
                <tr>
                  <td class="px-4 py-2 text-sm text-gray-700">Netlify</td>
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Hosting and CDN</td
                  >
                  <td class="px-4 py-2 text-sm text-gray-700"
                    >Connection logs, performance data</td
                  >
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            6. Your Rights and Choices
          </h2>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Data Rights (GDPR/CCPA)
          </h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of your personal data
            </li>
            <li>
              <strong>Rectification:</strong> Correct inaccurate or incomplete data
            </li>
            <li>
              <strong>Erasure:</strong> Request deletion of your personal data
            </li>
            <li>
              <strong>Portability:</strong> Export your data in a readable format
            </li>
            <li>
              <strong>Objection:</strong> Object to processing for specific purposes
            </li>
            <li>
              <strong>Restriction:</strong> Limit how we process your data
            </li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">Cookie Choices</h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              Essential cookies cannot be disabled (required for functionality)
            </li>
            <li>Analytics cookies can be disabled in your browser settings</li>
            <li>We respect "Do Not Track" browser signals</li>
          </ul>

          <h3 class="text-xl font-medium text-gray-800 mb-3">
            Marketing Communications
          </h3>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Opt-out of promotional emails at any time</li>
            <li>Unsubscribe links in all marketing communications</li>
            <li>
              Account-related emails cannot be disabled (security, billing)
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            7. Children's Privacy
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            WhatIf.DIY is not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13.
            If we discover that a child under 13 has provided us with personal
            information, we will delete such information immediately.
          </p>
          <p class="text-gray-700 leading-relaxed">
            If you are a parent or guardian and believe your child has provided
            us with personal information, please contact us at <a
              href="mailto:privacy@whatif.diy"
              class="text-purple-600 hover:text-purple-700"
              >privacy@whatif.diy</a
            >.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            8. International Data Transfers
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Our services are hosted primarily in the United States. If you are
            accessing our service from outside the US, your information may be
            transferred to, stored, and processed in the US where our servers
            are located.
          </p>
          <p class="text-gray-700 leading-relaxed">
            We ensure appropriate safeguards are in place for international
            transfers, including using cloud providers that comply with
            international data protection standards.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            9. Data Retention
          </h2>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Scenario Queries:</strong> Immediately deleted after processing
              (not stored)
            </li>
            <li>
              <strong>Usage Data:</strong> 24 hours for rate limiting, then automatically
              deleted
            </li>
            <li>
              <strong>Account Data:</strong> Until account deletion or as required
              by law
            </li>
            <li>
              <strong>Analytics Data:</strong> 26 months (Google Analytics default)
            </li>
            <li>
              <strong>Support Communications:</strong> 2 years for customer service
              quality
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            10. Changes to This Policy
          </h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last updated" date</li>
            <li>
              Sending email notifications for significant changes (registered
              users)
            </li>
          </ul>
          <p class="text-gray-700 leading-relaxed">
            Your continued use of our service after any changes indicates your
            acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            11. Contact Information
          </h2>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 class="font-semibold text-purple-800 mb-3">
              Questions About This Policy?
            </h4>
            <div class="space-y-2 text-purple-700">
              <p>
                <strong>Email:</strong>
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
                <strong>Data Protection Officer:</strong>
                <a href="mailto:dpo@whatif.diy" class="hover:text-purple-800"
                  >dpo@whatif.diy</a
                >
              </p>
            </div>
            <p class="text-purple-600 text-sm mt-4">
              We're committed to transparency and will respond to your privacy
              inquiries within 48 hours.
            </p>
          </div>
        </section>

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
          <h3 class="font-semibold text-gray-800 mb-2">Summary</h3>
          <p class="text-gray-700 text-sm">
            We prioritize your privacy by not storing your scenario queries,
            using secure infrastructure, and giving you control over your data.
            We only collect what's necessary to provide our service and comply
            with applicable privacy laws.
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
