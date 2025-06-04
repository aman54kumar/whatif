# 🚀 DecisionAI - Production Deployment Guide

## 🎯 **DEPLOYMENT OVERVIEW**

This guide will help you deploy DecisionAI to production using **Netlify** (recommended) or alternative platforms.

## 🌐 **DOMAIN & HOSTING SETUP**

### **Step 1: Purchase Domain**

1. **Recommended Domain**: `DecisionAI.app`
2. **Domain Registrars**:
   - Namecheap (recommended): ~$12/year
   - GoDaddy: ~$15/year
   - Google Domains: ~$12/year

### **Step 2: Netlify Hosting Setup**

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
netlify init
```

## 🔧 **ENVIRONMENT VARIABLES**

### **Required Environment Variables**

Create these in your Netlify dashboard:

```bash
# AI API Configuration
GEMINI_API_KEY=your_google_gemini_api_key

# Redis Configuration (Optional but recommended)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
MIXPANEL_TOKEN=your_mixpanel_token

# Payment Processing (Future)
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Email Service (Future)
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SUPPORT_EMAIL=support@decisionai.app

# Security
JWT_SECRET=your_random_jwt_secret_key
ADMIN_EMAIL=admin@decisionai.app
```

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **Code Quality**

- [ ] Remove all console.log statements
- [ ] Fix TypeScript errors
- [ ] Test all functionality locally
- [ ] Optimize images and assets
- [ ] Minify and compress code

### **SEO & Performance**

- [ ] Add sitemap.xml
- [ ] Optimize meta tags
- [ ] Test Core Web Vitals
- [ ] Compress images
- [ ] Enable caching headers

### **Security**

- [ ] Remove development API keys
- [ ] Set up proper CORS
- [ ] Enable HTTPS
- [ ] Add security headers
- [ ] Validate all inputs

### **Monitoring**

- [ ] Set up Google Analytics
- [ ] Configure error tracking
- [ ] Add uptime monitoring
- [ ] Set up performance monitoring

## 🌍 **DEPLOYMENT METHODS**

### **Method 1: GitHub + Netlify (Recommended)**

1. **Push to GitHub**

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial production deployment"

# Add GitHub remote
git remote add origin https://github.com/yourusername/decisionai.git
git push -u origin main
```

2. **Connect to Netlify**

- Go to [Netlify Dashboard](https://app.netlify.com/)
- Click "New site from Git"
- Choose GitHub
- Select your repository
- Configure build settings:
  ```
  Build command: npm run build
  Publish directory: build
  ```

3. **Add Environment Variables**

- Go to Site settings > Environment variables
- Add all required environment variables

### **Method 2: Direct Deploy**

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

### **Method 3: Automated CI/CD**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --dir=build --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔐 **SSL & SECURITY SETUP**

### **SSL Certificate**

- Netlify provides free SSL automatically
- Custom domain SSL is handled automatically
- Force HTTPS in Netlify settings

### **Security Headers**

Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;"
```

## 📊 **ANALYTICS SETUP**

### **Google Analytics 4**

1. Create GA4 property
2. Get Measurement ID
3. Add to environment variables
4. Update Svelte app to include tracking

### **Search Console**

1. Verify domain ownership
2. Submit sitemap
3. Monitor search performance

### **Performance Monitoring**

- **Core Web Vitals**: Lighthouse CI
- **Error Tracking**: Sentry.io
- **Uptime Monitoring**: UptimeRobot

## 🗺️ **SEO SETUP**

### **Sitemap Generation**

Create `static/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://decisionai.app/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://decisionai.app/about</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### **Robots.txt**

Create `static/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://decisionai.app/sitemap.xml
```

## 📧 **EMAIL SETUP**

### **Custom Email Domain**

1. **Google Workspace**: $6/user/month
2. **Zoho Mail**: Free for small teams
3. **ProtonMail**: Privacy-focused option

### **Email Addresses to Create**

- `hello@decisionai.app` - General inquiries
- `support@decisionai.app` - Customer support
- `admin@decisionai.app` - Admin notifications
- `noreply@decisionai.app` - Automated emails

## 🔄 **BACKUP & DISASTER RECOVERY**

### **Code Backup**

- GitHub repository (primary)
- Private backup repository
- Local development machine

### **Database Backup** (Future)

- Automated daily backups
- Cross-region replication
- Point-in-time recovery

### **Environment Backup**

- Document all environment variables
- Store securely in password manager
- Regular configuration exports

## 📈 **PERFORMANCE OPTIMIZATION**

### **Build Optimization**

```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
npm install -D imageoptim-cli
imageoptim --image-alpha static/images/
```

### **CDN Setup**

- Netlify CDN is included
- Cloudflare (additional layer): Free plan
- Image optimization service

### **Caching Strategy**

```toml
# netlify.toml
[[headers]]
  for = "/build/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

## 🚨 **MONITORING & ALERTS**

### **Uptime Monitoring**

- **UptimeRobot**: Free monitoring
- **Pingdom**: Advanced monitoring
- **StatusCake**: Multiple location checks

### **Error Tracking**

```bash
# Install Sentry
npm install @sentry/svelte
```

### **Performance Monitoring**

- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## 🔧 **POST-DEPLOYMENT TASKS**

### **Immediate (Day 1)**

- [ ] Test all functionality
- [ ] Verify SSL certificate
- [ ] Check analytics tracking
- [ ] Test contact forms
- [ ] Verify API endpoints

### **Week 1**

- [ ] Submit to search engines
- [ ] Set up monitoring alerts
- [ ] Create status page
- [ ] Document deployment process
- [ ] Train team on deployment

### **Month 1**

- [ ] Review performance metrics
- [ ] Optimize based on user feedback
- [ ] Set up A/B testing
- [ ] Plan feature releases
- [ ] Create backup procedures

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

1. **Build Failures**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

2. **Environment Variables Not Working**

- Check variable names (case-sensitive)
- Verify in Netlify dashboard
- Redeploy after changes

3. **API Functions Timing Out**

- Check function logs in Netlify
- Verify API keys
- Test locally with netlify dev

4. **DNS Issues**

- Allow 24-48 hours for propagation
- Use DNS checker tools
- Clear browser cache

### **Support Resources**

- **Netlify Support**: help.netlify.com
- **Svelte Documentation**: svelte.dev
- **Community Discord**: svelte.dev/chat

## 🎯 **LAUNCH CHECKLIST**

### **Technical Launch**

- [ ] Domain configured
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Performance optimized

### **Marketing Launch**

- [ ] Social media accounts created
- [ ] Product Hunt submission prepared
- [ ] Press kit created
- [ ] Launch blog post written
- [ ] Email list ready

### **Business Launch**

- [ ] Terms of service
- [ ] Privacy policy
- [ ] Support documentation
- [ ] Pricing page
- [ ] About page

---

## 📞 **EMERGENCY CONTACTS**

- **Domain Registrar**: Your registrar support
- **Hosting Provider**: Netlify Support
- **DNS Provider**: Your DNS provider
- **Development Team**: Your contact info

This deployment guide ensures a smooth, secure, and scalable production launch for DecisionAI.
