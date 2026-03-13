#!/bin/bash

# Configuration
REPO_NAME="dungnt118/freepbx"
TAG_PREFIX="sira-thi-cong_v"
VERSION_FILE="docker/VERSION"
DEFAULT_VERSION="1.0.0"

# Ensure we are in the project root
if [ ! -d "docker" ]; then
    echo "Error: Please run this script from the project root."
    exit 1
fi

# Get current version
if [ -f "$VERSION_FILE" ]; then
    CURRENT_VERSION=$(cat "$VERSION_FILE")
else
    CURRENT_VERSION=$DEFAULT_VERSION
fi

# Function to increment version (simple patch increment)
increment_version() {
    local v=$1
    if [[ $v =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        major=${BASH_REMATCH[1]}
        minor=${BASH_REMATCH[2]}
        patch=${BASH_REMATCH[3]}
        echo "$major.$minor.$((patch + 1))"
    else
        echo "$DEFAULT_VERSION"
    fi
}

SUGGESTED_VERSION=$(increment_version "$CURRENT_VERSION")

# Prompt user for version
read -p "Enter version to build [Suggested: $SUGGESTED_VERSION]: " USER_VERSION

if [ -z "$USER_VERSION" ]; then
    VERSION=$SUGGESTED_VERSION
else
    VERSION=$USER_VERSION
fi

echo "🚀 Building version $VERSION..."

FULL_TAG="${TAG_PREFIX}${VERSION}"
LATEST_TAG="${TAG_PREFIX}latest"

# Build the image
# Using -f docker/Dockerfile and context as project root
docker build -t $REPO_NAME:$FULL_TAG -t $REPO_NAME:$LATEST_TAG -f docker/Dockerfile .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "📤 Pushing version $FULL_TAG to Docker Hub..."
    docker push $REPO_NAME:$FULL_TAG
    docker push $REPO_NAME:$LATEST_TAG
    
    if [ $? -eq 0 ]; then
        echo "✅ Push successful!"
        # Update version file
        echo "$VERSION" > "$VERSION_FILE"
        echo "📝 Updated $VERSION_FILE to $VERSION"
    else
        echo "❌ Push failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment complete: $REPO_NAME:$FULL_TAG"
