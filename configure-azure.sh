#!/bin/bash
# Run this in Azure Cloud Shell (bash)

APP_NAME="Levelup"
RESOURCE_GROUP="app"

echo "Setting Azure App Service configuration for Next.js build..."

# Set SCM_DO_BUILD_DURING_DEPLOYMENT
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT="true"

# Set POST_BUILD_COMMAND
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings POST_BUILD_COMMAND="npm run build"

# Set ENABLE_ORYX_BUILD
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings ENABLE_ORYX_BUILD="true"

echo "Settings configured. Restarting app..."

# Restart the app
az webapp restart \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP

echo "Done! Check deployment logs in Azure Portal."
