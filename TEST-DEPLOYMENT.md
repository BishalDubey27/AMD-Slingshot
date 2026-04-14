# NutriSmart - Deployment Testing Guide

## Pre-Deployment Checklist

### 1. Verify Local Functionality

```bash
# Test 1: Open in browser
# Open index.html directly in browser
# Expected: App loads without errors

# Test 2: Local server
python -m http.server 8000
# Visit: http://localhost:8000
# Expected: App works perfectly
```

### 2. Test Core Features

- [ ] Goal setting works and persists
- [ ] Meal logging accepts input
- [ ] Nutrition estimation displays
- [ ] Recommendations appear
- [ ] Insights update in real-time
- [ ] Data persists after refresh
- [ ] No console errors

### 3. Verify Docker Build

```bash
# Build Docker image locally
docker build -t nutrismart-test .

# Run container
docker run -p 8080:8080 nutrismart-test

# Test in browser
# Visit: http://localhost:8080
# Expected: App works identically to local version
```

## Google Cloud Run Deployment

### Step 1: Prerequisites Check

```bash
# Check gcloud installation
gcloud --version
# Expected: Google Cloud SDK version info

# Check Docker installation
docker --version
# Expected: Docker version info

# Check authentication
gcloud auth list
# Expected: Your authenticated account

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable Required APIs

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled
```

### Step 3: Deploy Using Script

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh YOUR_PROJECT_ID us-central1

# Expected output:
# - Building Docker image...
# - Pushing to GCR...
# - Deploying to Cloud Run...
# - Service URL: https://nutrismart-xxxxx.run.app
```

### Step 4: Verify Deployment

```bash
# Get service URL
gcloud run services describe nutrismart \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'

# Check service status
gcloud run services describe nutrismart \
  --platform managed \
  --region us-central1

# Expected: Service is READY
```

### Step 5: Test Live Application

```bash
# Visit the service URL in browser
# Test all features:
# 1. Set goals
# 2. Log meals
# 3. View insights
# 4. Check recommendations
# 5. Verify data persistence
```

## Manual Deployment Steps

If the script fails, use these manual steps:

### 1. Build and Push Image

```bash
# Build
docker build -t gcr.io/YOUR_PROJECT_ID/nutrismart .

# Configure Docker auth
gcloud auth configure-docker

# Push
docker push gcr.io/YOUR_PROJECT_ID/nutrismart
```

### 2. Deploy to Cloud Run

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

### 3. Verify Deployment

```bash
# Check logs
gcloud run logs read --service nutrismart --limit 50

# Check metrics
gcloud run services describe nutrismart --region us-central1
```

## Alternative Deployment: Netlify

### Quick Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Publish directory: . (current directory)
# - Site name: nutrismart (or auto-generated)
```

### Expected Result
- Site URL: https://nutrismart.netlify.app (or similar)
- Deployment time: ~30 seconds
- Status: Published

## Alternative Deployment: Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts
```

### Expected Result
- Site URL: https://nutrismart.vercel.app (or similar)
- Deployment time: ~20 seconds
- Status: Ready

## Alternative Deployment: GitHub Pages

### Setup

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 2. Enable GitHub Pages
# Go to: Settings > Pages
# Source: main branch
# Save

# 3. Wait 1-2 minutes
# Visit: https://USERNAME.github.io/AMD-Slingshot/
```

## Troubleshooting

### Issue: Docker build fails

```bash
# Check Dockerfile syntax
cat Dockerfile

# Build with verbose output
docker build -t nutrismart-test . --progress=plain

# Check for errors in output
```

### Issue: Cloud Run deployment fails

```bash
# Check service logs
gcloud run logs read --service nutrismart --limit 100

# Check service status
gcloud run services describe nutrismart --region us-central1

# Common fixes:
# 1. Ensure port 8080 is exposed
# 2. Check nginx.conf is correct
# 3. Verify image was pushed successfully
```

### Issue: App not accessible

```bash
# Check if service is public
gcloud run services add-iam-policy-binding nutrismart \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region us-central1

# Verify URL
gcloud run services describe nutrismart \
  --region us-central1 \
  --format 'value(status.url)'
```

