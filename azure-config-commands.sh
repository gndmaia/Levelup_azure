# Azure CLI commands to configure App Service for Next.js build
# Replace <app-name> and <resource-group> with your actual values

az webapp config appsettings set --name <app-name> --resource-group <resource-group> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

az webapp config appsettings set --name <app-name> --resource-group <resource-group> --settings ENABLE_ORYX_BUILD=true

az webapp config appsettings set --name <app-name> --resource-group <resource-group> --settings POST_BUILD_COMMAND="npm run build"

# After setting these, restart the app
az webapp restart --name <app-name> --resource-group <resource-group>
