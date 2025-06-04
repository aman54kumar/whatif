# WhatIf.DIY 🚀

_Explore every possibility with AI_

An AI-powered scenario exploration tool that helps you discover positive outcomes and potential challenges for any "what if" situation.

## 🌟 Features

- 🤔 **AI-Powered Analysis**: Generate comprehensive scenario analysis using Google Gemini AI
- 🎯 **Perspective Filtering**: Optional viewpoint filtering (environmental, financial, health, etc.)
- 🎨 **Beautiful UI**: Modern, responsive design with purple/blue gradients
- 🔒 **Usage Tracking**: Free tier with daily limits using Upstash Redis
- 📋 **Easy Sharing**: Copy results to clipboard
- 🎛️ **Personalization**: Customizable themes, perspectives, and preferences
- 🔐 **Privacy-First**: All preferences stored locally
- ⚖️ **Legal Compliance**: GDPR/CCPA compliant with comprehensive legal pages
- 🚀 **Production Ready**: Deployed and ready for whatif.diy domain

## 🎯 Use Cases

- **Career Decisions**: "What if I change careers to tech?"
- **Lifestyle Changes**: "What if I move to a different city?"
- **Business Ideas**: "What if I start an online store?"
- **Education**: "What if I pursue a master's degree?"
- **Health & Fitness**: "What if I adopt a plant-based diet?"
- **Financial**: "What if I invest in real estate?"

## 🛠️ Tech Stack

- **Frontend**: SvelteKit + TypeScript
- **Styling**: TailwindCSS with custom purple/blue theme
- **Backend**: Netlify Functions
- **AI**: Google Gemini API
- **Database**: Upstash Redis (with localStorage fallback)
- **Analytics**: Google Analytics (G-3MVWQJVYYM)
- **Deployment**: Netlify
- **Domain**: whatif.diy

## 🚀 Live Demo

Visit [whatif.diy](https://whatif.diy) to try it out!

## 📊 Business Model

- **Free Tier**: 5 analyses per day
- **Pro Tier**: $9.99/month - Unlimited analyses + advanced features
- **Enterprise**: $49/month - Priority support + custom integrations

## 🔧 Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/aman54kumar/whatif.git
cd whatif
npm install
```

### 2. Environment Variables

Create `.env` file with:

```env
GEMINI_API_KEY=your_gemini_api_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 3. Get API Keys

- **Gemini API**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Upstash Redis**: [Upstash Console](https://console.upstash.com/)

### 4. Development Server

```bash
# Local development
npm run dev

# Netlify dev server (with functions)
npm run netlify-dev
```

## 📁 Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Main layout with nav
│   ├── +page.svelte            # Home page with scenario analysis
│   ├── privacy/+page.svelte    # Privacy Policy (GDPR compliant)
│   ├── terms/+page.svelte      # Terms of Service
│   └── cookies/+page.svelte    # Cookie Policy
├── lib/
│   ├── stores/
│   │   └── preferences.js      # User preferences store
│   └── components/             # Reusable components
├── app.css                     # TailwindCSS with custom theme
└── app.html                    # HTML template with analytics

netlify/
└── functions/
    ├── generate-pros-cons.js   # Main AI analysis function
    └── check-usage.js          # Usage tracking with Redis

static/
├── _redirects                  # Netlify SPA routing
├── favicon.ico                 # WhatIf.DIY favicon
└── robots.txt                  # SEO optimization

netlify.toml                    # Netlify build configuration
```

## 🎛️ Personalization Features

- **Themes**: Light/Dark/Auto mode
- **Default Perspectives**: Save preferred viewpoints
- **Favorite Keywords**: Quick access to common terms
- **Analysis Depth**: Quick/Standard/Detailed options
- **Recent Topics**: Remember last 5 analyses
- **Saved Analyses**: Store up to 20 results locally

## ⚖️ Legal Compliance

- **Privacy Policy**: GDPR/CCPA compliant data handling
- **Terms of Service**: Clear usage terms and subscription details
- **Cookie Policy**: Transparent cookie usage and user controls
- **Contact**: legal@whatif.diy for all legal inquiries

## 🔒 Usage Limits

### Free Tier

- 5 scenario analyses per day
- Basic analysis depth
- Standard response time

### Pro Tier ($9.99/month)

- Unlimited analyses
- Detailed analysis mode
- Priority AI processing
- Advanced perspectives
- Export features

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**: Link GitHub repo to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Environment Variables**: Add all required API keys
4. **Custom Domain**: Point whatif.diy to Netlify
5. **Functions**: Automatically deployed from `netlify/functions/`

### Environment Variables for Production

```env
GEMINI_API_KEY=your_production_gemini_key
UPSTASH_REDIS_REST_URL=your_production_redis_url
UPSTASH_REDIS_REST_TOKEN=your_production_redis_token
NODE_VERSION=20
```

## 📈 SEO Strategy

Targeting high-intent keywords:

- "what if analysis"
- "scenario planning"
- "decision making tool"
- "AI scenario explorer"
- "pros and cons generator"

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - Feel free to use this project for your own applications.

## 📞 Contact

- **Website**: [whatif.diy](https://whatif.diy)
- **Email**: hello@whatif.diy
- **Legal**: legal@whatif.diy
- **GitHub**: [aman54kumar/whatif](https://github.com/aman54kumar/whatif)

---

_Built with ❤️ for better decision making_
