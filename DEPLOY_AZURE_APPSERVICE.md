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
   - **Runtime**: Node 20
   - **Operating System**: Linux
   - **Region**: Choose your preferred region
   - **Pricing**: B1 Basic (or F1 Free for testing)

## Step 3: Deployment Options

### Option A: GitHub Actions (Recommended)
- The checked-in `.github/workflows/main_levelup.yml` deploys `Levelup` on pushes to `main` or a manual workflow dispatch.
- Configure the repository secret `AZUREAPPSERVICE_PUBLISHPROFILE_78789C0D50994F9C8A2B0A4A71E3E96D` with the App Service publish profile. Never commit the profile.
- The build job runs `npm ci --include=dev` and `npm run build`, then archives the production `.next` output, dependencies, public assets, and runtime configuration.
- The deploy job extracts that archive and deploys it with the publish profile. Archiving preserves the hidden `.next` directory across the artifact upload/download steps.
- Pull requests targeting `main`, the AB-731 feature branch, or the AB-730 feature branch run all imported practice banks' data regression checks and production build without deploying. The feature-branch targets support stacked AB-730 and GH-300 pull requests while their parent changes are under review. The deploy job runs only for non-pull-request runs on `main`; manual dispatches on other branches are build-only.
- This workflow does not use Azure OIDC login. If switching back to OIDC, the Azure federated credential's subject must exactly match GitHub's emitted subject, including immutable owner/repository IDs when enabled.

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
WEBSITES_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=false
```

### Build Configuration:
GitHub Actions installs dependencies and builds the application before deployment. The checked-in `.deployment` file disables a second server-side build. Configure the App Service startup command as `npm start`, which runs `server.js` against the deployed `.next` build.

## Expected Behavior

Your app will be available at: `https://levelup-azure-ai900.azurewebsites.net`

## Troubleshooting

Check logs in Azure Portal > Your App Service > Log stream

If deployment reports success but new pages return 404, confirm the build job ran and the deployment package contains `.next/BUILD_ID` and the new routes. Uploading only source files is insufficient when server-side builds are disabled.

For `AADSTS700213` in an older OIDC workflow, compare the assertion subject in the failed login log with the Azure federated identity credential. Rerunning an old workflow uses its original commit; use the updated workflow on `main` instead.