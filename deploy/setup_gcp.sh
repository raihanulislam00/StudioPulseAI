#!/usr/bin/env bash
# ==============================================================================
# StudioPulse AI — Google Cloud Infrastructure Provisioning Script
# ==============================================================================

set -euo pipefail

echo "==> Configuring Google Cloud Project for StudioPulse AI..."

# Ensure PROJECT_ID is set
if [ -z "${GOOGLE_CLOUD_PROJECT:-}" ]; then
  echo "Error: GOOGLE_CLOUD_PROJECT environment variable is not set."
  echo "Run: export GOOGLE_CLOUD_PROJECT='your-project-id'"
  exit 1
fi

REGION="${GOOGLE_CLOUD_REGION:-us-central1}"

echo "Project: $GOOGLE_CLOUD_PROJECT"
echo "Region:  $REGION"

# 1. Enable Required GCP APIs
echo "==> Enabling Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com \
  cloudbuild.googleapis.com \
  --project="$GOOGLE_CLOUD_PROJECT"

# 2. Create Artifact Registry Repository
echo "==> Creating Artifact Registry repository..."
gcloud artifacts repositories create studiopulse \
  --repository-format=docker \
  --location="$REGION" \
  --description="StudioPulse AI Container Registry" \
  --project="$GOOGLE_CLOUD_PROJECT" || true

# 3. Create Secrets in Secret Manager if not present
echo "==> Configuring Secret Manager secrets..."
create_secret_if_missing() {
  local secret_name="$1"
  if ! gcloud secrets describe "$secret_name" --project="$GOOGLE_CLOUD_PROJECT" >/dev/null 2>&1; then
    echo "Creating secret: $secret_name"
    gcloud secrets create "$secret_name" --replication-policy="automatic" --project="$GOOGLE_CLOUD_PROJECT"
  fi
}

create_secret_if_missing "GEMINI_API_KEY"
create_secret_if_missing "GRAFANA_URL"
create_secret_if_missing "GRAFANA_SERVICE_ACCOUNT_TOKEN"

echo "==> Google Cloud setup complete! You can now deploy using Cloud Run."
