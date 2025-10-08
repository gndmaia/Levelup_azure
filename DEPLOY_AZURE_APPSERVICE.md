# Azure App Service Deployment Guide

## When to Use App Service
- Need more control over the runtime environment
- Want to use Azure App Service features (auto-scaling, slots, etc.)
- Need persistent storage or database connections

## Step 1: Prepare for Deployment

First, let's add a production configuration:

1. **Update package.json** (add start script if missing)
2. **Configure for Node.js deployment**

## Step 2: Create App Service

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create a resource** > **Web App**
3. **Configure**:
   - **Name**: levelup-azure-ai900
   - **Runtime**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: Choose your preferred region
   - **Pricing**: B1 Basic (or F1 Free for testing)

## Step 3: Deployment Options

### Option A: GitHub Actions (Recommended)
- Connect to your GitHub repository
- Azure will create a workflow automatically
- Automatic deployments on push to main

### Option B: Azure CLI
```bash
# Install Azure CLI first
az login
az webapp up --name levelup-azure-ai900 --resource-group your-rg --location eastus
```

### Option C: VS Code Extension
- Install "Azure App Service" extension
- Right-click project folder
- "Deploy to Web App"

## Step 4: Configuration

In Azure Portal > Your App Service > Configuration:

### Application Settings:
```
NODE_ENV=production
WEBSITES_NODE_DEFAULT_VERSION=~18
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Build Configuration:
Azure will automatically:
- Run `npm install`
- Run `npm run build`
- Start with `npm start`

## Expected Behavior

Your app will be available at: `https://levelup-azure-ai900.azurewebsites.net`

## Troubleshooting

Check logs in Azure Portal > Your App Service > Log stream