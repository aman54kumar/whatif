# ProsCons Generator

An AI-powered tool that generates comprehensive pros and cons for any topic to help with decision-making.

## Features

- 🤔 Generate pros and cons for any topic using Google Gemini AI
- 🎯 Optional perspective filtering (environmental, financial, health, etc.)
- 📱 Beautiful, responsive design with TailwindCSS
- 🔒 Free tier with daily usage limits
- 📋 Copy results to clipboard
- 💾 Local storage for usage tracking
- 🚀 Ready for Pro tier expansion

## Tech Stack

- **Frontend**: Svelte + TypeScript
- **Styling**: TailwindCSS
- **Backend**: Netlify Functions
- **AI**: Google Gemini API
- **Deployment**: Netlify

## Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd prosvcons
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env .env.local
```

Get your Google Gemini API key:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Development

```bash
npm run dev
```

### 4. Deployment to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Layout with CSS imports
│   └── +page.svelte            # Main app component
├── app.css                     # TailwindCSS imports
└── app.html                    # HTML template

netlify/
└── functions/
    └── generate-pros-cons.js   # API function for Gemini

netlify.toml                    # Netlify configuration
```

## Usage

1. Enter a topic you want to analyze
2. Optionally specify a perspective (e.g., "environmental", "financial")
3. Click "Generate Pros & Cons"
4. View the AI-generated analysis
5. Copy results to clipboard if needed

## Free Tier Limits

- 5 generations per day
- Upgrade prompt for Pro features
- Usage tracked in localStorage

## Future Enhancements

- User authentication
- Pro tier with unlimited usage
- Advanced AI models for Pro users
- Counter-argument generation
- Export to PDF/JSON
- Social sharing
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own applications.
