# Azure Static Web Apps Deployment Guide

## Prerequisites
- Azure account (free tier available)
- Your GitHub repository (already done!)

## Step 1: Create Azure Static Web App

1. **Go to Azure Portal**: https://portal.azure.com
2. **Click "Create a resource"**
3. **Search for "Static Web Apps"**
4. **Click "Create"**

## Step 2: Configuration

### Basic Settings:
- **Subscription**: Choose your Azure subscription
- **Resource Group**: Create new or use existing
- **Name**: `levelup-azure-ai900` (or your preference)
- **Plan Type**: Free (for development) or Standard (for production)
- **Region**: Choose closest to your users

### Deployment Details:
- **Source**: GitHub
- **Organization**: bmaia1030314
- **Repository**: levelup_azure
- **Branch**: main

### Build Details:
- **Build Presets**: Next.js
- **App location**: `/` (root)
- **Api location**: (leave empty - we use Next.js API routes)
- **Output location**: (leave empty - Next.js handles this)

## Step 3: Review and Create

Click "Review + create" then "Create"

Azure will automatically:
- Set up GitHub Actions workflow
- Build and deploy your app
- Provide a public URL

## Step 4: Environment Variables (if needed)

In Azure Portal > Your Static Web App > Configuration:
- Add any environment variables your app needs
- For this app, no special env vars are required

## Expected Result

Your app will be available at: `https://your-app-name.azurestaticapps.net`

## Build Configuration

Azure will automatically detect Next.js and use the correct build settings.
The generated GitHub Actions workflow will handle:
- npm install
- npm run build
- Deployment to Azure

## Custom Domain (Optional)

In Azure Portal > Your Static Web App > Custom domains:
- Add your own domain name
- Azure provides free SSL certificates