<script lang="ts">
  import { page } from "$app/stores";

  export let title = "WhatIf.DIY - Explore Every Possibility with AI";
  export let description =
    "Explore any what if scenario with AI-powered analysis. Discover positive outcomes and potential challenges for better decision making. Free scenario planning tool with unlimited possibilities.";
  export let keywords =
    "what if analysis, scenario planning, decision making, AI, possibilities, outcomes, decision support, future planning, risk assessment, opportunity analysis";
  export let image = "https://whatif.diy/og-image.png";
  export let imageAlt = "WhatIf.DIY - AI-powered scenario exploration tool";
  export let type = "website";
  export let publishedTime = "";
  export let modifiedTime = "";
  export let section = "";
  export let tags: string[] = [];
  export let author = "WhatIf.DIY";
  export let canonical = "";
  export let structuredData: Record<string, any> | null = null;
  export let noindex = false;
  export let nofollow = false;

  // Generate canonical URL
  $: canonicalUrl = canonical || `https://whatif.diy${$page.url.pathname}`;

  // Generate robots content
  $: robotsContent = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`;

  // Generate JSON-LD structured data
  let defaultStructuredData: Record<string, any>;

  $: {
    defaultStructuredData = structuredData || {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebPage",
      name: title,
      headline: title,
      description: description,
      url: canonicalUrl,
      image: {
        "@type": "ImageObject",
        url: image,
        alt: imageAlt,
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
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };

    // Add article-specific data
    if (type === "article" && publishedTime) {
      defaultStructuredData.datePublished = publishedTime;
      if (modifiedTime) {
        defaultStructuredData.dateModified = modifiedTime;
      }
      if (author) {
        defaultStructuredData.author = {
          "@type": "Person",
          name: author,
        };
      }
      if (section) {
        defaultStructuredData.articleSection = section;
      }
      if (tags.length > 0) {
        defaultStructuredData.keywords = tags.join(", ");
      }
    }
  }
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content={author} />
  <meta name="robots" content={robotsContent} />
  <meta name="googlebot" content={robotsContent} />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:alt" content={imageAlt} />
  <meta property="og:site_name" content="WhatIf.DIY" />
  <meta property="og:locale" content="en_US" />

  {#if type === "article"}
    {#if publishedTime}
      <meta property="article:published_time" content={publishedTime} />
    {/if}
    {#if modifiedTime}
      <meta property="article:modified_time" content={modifiedTime} />
    {/if}
    {#if section}
      <meta property="article:section" content={section} />
    {/if}
    {#if author}
      <meta property="article:author" content={author} />
    {/if}
    {#each tags as tag}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={image} />
  <meta property="twitter:image:alt" content={imageAlt} />
  <meta property="twitter:site" content="@WhatIfDIY" />
  <meta property="twitter:creator" content="@WhatIfDIY" />

  <!-- Additional SEO Tags -->
  <meta name="theme-color" content="#7c3aed" />
  <meta name="msapplication-TileColor" content="#7c3aed" />
  <meta name="application-name" content="WhatIf.DIY" />
  <meta name="apple-mobile-web-app-title" content="WhatIf.DIY" />

  <!-- Structured Data -->
  {@html `<script type="application/ld+json">${JSON.stringify(defaultStructuredData)}</script>`}
</svelte:head>
