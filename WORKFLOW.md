# NutriSmart - Development Workflow

## Project Workflow Overview

This document outlines the complete workflow from development to deployment for the NutriSmart application.

## Development Workflow

### 1. Local Development Setup

```bash
# Clone or navigate to project directory
cd AMD-Slingshot

# Open in browser for testing
# Simply open index.html in your browser
# OR use a local server:
python -m http.server 8000
# OR
npx serve .
```

### 2. Development Cycle

```
1. Make changes to code
   ├── app.js (application logic)
   ├── index.html (UI structure)
   └── styles.css (styling)

2. Test in browser
   ├── Open/refresh index.html
   ├── Test all features
   └── Check browser console for errors

3. Validate changes
   ├── Test on multiple browsers
   ├── Test responsive design
   └── Verify data persistence

4. Commit changes
   └── git commit -m "Description"
```

### 3. Testing Workflow

#### Manual Testing Checklist
- [ ] Goal setting works and persists
- [ ] Meal logging accepts various inputs
- [ ] Nutrition estimation is reasonable
- [ ] Recommendations are relevant
- [ ] Insights update in real-time
- [ ] Data persists across page reloads
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] LocalStorage data is correct

#### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

#### Performance Testing
- [ ] Initial load < 100ms
- [ ] Meal logging < 50ms
- [ ] No memory leaks
- [ ] Smooth animations

## Deployment Workflow

### Option 1: Static Hosting (Simplest)

#### GitHub Pages
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 2. Enable GitHub Pages
# Go to Settings > Pages > Source: main branch

# 3. Access at: https://username.github.io/AMD-Slingshot/
```

#### Netlify
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Follow prompts to link/create site
```

#### Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Follow prompts
```

### Option 2: Google Cloud Run (Containerized)

#### Prerequisites
- Google Cloud account
- gcloud CLI installed
- Docker installed

#### Deployment Steps

```bash
# 1. Build Docker image
docker build -t nutrismart .

# 2. Tag for Google Container Registry
docker tag nutrismart gcr.io/PROJECT_ID/nutrismart

# 3. Push to GCR
docker push gcr.io/PROJECT_ID/nutrismart

# 4. Deploy to Cloud Run
gcloud run deploy nutrismart \
  --image gcr.io/PROJECT_ID/nutrismart \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 5. Access the provided URL
```

#### Automated Deployment (CI/CD)
```yaml
# .github/workflows/deploy.yml
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
      
      - name: Build and Push
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/nutrismart
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy nutrismart \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/nutrismart \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
```

### Option 3: AWS S3 + CloudFront

```bash
# 1. Create S3 bucket
aws s3 mb s3://nutrismart-app

# 2. Upload files
aws s3 sync . s3://nutrismart-app --exclude ".git/*"

# 3. Enable static website hosting
aws s3 website s3://nutrismart-app --index-document index.html

# 4. Set bucket policy for public access
# 5. Create CloudFront distribution
# 6. Access via CloudFront URL
```

## Git Workflow

### Branch Strategy

```
main (production)
  ├── develop (integration)
  │   ├── feature/voice-input
  │   ├── feature/multilingual
  │   └── feature/analytics
  └── hotfix/critical-bug
```

### Commit Convention

```bash
# Feature
git commit -m "feat: add voice input for meal logging"

# Bug fix
git commit -m "fix: correct calorie calculation for rice"

# Documentation
git commit -m "docs: update README with deployment instructions"

# Style
git commit -m "style: improve button hover effects"

# Refactor
git commit -m "refactor: optimize recommendation engine"

# Performance
git commit -m "perf: reduce initial load time"

# Test
git commit -m "test: add unit tests for nutrition estimation"
```

## Release Workflow

### Version Numbering
- **Major.Minor.Patch** (e.g., 1.2.3)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Process

```bash
# 1. Update version in package.json (if using)
# 2. Update CHANGELOG.md
# 3. Create release branch
git checkout -b release/v1.0.0

# 4. Final testing
# 5. Merge to main
git checkout main
git merge release/v1.0.0

# 6. Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 7. Deploy to production
# 8. Merge back to develop
git checkout develop
git merge main
```

## Monitoring Workflow

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track load times
- Check memory usage

### Error Monitoring
- Browser console errors
- LocalStorage failures
- Network issues (if APIs added)
- User-reported bugs

### Analytics (Privacy-Preserving)
- Feature usage (local only)
- Error rates
- Performance metrics
- No user tracking

## Maintenance Workflow

### Regular Tasks

#### Daily
- Monitor error reports
- Review user feedback
- Check deployment status

#### Weekly
- Review performance metrics
- Update documentation
- Plan new features
- Bug triage

#### Monthly
- Security updates
- Dependency updates
- Performance optimization
- Feature releases

### Update Process

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test
# 3. Create pull request
# 4. Code review
# 5. Merge to develop
# 6. Test in staging
# 7. Merge to main
# 8. Deploy to production
```

