Y

# Firebase Security Rules Setup

## Problem

The app is experiencing 400 "Bad Request" errors because Firebase Firestore has default security rules that deny all read/write operations. This prevents tips from being saved and loaded.

## Solution

You need to update the Firebase security rules in the Firebase Console.

## Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `tipsternew-700ed`

## Step 2: Update Firestore Security Rules

1. In the left sidebar, click on **Firestore Database**
2. Click on the **Rules** tab
3. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Posts collection - authenticated users can read all posts, create posts, and update their own posts
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow update: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Comments collection - authenticated users can read all comments and create comments
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow update: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Following collection - users can read/write their own following data
    match /following/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Followers collection - users can read/write their own followers data
    match /followers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Notifications collection - users can read their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Test collection for debugging - allow all operations for authenticated users
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

1. Click **Publish** to deploy the rules

## Step 3: Update Storage Security Rules (Optional)

1. In the left sidebar, click on **Storage**
2. Click on the **Rules** tab
3. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload and manage their own profile images
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can upload and manage their own post images
    match /posts/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public read access for all other files
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

1. Click **Publish** to deploy the rules

## Step 4: Test the App

After updating the rules:

1. Refresh your app in the browser
2. Try creating a new tip
3. Check if the tip persists after page refresh
4. Use the debug page at `/debug` to test Firebase connection

## Alternative: Temporary Development Rules

If you want to test quickly, you can temporarily use these more permissive rules for development (NOT recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Warning**: These rules allow any authenticated user to read/write any document. Only use for development!
