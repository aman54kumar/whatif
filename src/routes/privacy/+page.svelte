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
    content="Privacy Policy for WhatIf.DIY - How we collect, use, and protect your data."
  />
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
>
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-100">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center">
        <a href="/" class="text-purple-600 hover:text-purple-700 mr-4">
          ← Back to WhatIf.DIY
        </a>
        <h1 class="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
      <p class="text-gray-600 mb-6">
        <strong>Last updated:</strong> December 2024
      </p>

      <p>
        At WhatIf.DIY ("we," "our," or "us"), we respect your privacy and are
        committed to protecting your personal data. This privacy policy explains
        how we collect, use, and safeguard your information when you use our
        service.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Information You Provide</h3>
      <ul>
        <li>
          <strong>Scenario Data:</strong> The "what if" scenarios and perspectives
          you enter for analysis
        </li>
        <li>
          <strong>Account Information:</strong> Email address, name, and payment
          information (for Pro users)
        </li>
        <li>
          <strong>Communication:</strong> Messages you send us for support or feedback
        </li>
      </ul>

      <h3>1.2 Automatically Collected Information</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> How you interact with our service, features
          used, and session duration
        </li>
        <li>
          <strong>Technical Data:</strong> IP address, browser type, device information,
          and operating system
        </li>
        <li>
          <strong>Analytics:</strong> Website performance and user behavior data
          via Google Analytics
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>

      <p>We use your information to:</p>
      <ul>
        <li>Provide and improve our AI scenario analysis service</li>
        <li>Process your subscription and payments</li>
        <li>Send service-related communications and updates</li>
        <li>Analyze usage patterns to enhance user experience</li>
        <li>Provide customer support and respond to inquiries</li>
        <li>Comply with legal obligations and protect our rights</li>
      </ul>

      <h2>3. Data Storage and Processing</h2>

      <h3>3.1 Local Storage</h3>
      <p>We store certain data locally in your browser:</p>
      <ul>
        <li>Usage count and daily limits</li>
        <li>User preferences and settings</li>
        <li>Recent scenario analyses (stored locally only)</li>
      </ul>

      <h3>3.2 Third-Party Services</h3>
      <p>We use the following third-party services:</p>
      <ul>
        <li>
          <strong>Google Gemini AI:</strong> For generating scenario analyses
        </li>
        <li>
          <strong>Upstash Redis:</strong> For usage tracking and rate limiting
        </li>
        <li><strong>Netlify:</strong> For hosting and content delivery</li>
        <li>
          <strong>Google Analytics:</strong> For website analytics (anonymized)
        </li>
        <li>
          <strong>Stripe:</strong> For payment processing (Pro subscriptions)
        </li>
      </ul>

      <h2>4. Data Sharing and Disclosure</h2>

      <p>
        We do not sell your personal data. We may share information in these
        situations:
      </p>
      <ul>
        <li>
          <strong>Service Providers:</strong> With trusted partners who help operate
          our service
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law or to protect
          our rights
        </li>
        <li>
          <strong>Business Transfer:</strong> In connection with a merger, acquisition,
          or sale of assets
        </li>
        <li><strong>Consent:</strong> When you explicitly agree to sharing</li>
      </ul>

      <h2>5. Data Security</h2>

      <p>We implement appropriate security measures including:</p>
      <ul>
        <li>Encryption of data in transit and at rest</li>
        <li>Regular security assessments and updates</li>
        <li>Access controls and authentication</li>
        <li>Secure hosting infrastructure</li>
      </ul>

      <h2>6. Your Rights</h2>

      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal data</li>
        <li>
          <strong>Rectification:</strong> Correct inaccurate or incomplete data
        </li>
        <li>
          <strong>Erasure:</strong> Request deletion of your personal data
        </li>
        <li>
          <strong>Portability:</strong> Receive your data in a portable format
        </li>
        <li>
          <strong>Objection:</strong> Object to processing of your personal data
        </li>
        <li>
          <strong>Withdrawal:</strong> Withdraw consent for data processing
        </li>
      </ul>

      <h2>7. Cookies and Tracking</h2>

      <p>We use cookies and similar technologies for:</p>
      <ul>
        <li>Essential site functionality</li>
        <li>Usage analytics and performance monitoring</li>
        <li>User preferences and settings</li>
      </ul>

      <p>
        You can manage cookie preferences in your browser settings. See our <a
          href="/cookies"
          class="text-purple-600 hover:underline">Cookie Policy</a
        > for more details.
      </p>

      <h2>8. International Data Transfers</h2>

      <p>
        Your data may be processed in countries outside your jurisdiction. We
        ensure appropriate safeguards are in place for international transfers,
        including:
      </p>
      <ul>
        <li>Adequacy decisions by relevant authorities</li>
        <li>Standard contractual clauses</li>
        <li>Certification schemes and codes of conduct</li>
      </ul>

      <h2>9. Data Retention</h2>

      <p>We retain your data for as long as necessary to:</p>
      <ul>
        <li>Provide our services to you</li>
        <li>Comply with legal obligations</li>
        <li>Resolve disputes and enforce agreements</li>
      </ul>

      <p>Specific retention periods:</p>
      <ul>
        <li>
          <strong>Account data:</strong> Until account deletion or 2 years of inactivity
        </li>
        <li><strong>Usage data:</strong> 2 years for analytics purposes</li>
        <li>
          <strong>Payment data:</strong> As required by payment processors and tax
          laws
        </li>
      </ul>

      <h2>10. Children's Privacy</h2>

      <p>
        Our service is not intended for children under 13. We do not knowingly
        collect personal information from children under 13. If you become aware
        that a child has provided us with personal information, please contact
        us immediately.
      </p>

      <h2>11. Changes to This Policy</h2>

      <p>
        We may update this privacy policy periodically. We will notify you of
        material changes by:
      </p>
      <ul>
        <li>Posting the updated policy on our website</li>
        <li>Sending email notifications to registered users</li>
        <li>Displaying prominent notices on our platform</li>
      </ul>

      <h2>12. Contact Us</h2>

      <p>
        If you have questions about this privacy policy or your personal data,
        contact us:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>
          <a
            href="mailto:legal@whatif.diy"
            class="text-purple-600 hover:underline">legal@whatif.diy</a
          >
        </li>
        <li>
          <strong>Website:</strong>
          <a href="https://whatif.diy" class="text-purple-600 hover:underline"
            >whatif.diy</a
          >
        </li>
      </ul>

      <h2>13. GDPR Compliance (EU Users)</h2>

      <p>
        If you're in the European Union, we process your data under the
        following legal bases:
      </p>
      <ul>
        <li><strong>Contract:</strong> To provide our services to you</li>
        <li>
          <strong>Legitimate Interest:</strong> To improve our services and prevent
          fraud
        </li>
        <li>
          <strong>Consent:</strong> For marketing communications and optional features
        </li>
        <li>
          <strong>Legal Obligation:</strong> To comply with applicable laws
        </li>
      </ul>

      <h2>14. CCPA Rights (California Users)</h2>

      <p>California residents have additional rights under the CCPA:</p>
      <ul>
        <li>Right to know what personal information is collected</li>
        <li>Right to delete personal information</li>
        <li>Right to opt-out of the sale of personal information</li>
        <li>Right to non-discrimination for exercising CCPA rights</li>
      </ul>

      <div class="bg-purple-50 border-l-4 border-purple-400 p-4 mt-8">
        <p class="text-purple-700">
          <strong>Questions?</strong> We're here to help. Contact us at
          <a href="mailto:legal@whatif.diy" class="underline"
            >legal@whatif.diy</a
          >
          for any privacy-related inquiries.
        </p>
      </div>
    </div>
  </main>
</div>