## Collaboration Workflow

### For Team Members

```bash
# 1. Clone repository
git clone https://github.com/username/AMD-Slingshot.git

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Make changes and commit
git add .
git commit -m "feat: your feature description"

# 4. Push to remote
git push origin feature/your-feature

# 5. Create pull request
# 6. Wait for review
# 7. Address feedback
# 8. Merge when approved
```

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Comments for complex logic
- [ ] No hardcoded values
- [ ] Error handling present
- [ ] Performance optimized
- [ ] Tested on multiple browsers
- [ ] Documentation updated

## Backup Workflow

### Data Backup
- LocalStorage data is user-controlled
- No server-side data to backup
- Users can export their data (future feature)

### Code Backup
- Git repository (primary)
- GitHub (remote)
- Local backups
- Cloud storage (optional)

## Rollback Workflow

### If Deployment Fails

```bash
# 1. Identify the issue
# 2. Revert to previous version
git revert HEAD

# OR rollback to specific commit
git reset --hard COMMIT_HASH

# 3. Redeploy
# 4. Investigate and fix issue
# 5. Deploy fix
```

### Cloud Run Rollback

```bash
# List revisions
gcloud run revisions list --service nutrismart

# Rollback to previous revision
gcloud run services update-traffic nutrismart \
  --to-revisions REVISION_NAME=100
```

## Documentation Workflow

### Documentation Updates

```
When to update:
├── New feature → Update README, FEATURES.md
├── API change → Update TECHNICAL.md
├── Deployment change → Update WORKFLOW.md
├── Bug fix → Update CHANGELOG.md
└── Breaking change → Update all relevant docs
```

### Documentation Review
- Review quarterly
- Update screenshots
- Verify links
- Check accuracy
- Update examples

## Security Workflow

### Security Checklist
- [ ] No sensitive data in code
- [ ] No API keys committed
- [ ] Input validation present
- [ ] XSS prevention
- [ ] HTTPS enforced (in production)
- [ ] Dependencies updated
- [ ] Security headers configured

### Security Updates

```bash
# 1. Check for vulnerabilities
npm audit (if using npm)

# 2. Update dependencies
npm update

# 3. Test thoroughly
# 4. Deploy update
```

## Performance Optimization Workflow

### Optimization Checklist
- [ ] Minify JavaScript
- [ ] Minify CSS
- [ ] Optimize images
- [ ] Enable compression
- [ ] Use CDN (if needed)
- [ ] Lazy load resources
- [ ] Cache static assets

### Performance Testing

```bash
# Run Lighthouse audit
lighthouse https://your-app-url --view

# Check bundle size
# Analyze load time
# Monitor memory usage
```

## Continuous Improvement Workflow

### Feedback Loop

```
1. Gather user feedback
   ├── User testing sessions
   ├── Feedback forms
   └── Usage analytics

2. Prioritize improvements
   ├── Bug fixes (high priority)
   ├── Performance issues
   ├── Feature requests
   └── UX improvements

3. Plan sprint
   └── Select items for next release

4. Develop and test
   └── Follow development workflow

5. Deploy and monitor
   └── Track impact of changes

6. Repeat
```

## Emergency Workflow

### Critical Bug Response

```
1. Identify issue (< 5 minutes)
2. Assess impact (< 10 minutes)
3. Create hotfix branch (< 5 minutes)
4. Fix and test (< 30 minutes)
5. Deploy to production (< 10 minutes)
6. Monitor and verify (< 15 minutes)
7. Post-mortem (within 24 hours)

Total time: < 1 hour for critical fixes
```

## Tools & Resources

### Development Tools
- VS Code / Your preferred IDE
- Browser DevTools
- Git
- Docker (for Cloud Run)

### Testing Tools
- Browser DevTools
- Lighthouse
- BrowserStack (cross-browser)
- Local server (Python, Node, etc.)

### Deployment Tools
- gcloud CLI
- Docker
- GitHub Actions
- Netlify/Vercel CLI

### Monitoring Tools
- Google Analytics (optional, privacy-preserving)
- Sentry (error tracking)
- Lighthouse CI
- Custom logging

## Best Practices

### Code Quality
- Write clean, readable code
- Comment complex logic
- Follow consistent style
- Use meaningful variable names
- Keep functions small and focused

### Git Practices
- Commit often
- Write descriptive commit messages
- Use branches for features
- Review before merging
- Keep main branch stable

### Testing Practices
- Test before committing
- Test on multiple browsers
- Test responsive design
- Test edge cases
- Test error scenarios

### Deployment Practices
- Test in staging first
- Deploy during low-traffic hours
- Monitor after deployment
- Have rollback plan ready
- Document deployment steps

---

**Remember**: This workflow is a living document. Update it as the project evolves and new practices are adopted.

**Last Updated**: April 2026
**Version**: 1.0.0
