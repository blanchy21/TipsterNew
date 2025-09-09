# Firebase Setup for Tipster Arena

## Quick Fix for Current Error

The app is currently showing a Firebase authentication error because the environment variables are not configured. Here's how to fix it:

## Option 1: Quick Demo Mode (Recommended for now)

The app will now work in demo mode without Firebase. The landing page and main app will function normally, but authentication features will be disabled.

## Option 2: Set Up Firebase (For full functionality)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it and add your project's support email
4. Save the changes

### Step 3: Get Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Tipster Arena")
5. Copy the configuration object

### Step 4: Create Environment File

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 5: Restart Development Server

```bash
npm run dev
```

## What's Fixed

✅ **Firebase Error Resolved**: The app now handles missing Firebase configuration gracefully
✅ **Demo Mode**: App works without Firebase for development and testing
✅ **Landing Page**: Fully functional with all features
✅ **Main App**: Works with mock data when Firebase is not available
✅ **Authentication**: Gracefully disabled when Firebase is not configured

## Features Available in Demo Mode

- ✅ Landing page with all animations and interactions
- ✅ Main app with posts, feeds, and navigation
- ✅ All UI components and layouts
- ✅ Responsive design
- ❌ User authentication (requires Firebase setup)
- ❌ Real-time data persistence (requires Firebase setup)

The app is now ready to run without any errors!
