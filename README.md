# BUILD docker image
docker build -t budget:latest .
# Tag
docker tag budget:latest budgetappr1ae0.azurecr.io/budget:latest
# Log in to the Azure Container Registry
az acr login --name budgetappr1ae0
# Push the Docker image to ACR
docker push budgetappr1ae0.azurecr.io/budget:latest

# DEPLOY to container app
az containerapp registry set -n budgetapp -g rg-budgetapp --server budgetappr1ae0.azurecr.io --username  budgetappr1ae0 --password 3tX7BknLehSIitBWsXgnUnhyWT8SC4SsHJhDMF4lhG+ACRA9xjVV
az containerapp update -n budgetapp -g rg-budgetapp --image budgetappr1ae0.azurecr.io/budget:latest --debug



# Verify image / cleanup
az acr repository show-manifests --name budgetappr1ae0 --repository budget --orderby time_desc --query "[].{tags:tags, size:metadata.size}" --output table
# delete repository
az acr repository delete --name budgetappr1ae0 --repository budget --yes --output none
