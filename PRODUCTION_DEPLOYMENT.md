# 🚀 Tipster Arena Production Deployment Guide

## Overview

This guide covers deploying Tipster Arena to production with all necessary configurations, optimizations, and monitoring.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup

1. **Firebase Configuration**

   - [ ] Firebase project is configured for production
   - [ ] Authentication providers are enabled
   - [ ] Firestore security rules are deployed
   - [ ] Storage rules are deployed
   - [ ] Firebase indexes are created

2. **API Keys & Secrets**

   - [ ] OpenAI API key configured
   - [ ] Anthropic API key configured
   - [ ] Replicate API token configured
   - [ ] Deepgram API key configured
   - [ ] Giphy API key configured

3. **Domain & SSL**
   - [ ] Custom domain configured
   - [ ] SSL certificate is valid
   - [ ] DNS records are set up

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Vercel Prerequisites

- Vercel account
- GitHub repository connected
- Environment variables configured

#### Vercel Deployment Steps

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.production`

3. **Configure Domain**
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain
   - Configure DNS records

#### Vercel Configuration

The `vercel.json` file is already configured with:

- Security headers
- Caching strategies
- API route optimization
- Redirects

### Option 2: Docker Deployment

#### Docker Prerequisites

- Docker installed
- Container registry access (Docker Hub, AWS ECR, etc.)

#### Docker Deployment Steps

1. **Build Docker Image**

   ```bash
   # Build the image
   npm run docker:build

   # Test locally
   npm run docker:run
   ```

2. **Deploy to Container Registry**

   ```bash
   # Tag for registry
   docker tag tipster-arena your-registry/tipster-arena:latest

   # Push to registry
   docker push your-registry/tipster-arena:latest
   ```

3. **Deploy to Cloud Provider**
   - AWS ECS, Google Cloud Run, Azure Container Instances
   - Configure environment variables
   - Set up load balancing and auto-scaling

### Option 3: Traditional VPS/Server

#### VPS Prerequisites

- Ubuntu 20.04+ or similar
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy

#### VPS Deployment Steps

1. **Server Setup**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**

   ```bash
   # Clone repository
   git clone https://github.com/your-username/tipster-arena.git
   cd tipster-arena

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "tipster-arena" -- start:prod
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Production Configuration

### Environment Variables

Create a `.env.production` file with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# AI API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
REPLICATE_API_TOKEN=your_replicate_token
DEEPGRAM_API_KEY=your_deepgram_key

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Security
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com
```

### Firebase Security Rules

Deploy security rules:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Performance Optimizations

The application includes:

- ✅ Bundle splitting and code splitting
- ✅ Image optimization with Next.js Image
- ✅ PWA with service worker caching
- ✅ React Query for data caching
- ✅ Lazy loading for components
- ✅ Compression and minification

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Error Tracking**

   - Sentry (configured in environment)
   - Vercel Analytics (built-in)

2. **Performance Monitoring**

   - Vercel Speed Insights
   - Google PageSpeed Insights
   - Lighthouse CI

3. **User Analytics**
   - Google Analytics 4
   - Mixpanel (optional)

### Health Checks

Create a health check endpoint:

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## 🔒 Security Considerations

### Implemented Security Features

- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Firebase security rules
- ✅ Input validation and sanitization
- ✅ Rate limiting on API routes
- ✅ HTTPS enforcement
- ✅ XSS protection

### Additional Security Steps

1. **Enable Firebase App Check**
2. **Set up monitoring for suspicious activity**
3. **Regular security audits**
4. **Keep dependencies updated**

## 🧪 Testing in Production

### Pre-Launch Tests

```bash
# Run all tests
npm run test:all

# Performance test
npm run test:performance

# E2E tests
npm run test:e2e
```

### Post-Deployment Verification

1. **Functionality Tests**

   - [ ] User registration/login
   - [ ] Tip creation and posting
   - [ ] Real-time updates
   - [ ] File uploads
   - [ ] Chat functionality

2. **Performance Tests**

   - [ ] Page load times < 3s
   - [ ] Core Web Vitals passing
   - [ ] Mobile responsiveness

3. **Security Tests**
   - [ ] Security headers present
   - [ ] HTTPS working
   - [ ] No console errors

## 📈 Post-Deployment

### Monitoring

1. **Set up alerts** for:

   - High error rates
   - Slow response times
   - High memory usage
   - Failed deployments

2. **Regular maintenance**:
   - Update dependencies monthly
   - Monitor performance metrics
   - Review security logs
   - Backup data regularly

### Scaling Considerations

- **Database**: Firebase scales automatically
- **CDN**: Vercel provides global CDN
- **Caching**: Implement Redis for session storage if needed
- **Load Balancing**: Use multiple regions for global users

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**

   - Check environment variables
   - Verify all dependencies are installed
   - Check TypeScript errors

2. **Runtime Errors**

   - Check Firebase configuration
   - Verify API keys are correct
   - Check browser console for errors

3. **Performance Issues**
   - Run bundle analysis
   - Check for memory leaks
   - Optimize images and assets

### Support

- Check logs in Vercel Dashboard
- Monitor Firebase Console
- Use browser dev tools for debugging

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Performance Best Practices](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Last Updated**: $(date)
**Version**: 1.0.0