### Issue: App loads but doesn't work

```bash
# Check browser console for errors
# Common issues:
# 1. CORS errors (shouldn't happen with static files)
# 2. JavaScript errors (check app.js)
# 3. LocalStorage disabled (check browser settings)
```

## Performance Testing

### Load Time Test

```bash
# Use curl to test response time
time curl -I https://YOUR_SERVICE_URL

# Expected: < 200ms
```

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://YOUR_SERVICE_URL --view

# Expected scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

### Load Testing

```bash
# Simple load test with Apache Bench
ab -n 1000 -c 10 https://YOUR_SERVICE_URL/

# Expected:
# - No failed requests
# - Average response time < 200ms
```

## Security Testing

### SSL/TLS Check

```bash
# Cloud Run provides HTTPS automatically
# Verify certificate
curl -vI https://YOUR_SERVICE_URL 2>&1 | grep -i ssl

# Expected: Valid SSL certificate
```

### Security Headers Check

```bash
# Check security headers
curl -I https://YOUR_SERVICE_URL

# Expected headers:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

## Monitoring Setup

### Enable Logging

```bash
# View real-time logs
gcloud run logs tail --service nutrismart

# View recent logs
gcloud run logs read --service nutrismart --limit 100
```

### Set Up Alerts

```bash
# In Google Cloud Console:
# 1. Go to Monitoring > Alerting
# 2. Create Policy
# 3. Set conditions:
#    - Error rate > 5%
#    - Latency > 1s
#    - CPU > 80%
# 4. Set notification channels
```

## Cost Monitoring

### Check Current Usage

```bash
# View Cloud Run metrics
gcloud run services describe nutrismart \
  --region us-central1 \
  --format json

# Check billing
# Go to: Cloud Console > Billing > Reports
```

### Estimated Costs

For 10,000 users with 5 requests/day:
- Requests: 1.5M/month
- Free tier: 2M requests/month
- **Cost: $0-5/month**

## Rollback Procedure

### If Deployment Fails

```bash
# List revisions
gcloud run revisions list --service nutrismart --region us-central1

# Rollback to previous revision
gcloud run services update-traffic nutrismart \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

## CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      
      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/nutrismart
          gcloud run deploy nutrismart \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/nutrismart \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
```

## Post-Deployment Checklist

- [ ] Application is accessible via URL
- [ ] All features work correctly
- [ ] No console errors
- [ ] Data persists across sessions
- [ ] Performance is acceptable (< 200ms load)
- [ ] Security headers are present
- [ ] HTTPS is enforced
- [ ] Monitoring is set up
- [ ] Logs are accessible
- [ ] Cost tracking is enabled

## Success Criteria

### Functional
- ✅ App loads in < 200ms
- ✅ All features work
- ✅ No errors in console
- ✅ Data persists correctly

### Performance
- ✅ Lighthouse score > 90
- ✅ Response time < 200ms
- ✅ No failed requests

### Security
- ✅ HTTPS enforced
- ✅ Security headers present
- ✅ No vulnerabilities

### Cost
- ✅ Within free tier or < $10/month
- ✅ Auto-scaling configured
- ✅ Cost alerts set up

## Final Verification

```bash
# 1. Visit the live URL
echo "Testing: $(gcloud run services describe nutrismart --region us-central1 --format 'value(status.url)')"

# 2. Test all features
# - Set goals
# - Log meals
# - View insights
# - Check recommendations

# 3. Check logs for errors
gcloud run logs read --service nutrismart --limit 50

# 4. Verify metrics
gcloud run services describe nutrismart --region us-central1

# 5. Test from different devices
# - Desktop browser
# - Mobile browser
# - Different networks
```

## Deployment Complete! 🎉

Your NutriSmart application is now live and ready for the AMD Slingshot challenge!

**Next Steps:**
1. Share the URL with judges/evaluators
2. Monitor logs and metrics
3. Gather user feedback
4. Iterate and improve

**Live URL:** [Your Cloud Run URL]

---

**Deployment Date:** [Date]
**Version:** 1.0.0
**Status:** ✅ Production Ready
