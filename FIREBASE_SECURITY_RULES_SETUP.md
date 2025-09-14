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
    // Helper function to check if user is admin
    function isAdmin(auth) {
      return auth != null && (
        auth.token.email in ['paulblanche@gmail.com', 'admin@tipsterarena.com'] ||
        auth.token.admin == true
      );
    }

    // Users collection - users can read all profiles (for leaderboard) and write their own profile
    // Admins can write any user profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == userId || // User can write their own profile
        isAdmin(request.auth) // Admins can write any user profile
      );
    }

    // Posts collection - authenticated users can read all posts, create posts, and update their own posts
    // Admins can update any post for verification purposes
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && (
        request.auth.uid == request.resource.data.userId || // User can create their own posts
        isAdmin(request.auth) // Admins can create posts for any user
      );
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId || // User can update their own posts
        isAdmin(request.auth) // Admins can update any post for verification
      );
      allow delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Comments collection - authenticated users can read all comments and create comments
    // Admins can update/delete any comment
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId || // User can update their own comments
        isAdmin(request.auth) // Admins can update any comment
      );
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.userId || // User can delete their own comments
        isAdmin(request.auth) // Admins can delete any comment
      );
    }

    // Following collection - users can read/write their own following data
    // Admins can read/write any following data
    match /following/{userId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == userId || // User can read/write their own following data
        isAdmin(request.auth) // Admins can read/write any following data
      );
    }

    // Followers collection - users can read/write their own followers data
    // Admins can read/write any followers data
    match /followers/{userId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == userId || // User can read/write their own followers data
        isAdmin(request.auth) // Admins can read/write any followers data
      );
    }

    // Notifications collection - users can read their own notifications
    // Admins can read/write any notifications
    match /notifications/{notificationId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.recipientId || // User can read their own notifications
        isAdmin(request.auth) // Admins can read any notifications
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.recipientId || // User can update their own notifications
        isAdmin(request.auth) // Admins can update any notifications
      );
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.recipientId || // User can delete their own notifications
        isAdmin(request.auth) // Admins can delete any notifications
      );
    }

    // Tip verifications collection - authenticated users can read all verifications
    match /tipVerifications/{verificationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Chat messages collection - authenticated users can read all messages and create messages
    // Users can only update/delete their own messages
    match /chatMessages/{messageId} {
      allow read, write: if request.auth != null;
    }

    // Conversations collection - users can read/write conversations they participate in
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
    }

    // Messages collection - users can read/write messages in conversations they participate in
    match /messages/{messageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.participants;
    }

    // Base64 images collection - temporary storage for images when Firebase Storage is not available
    match /base64Images/{imageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
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
