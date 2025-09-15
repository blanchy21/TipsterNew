# Firebase Storage CORS Setup

This document explains how to fix the CORS (Cross-Origin Resource Sharing) issue with Firebase Storage avatar uploads.

## Problem

When trying to upload avatars from localhost:3000, you may encounter this error:

```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solution

### Option 1: Quick Fix (Recommended for Development)

The application now has a built-in fallback that automatically uses base64 encoding when Firebase Storage fails due to CORS issues. This means avatar uploads will work immediately without any configuration changes.

### Option 2: Configure CORS for Firebase Storage

If you want to use Firebase Storage directly (recommended for production), follow these steps:

#### Prerequisites

1. Install Google Cloud SDK:

   - Download from: https://cloud.google.com/sdk/docs/install
   - Follow the installation instructions for your operating system

2. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   gcloud config set project tipsternew-700ed
   ```

#### Apply CORS Configuration

1. Run the setup script:

   ```bash
   ./setup-cors.sh
   ```

2. Or manually apply the CORS configuration:
   ```bash
   gsutil cors set cors.json gs://tipsternew-700ed.appspot.com
   ```

#### Verify CORS Configuration

To check if CORS is properly configured:

```bash
gsutil cors get gs://tipsternew-700ed.appspot.com
```

You should see output similar to:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "https://tipsternew-700ed.firebaseapp.com",
      "https://tipsternew-700ed.web.app"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ]
  }
]
```

## How It Works

The application now handles CORS issues gracefully:

1. **Primary Method**: Attempts to upload to Firebase Storage
2. **Fallback Method**: If Firebase Storage fails (due to CORS or other issues), automatically falls back to storing images as base64 in Firestore
3. **Error Handling**: Provides clear console messages about which method is being used

## Testing

After applying the CORS configuration:

1. Clear your browser cache or use an incognito window
2. Try uploading an avatar in the profile edit screen
3. Check the browser console for success messages

## Production Considerations

- The CORS configuration includes both development (localhost:3000) and production domains
- Base64 fallback is available for any Firebase Storage issues
- Images stored as base64 are stored in a separate Firestore collection for easy management

## Troubleshooting

If you still encounter issues:

1. **Check Firebase Project**: Ensure you're using the correct project ID
2. **Verify Permissions**: Make sure your Google Cloud account has Storage Admin permissions
3. **Check Bucket Name**: Verify the bucket name matches your Firebase project
4. **Clear Cache**: Clear browser cache and try again
5. **Check Console**: Look for detailed error messages in the browser console

## Files Modified

- `cors.json`: CORS configuration file
- `setup-cors.sh`: Script to apply CORS configuration
- `src/lib/firebase/firebaseUtils.ts`: Enhanced upload function with CORS error handling
