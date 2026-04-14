# NutriSmart - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Option 1: Local Testing (Fastest)

```bash
# 1. Navigate to project folder
cd AMD-Slingshot

# 2. Open in browser
# Just double-click index.html
# OR use a local server:
python -m http.server 8000
# Then visit: http://localhost:8000

# 3. Start using!
# - Set your goals
# - Log some meals
# - Get smart recommendations
```

### Option 2: Deploy to Cloud Run (Production)

```bash
# 1. Prerequisites
# - Google Cloud account
# - gcloud CLI installed
# - Docker installed

# 2. Deploy with one command
chmod +x deploy.sh
./deploy.sh YOUR_PROJECT_ID us-central1

# 3. Access your live app!
# The script will provide the URL
```

### Option 3: Deploy to Netlify (Easiest Cloud)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Follow the prompts
# Your app will be live in seconds!
```

## 📖 What to Do Next

### First Time Users
1. Click "Set Goals" button
2. Choose your health goal (weight loss, muscle gain, etc.)
3. Set your daily calorie target
4. Select dietary preferences
5. Click "Save Goals"

### Log Your First Meal
1. Type what you ate in the input box
   - Examples: "chicken biryani", "2 idlis", "paneer sandwich"
2. Press Enter or click "Log Meal"
3. Watch the magic happen!

### Explore Features
- View real-time insights dashboard
- Read personalized recommendations
- Check your meal history
- Adjust goals anytime

## 🎯 Sample Test Scenarios

### Scenario 1: Weight Loss
```
Goal: Weight Loss, 1600 calories
Try logging:
- "oatmeal with fruits"
- "grilled chicken salad"
- "dal with 2 rotis"

Watch the recommendations adapt!
```

### Scenario 2: Muscle Gain
```
Goal: Muscle Gain, 2500 calories
Try logging:
- "4 egg omelette"
- "chicken biryani"
- "paneer tikka"

See protein-focused suggestions!
```

### Scenario 3: Indian Vegetarian
```
Goal: Maintain Health, 2000 calories
Preferences: Vegetarian
Try logging:
- "2 parathas with curd"
- "vegetable pulao"
- "fruit smoothie"

Get vegetarian protein tips!
```

## 📁 Project Structure

```
AMD-Slingshot/
├── index.html          # Main UI
├── app.js              # Application logic
├── styles.css          # Styling
├── Dockerfile          # For Cloud Run
├── nginx.conf          # Web server config
├── deploy.sh           # Deployment script
├── README.md           # Project overview
├── QUICKSTART.md       # This file
├── DEPLOYMENT.md       # Detailed deployment guide
├── WORKFLOW.md         # Development workflow
└── Documentation/
    ├── plan.md
    ├── PITCH.md
    ├── TECHNICAL.md
    ├── DEMO-GUIDE.md
    ├── FEATURES.md
    └── PROJECT-SUMMARY.md
```

## 🛠️ Troubleshooting

### Issue: App not loading
- Make sure you're opening index.html in a modern browser
- Try using a local server instead of file://
- Check browser console for errors

### Issue: Data not persisting
- Check if LocalStorage is enabled in your browser
- Make sure you're not in incognito/private mode
- Try clearing browser cache and reload

### Issue: Recommendations not showing
- Log at least one meal first
- Set your goals before logging meals
- Check if you have JavaScript enabled

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Full deployment guide
- **[WORKFLOW.md](WORKFLOW.md)** - Development workflow
- **[TECHNICAL.md](TECHNICAL.md)** - Technical details
- **[DEMO-GUIDE.md](DEMO-GUIDE.md)** - Demo instructions
- **[FEATURES.md](FEATURES.md)** - Feature list
- **[PITCH.md](PITCH.md)** - Pitch deck

## 🎥 Demo Video Script

Want to record a demo? Follow this 2-minute script:

1. **Introduction (15s)**
   - "Hi, this is NutriSmart - your AI-powered food companion"

2. **Set Goals (20s)**
   - Show goal setting modal
   - Select weight loss, 1800 calories
   - Save goals

3. **Log Meals (30s)**
   - Type "chicken biryani" - show instant estimation
   - Type "paneer sandwich" - show it understands Indian food
   - Type "fruit smoothie" - show variety

4. **Show Insights (20s)**
   - Point to calorie tracking
   - Show protein intake
   - Highlight remaining budget

5. **Smart Recommendations (25s)**
   - Read 2-3 recommendations
   - Explain how they're personalized
   - Show behavioral nudges

6. **Conclusion (10s)**
   - "Simple, smart, and private"
   - "Try it now!"

## 💡 Tips for Best Experience

1. **Be Specific**: "2 idlis with sambar" is better than just "breakfast"
2. **Log Regularly**: More data = better recommendations
3. **Set Realistic Goals**: Start with maintenance, then adjust
4. **Check Recommendations**: They adapt throughout the day
5. **Use Natural Language**: Just type what you ate, no codes needed

## 🌟 Key Features to Try

- ✅ Natural language meal logging
- ✅ Real-time calorie tracking
- ✅ Smart recommendations
- ✅ Indian food recognition
- ✅ Goal-based guidance
- ✅ Privacy-first (all data local)
- ✅ Works offline
- ✅ No signup required

## 🚀 Ready to Deploy?

### Quick Deploy Commands

**Cloud Run:**
```bash
./deploy.sh YOUR_PROJECT_ID
```

**Netlify:**
```bash
netlify deploy --prod
```

**GitHub Pages:**
```bash
git push origin main
# Enable in Settings > Pages
```

## 📞 Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
- Review [TECHNICAL.md](TECHNICAL.md) for architecture details
- See [WORKFLOW.md](WORKFLOW.md) for development process
- Open an issue on GitHub

## 🎉 You're All Set!

Start by opening `index.html` in your browser and logging your first meal!

**Happy tracking! 🥗**
