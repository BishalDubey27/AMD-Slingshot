# NutriSmart - Deployment Guide

## Google Cloud Run Deployment

This guide will help you deploy NutriSmart to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**
   - Sign up at https://cloud.google.com
   - Create a new project or use existing one
   - Enable billing (Cloud Run has a generous free tier)

2. **Install Required Tools**
   ```bash
   # Install Google Cloud SDK
   # Visit: https://cloud.google.com/sdk/docs/install
   
   # Install Docker
   # Visit: https://docs.docker.com/get-docker/
   ```

3. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

## Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh YOUR_PROJECT_ID us-central1

# Example:
./deploy.sh nutrismart-app us-central1
```

The script will:
- Enable required APIs
- Build Docker image
- Push to Google Container Registry
- Deploy to Cloud Run
- Provide the live URL

### Method 2: Manual Deployment

#### Step 1: Enable APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Step 2: Build Docker Image
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/nutrismart .
```

#### Step 3: Configure Docker Authentication
```bash
gcloud auth configure-docker
```

#### Step 4: Push to Container Registry
```bash
docker push gcr.io/YOUR_PROJECT_ID/nutrismart
```

#### Step 5: Deploy to Cloud Run
```bash
gcloud run deploy nutrismart \
  --image gcr.io/YOUR_PROJECT_ID/nutrismart \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 10 \
  --port 8080
```

#### Step 6: Get Service URL
```bash
gcloud run services describe nutrismart \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

### Method 3: Cloud Build (CI/CD)

#### Step 1: Connect GitHub Repository
```bash
# In Google Cloud Console:
# 1. Go to Cloud Build > Triggers
# 2. Click "Connect Repository"
# 3. Select GitHub and authorize
# 4. Choose your repository
```

#### Step 2: Create Build Trigger
```bash
# In Cloud Build > Triggers:
# 1. Click "Create Trigger"
# 2. Name: "Deploy NutriSmart"
# 3. Event: Push to branch
# 4. Branch: ^main$
# 5. Configuration: Cloud Build configuration file
# 6. Location: /cloudbuild.yaml
# 7. Click "Create"
```

#### Step 3: Push to GitHub
```bash
git add .
git commit -m "Deploy to Cloud Run"
git push origin main
```

The deployment will trigger automatically on every push to main branch.

## Configuration Options

### Memory and CPU
```bash
# Adjust based on your needs
--memory 256Mi    # Options: 128Mi, 256Mi, 512Mi, 1Gi, 2Gi, 4Gi
--cpu 1           # Options: 1, 2, 4
```

### Scaling
```bash
--min-instances 0      # Minimum instances (0 = scale to zero)
--max-instances 10     # Maximum instances
--concurrency 80       # Requests per instance
```

### Region Selection
```bash
# Choose region closest to your users
--region us-central1       # Iowa
--region us-east1          # South Carolina
--region europe-west1      # Belgium
--region asia-northeast1   # Tokyo
```

### Custom Domain
```bash
# Map custom domain
gcloud run domain-mappings create \
  --service nutrismart \
  --domain app.yourdomain.com \
  --region us-central1
```

## Environment Variables (Optional)

If you need to add environment variables:

```bash
gcloud run deploy nutrismart \
  --image gcr.io/YOUR_PROJECT_ID/nutrismart \
  --set-env-vars "ENV_VAR_NAME=value" \
  --platform managed \
  --region us-central1
```

## Monitoring and Logs

### View Logs
```bash
# Stream logs
gcloud run logs tail --service nutrismart

