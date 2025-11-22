#!/bin/bash
set -e  # Exit on any error

# Load deployment configuration
if [ ! -f .env.deploy ]; then
  echo "❌ Error: .env.deploy file not found!"
  echo "📝 Copy .env.deploy.example to .env.deploy and fill in your values"
  exit 1
fi

# Export variables from .env.deploy
export $(grep -v '^#' .env.deploy | xargs)

# Verify required variables
if [ -z "$AWS_PROFILE" ] || [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "❌ Error: Missing required variables in .env.deploy"
  exit 1
fi

echo "🔧 Using AWS Profile: $AWS_PROFILE"
echo "🪣 Deploying to S3: $S3_BUCKET"
echo "🌐 CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"
echo ""

echo "🔨 Building site..."
pnpm run build

echo "📤 Uploading to S3..."
aws s3 sync out/ s3://$S3_BUCKET/ \
  --region $AWS_REGION \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "404.html"

echo "📤 Uploading HTML files (no cache)..."
aws s3 sync out/ s3://$S3_BUCKET/ \
  --region $AWS_REGION \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --include "404.html"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 URL: https://$CLOUDFRONT_URL"