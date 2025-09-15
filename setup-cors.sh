#!/bin/bash

# Script to set up CORS configuration for Firebase Storage
# This script helps configure CORS for localhost development

echo "Setting up CORS configuration for Firebase Storage..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: Google Cloud SDK (gcloud) is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if gsutil is available
if ! command -v gsutil &> /dev/null; then
    echo "Error: gsutil is not available. Make sure Google Cloud SDK is properly installed."
    exit 1
fi

# Set the project ID (replace with your actual project ID)
PROJECT_ID="tipsternew-700ed"
BUCKET_NAME="tipsternew-700ed.appspot.com"

echo "Setting CORS configuration for bucket: $BUCKET_NAME"

# Apply CORS configuration
gsutil cors set cors.json gs://$BUCKET_NAME

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration applied successfully!"
    echo "You can now upload avatars from localhost:3000"
else
    echo "❌ Failed to apply CORS configuration"
    echo "Make sure you have the necessary permissions and the bucket exists"
fi

echo ""
echo "To verify the CORS configuration, run:"
echo "gsutil cors get gs://$BUCKET_NAME"
