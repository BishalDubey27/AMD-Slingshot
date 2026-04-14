class NutriSmartApp {
    constructor() {
        this.meals = JSON.parse(localStorage.getItem('meals')) || [];
        this.goals = JSON.parse(localStorage.getItem('goals')) || null;
        this.gamification = JSON.parse(localStorage.getItem('gamification')) || {
            points: 0,
            level: 1,
            badges: [],
            streak: 0,
            lastLogDate: null,
            achievements: {
                mealsLogged: 0,
                proteinGoalsMet: 0,
                calorieGoalsMet: 0,
                vegetablesLogged: 0,
                earlyBreakfasts: 0
            }
        };
        this.tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
        this.currentTutorialStep = 0;
        this.init();
    }

    async init() {
        this.updateGoalDisplay();
        this.updateInsights();
        await this.updateRecommendations();
        this.updateMealHistory();
        this.updateGamificationPanel();
        this.updateDashboard();
        this.setupEventListeners();
        
        // Show tutorial for first-time users
        if (!this.tutorialCompleted) {
            setTimeout(() => this.startTutorial(), 1000);
        }
        
        // Check and update streak
        this.checkStreak();
    }

    setupEventListeners() {
        document.getElementById('goalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGoals();
        });

        document.getElementById('mealInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.logMeal();
            }
        });
        
        // Tutorial controls
        document.getElementById('skipTutorial')?.addEventListener('click', () => this.skipTutorial());
        document.getElementById('nextTutorial')?.addEventListener('click', () => this.nextTutorialStep());
        document.getElementById('prevTutorial')?.addEventListener('click', () => this.prevTutorialStep());
    }

    async logMeal() {
        const input = document.getElementById('mealInput');
        const mealDescription = input.value.trim();
        
        if (!mealDescription) return;

        // Show loading state
        this.showLoading('Analyzing your meal with AI...');

        const meal = {
            id: Date.now(),
            description: mealDescription,
            timestamp: new Date().toISOString(),
            nutrition: await this.estimateNutritionWithAI(mealDescription)
        };

        this.meals.unshift(meal);
        localStorage.setItem('meals', JSON.stringify(this.meals));
        
        input.value = '';
        
        // Update gamification
        this.addPoints(CONFIG.POINTS.LOG_MEAL, 'Meal logged! 🍽️');
        this.gamification.achievements.mealsLogged++;
        this.checkAchievements();
        this.updateStreak();
        
        this.hideLoading();
        this.updateInsights();
        await this.updateRecommendations();
        this.updateMealHistory();
        this.updateGamificationPanel();
        this.updateDashboard();
        
        // Save gamification data
        localStorage.setItem('gamification', JSON.stringify(this.gamification));
    }

    async estimateNutritionWithAI(description) {
        try {
            const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze this meal and provide nutrition information in JSON format: "${description}". 
                            Return ONLY a JSON object with these exact fields: 
                            {"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "healthScore": number (1-10)}
                            Be accurate for Indian and international foods. Health score should reflect nutritional value.`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const nutrition = JSON.parse(jsonMatch[0]);
                return nutrition;
            }
        } catch (error) {
            console.error('AI estimation failed, using fallback:', error);
        }
        
        // Fallback to local estimation
        return this.estimateNutritionLocal(description);
    }

    estimateNutritionLocal(description) {
        const lower = description.toLowerCase();
        let calories = 400, protein = 20, carbs = 40, fat = 15, fiber = 5, healthScore = 6;

        // Indian cuisine
        if (lower.includes('dosa') || lower.includes('idli')) {
            calories = 200; protein = 8; carbs = 35; fat = 5; fiber = 3; healthScore = 8;
        } else if (lower.includes('biryani') || lower.includes('pulao')) {
            calories = 600; protein = 25; carbs = 75; fat = 20; fiber = 4; healthScore = 6;
        } else if (lower.includes('dal') || lower.includes('daal')) {
            calories = 180; protein = 12; carbs = 30; fat = 3; fiber = 8; healthScore = 9;
        } else if (lower.includes('roti') || lower.includes('chapati')) {
            calories