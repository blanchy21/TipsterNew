# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Replicate Configuration
REPLICATE_API_TOKEN=your_replicate_token

# Deepgram Configuration
DEEPGRAM_API_KEY=your_deepgram_api_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## How to Get These Values

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the config values from your web app

### API Keys

- **OpenAI**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic**: Get from [Anthropic Console](https://console.anthropic.com/)
- **Replicate**: Get from [Replicate Account](https://replicate.com/account/api-tokens)
- **Deepgram**: Get from [Deepgram Console](https://console.deepgram.com/)

## Production Environment

For production deployment, set these environment variables in your hosting platform:

- Vercel: Add in Project Settings > Environment Variables
- Netlify: Add in Site Settings > Environment Variables
- Other platforms: Follow their specific instructions

## Security Notes

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Monitor API usage and costs
