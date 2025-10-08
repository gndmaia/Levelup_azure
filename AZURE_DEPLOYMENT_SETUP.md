# Azure Static Web Apps Deployment Guide

## The Problem
The deployment is failing because the GitHub Actions workflow can't find the required `AZURE_STATIC_WEB_APPS_API_TOKEN` secret. This token is needed to authenticate with Azure during deployment.

## Solution Steps

### Step 1: Create Azure Static Web App Resource

1. **Go to Azure Portal**: Visit [portal.azure.com](https://portal.azure.com)

2. **Create a new resource**:
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Static Web App" → "Create"

3. **Configure the Static Web App**:
   - **Subscription**: Choose your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `levelup-ai900-exam` (or your preferred name)
   - **Plan type**: Free (for this project)
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **GitHub account**: Sign in to your GitHub account
   - **Organization**: `bmaia1030314`
   - **Repository**: `Levelup_azure`
   - **Branch**: `main`

4. **Build Configuration**:
   - **Build Presets**: Next.js
   - **App location**: `/` (root directory)
   - **Api location**: `` (leave empty - no API)
   - **Output location**: `out`

5. **Click "Review + create"** then **"Create"**

### Step 2: Get the Deployment Token

After the Azure Static Web App is created:

1. **Navigate to your Static Web App** in the Azure portal
2. **Go to "Overview"** section
3. **Click "Manage deployment token"**
4. **Copy the deployment token** (it looks like: `0123456789abcdef...`)

### Step 3: Add GitHub Secret

1. **Go to your GitHub repository**: [github.com/bmaia1030314/Levelup_azure](https://github.com/bmaia1030314/Levelup_azure)
2. **Navigate to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. **Secret**: Paste the deployment token from Step 2
6. **Click "Add secret"**

### Step 4: Trigger Deployment

Once the secret is added:

1. **Go to the Actions tab** in your GitHub repository
2. **Re-run the failed workflow** or **push a new commit** to trigger deployment
3. **Monitor the workflow** to ensure it completes successfully

## Alternative: Auto-Setup via Azure Portal

Instead of manual token setup, you can:

1. **Delete the existing workflow file** in your repository
2. **Use Azure Portal's GitHub integration** which will automatically:
   - Create the workflow file
   - Set up the deployment token as a GitHub secret
   - Configure all necessary settings

To do this:
1. When creating the Static Web App in Azure Portal
2. Choose GitHub as source and authorize
3. Azure will automatically set up everything for you

## Verification

After successful setup, you should see:
- ✅ GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` created
- ✅ GitHub Actions workflow runs without errors
- ✅ Your app deployed to `https://your-app-name.azurestaticapps.net`

## Troubleshooting

**If you still get token errors:**
1. Verify the secret name exactly matches: `AZURE_STATIC_WEB_APPS_API_TOKEN`
2. Ensure the token was copied completely (no extra spaces)
3. Check that the Azure Static Web App resource is properly created
4. Try regenerating the deployment token in Azure Portal

**If build fails:**
1. Check that Node.js 18+ is available in the build environment
2. Verify package.json has correct build scripts
3. Ensure all dependencies are listed in package.json

## Next Steps

Once deployed successfully:
1. **Test your application** at the Azure-provided URL
2. **Set up custom domain** (if needed)
3. **Configure Application Insights** for monitoring
4. **Set up staging environments** for testing

## Current Workflow Status

The GitHub Actions workflow has been updated to:
- ✅ Use Node.js 18
- ✅ Install dependencies with `npm ci`
- ✅ Build the application with `npm run build`
- ✅ Deploy with correct output location (`out`)
- ✅ Handle both push and pull request events