# Read recent logs
gcloud run logs read --service nutrismart --limit 50
```

### View Metrics
```bash
# In Google Cloud Console:
# Cloud Run > nutrismart > Metrics
# View: Request count, latency, CPU, memory
```

### Set Up Alerts
```bash
# In Google Cloud Console:
# Monitoring > Alerting > Create Policy
# Set alerts for: Error rate, latency, CPU usage
```

## Cost Optimization

### Cloud Run Pricing (as of 2026)
- **Free Tier**: 2 million requests/month
- **CPU**: $0.00002400/vCPU-second
- **Memory**: $0.00000250/GiB-second
- **Requests**: $0.40/million requests

### Optimization Tips
1. **Scale to Zero**: Set min-instances to 0
2. **Right-size Resources**: Use 256Mi memory for this app
3. **Enable CDN**: Use Cloud CDN for static assets
4. **Optimize Images**: Minimize Docker image size

### Estimated Monthly Cost
For 10,000 users with 5 requests/day:
- Requests: 1.5M/month (within free tier)
- CPU/Memory: ~$5-10/month
- **Total: $5-10/month** (or free if under limits)

## Troubleshooting

### Issue: Build Fails
```bash
# Check Docker build locally
docker build -t nutrismart-test .
docker run -p 8080:8080 nutrismart-test

# Visit http://localhost:8080
```

### Issue: Deployment Fails
```bash
# Check service status
gcloud run services describe nutrismart --region us-central1

# Check logs for errors
gcloud run logs read --service nutrismart --limit 100
```

### Issue: 403 Forbidden
```bash
# Make service public
gcloud run services add-iam-policy-binding nutrismart \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region us-central1
```

### Issue: Container Fails to Start
```bash
# Check if port 8080 is exposed
# Verify nginx.conf has correct port
# Check Dockerfile EXPOSE directive
```

## Updating the Application

### Update and Redeploy
```bash
# Make your changes
# Then redeploy using the same command
./deploy.sh YOUR_PROJECT_ID us-central1

# Or manually:
docker build -t gcr.io/YOUR_PROJECT_ID/nutrismart .
docker push gcr.io/YOUR_PROJECT_ID/nutrismart
gcloud run deploy nutrismart --image gcr.io/YOUR_PROJECT_ID/nutrismart --region us-central1
```

### Rollback to Previous Version
```bash
# List revisions
gcloud run revisions list --service nutrismart --region us-central1

# Rollback to specific revision
gcloud run services update-traffic nutrismart \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## Security Best Practices

1. **HTTPS Only**: Cloud Run enforces HTTPS automatically
2. **IAM Permissions**: Use least privilege principle
3. **Security Headers**: Configured in nginx.conf
4. **No Secrets in Code**: Use Secret Manager for sensitive data
5. **Regular Updates**: Keep base images updated

## Performance Optimization

1. **Enable CDN**: Use Cloud CDN for static assets
2. **Compression**: Gzip enabled in nginx.conf
3. **Caching**: Static assets cached for 1 year
4. **Cold Start**: Minimize with min-instances (costs more)

## Alternative Deployment Options

### Option 1: Netlify (Simpler, Static Only)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Follow prompts
```

### Option 2: Vercel (Simpler, Static Only)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: GitHub Pages (Free, Static Only)
```bash
# Push to GitHub
git push origin main

# Enable in Settings > Pages > Source: main branch
# Access at: https://username.github.io/AMD-Slingshot/
```

## Support and Resources

### Documentation
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Community
- [Cloud Run on Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-run)
- [Google Cloud Community](https://www.googlecloudcommunity.com/)

### Pricing Calculator
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)

## Quick Reference

### Common Commands
```bash
# Deploy
./deploy.sh YOUR_PROJECT_ID

# View logs
gcloud run logs tail --service nutrismart

# Get URL
gcloud run services describe nutrismart --format 'value(status.url)'

# Delete service
gcloud run services delete nutrismart --region us-central1

# List services
gcloud run services list

# Update traffic split (for A/B testing)
gcloud run services update-traffic nutrismart \
  --to-revisions REVISION1=50,REVISION2=50
```

### Environment Setup
```bash
# Set default project
gcloud config set project YOUR_PROJECT_ID

# Set default region
gcloud config set run/region us-central1

# View current config
gcloud config list
```

---

**Need Help?**
- Check the [WORKFLOW.md](WORKFLOW.md) for development workflow
- Review [TECHNICAL.md](TECHNICAL.md) for architecture details
- See [README.md](README.md) for project overview

**Ready to Deploy?**
```bash
chmod +x deploy.sh
./deploy.sh YOUR_PROJECT_ID us-central1
```

Good luck with your deployment! 🚀
