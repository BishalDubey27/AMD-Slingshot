// Enhanced NutriSmart Application with Gemini AI, Gamification, and Tutorial

class NutriSmartEnhanced {
    constructor() {
        // Initialize data
        this.meals = JSON.parse(localStorage.getItem('meals')) || [];
        this.goals = JSON.parse(localStorage.getItem('goals')) || null;
        
        // Initialize modules
        this.gamification = new Gamification();
        this.geminiAI = new GeminiAI(CONFIG.GEMINI_API_KEY);
        this.dashboard = new Dashboard(this.meals, this.goals);
        
        // Tutorial
        this.tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
        
        // Current tab
        this.currentTab = 'home';
        
        this.init();
    }

    async init() {
        this.updateGoalDisplay();
        this.updateInsights();
        await this.updateRecommendations();
        this.updateMealHistory();
        this.updateGamificationPanel();
        this.dashboard.update(this.meals, this.goals);
        this.updateAchievementsTab();
        this.setupEventListeners();
        
        // Show tutorial for first-time users
        if (!this.tutorialCompleted) {
            setTimeout(() => {
                tutorial = new Tutorial();
                tutorial.start();
            }, 1000);
        }
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
    }

    async logMeal() {
        const input = document.getElementById('mealInput');
        const mealDescription = input.value.trim();
        
        if (!mealDescription) return;

        // Show loading
        this.showLoading('Analyzing your meal with Gemini AI...');

        try {
            // Get AI-powered nutrition analysis
            let nutrition = await this.geminiAI.analyzeNutrition(mealDescription);
            
            // Fallback to local if AI fails
            if (!nutrition) {
                nutrition = this.estimateNutritionLocal(mealDescription);
            }

            const meal = {
                id: Date.now(),
                description: mealDescription,
                timestamp: new Date().toISOString(),
                nutrition: nutrition
            };

            this.meals.unshift(meal);
            localStorage.setItem('meals', JSON.stringify(this.meals));
            
            input.value = '';
            
            // Update gamification
            this.gamification.addPoints(CONFIG.POINTS.LOG_MEAL, 'Meal logged! 🍽️');
            this.gamification.data.achievements.mealsLogged++;
            
            // Check for early breakfast
            const hour = new Date().getHours();
            if (hour < 9) {
                this.gamification.data.achievements.earlyBreakfasts++;
                this.gamification.addPoints(5, 'Early breakfast! 🌅');
            }
            
            // Check for vegetables
            if (mealDescription.toLowerCase().includes('vegetable') || 
                mealDescription.toLowerCase().includes('salad') ||
                mealDescription.toLowerCase().includes('veggie')) {
                this.gamification.data.achievements.vegetablesLogged++;
                this.gamification.addPoints(CONFIG.POINTS.LOG_VEGETABLES, 'Veggies logged! 🥦');
            }
            
            this.gamification.updateStreak();
            this.gamification.checkAchievements();
            this.gamification.save();
            
            this.hideLoading();
            this.updateInsights();
            await this.updateRecommendations();
            this.updateMealHistory();
            this.updateGamificationPanel();
            this.dashboard.update(this.meals, this.goals);
            this.updateAchievementsTab();
            
            // Check if goals met
            this.checkGoalsAchievement();
            
        } catch (error) {
            console.error('Error logging meal:', error);
            this.hideLoading();
            alert('Error logging meal. Please try again.');
        }
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
            calories = 120; protein = 4; carbs = 22; fat = 2; fiber = 3; healthScore = 8;
        } else if (lower.includes('paratha')) {
            calories = 300; protein = 8; carbs = 40; fat = 12; fiber = 3; healthScore = 6;
        } else if (lower.includes('samosa') || lower.includes('pakora')) {
            calories = 250; protein = 6; carbs = 30; fat = 12; fiber = 2; healthScore = 4;
        } else if (lower.includes('paneer')) {
            calories = 400; protein = 28; carbs = 15; fat = 25; fiber = 2; healthScore = 7;
        } else if (lower.includes('curd') || lower.includes('yogurt') || lower.includes('dahi')) {
            calories = 100; protein = 6; carbs = 12; fat = 4; fiber = 0; healthScore = 8;
        } else if (lower.includes('rice')) {
            calories = 300; protein = 6; carbs = 65; fat = 1; fiber = 1; healthScore = 6;
        } else if (lower.includes('salad')) {
            calories = 150; protein = 5; carbs = 20; fat = 5; fiber = 6; healthScore = 9;
        } else if (lower.includes('burger') || lower.includes('pizza')) {
            calories = 700; protein = 30; carbs = 60; fat = 35; fiber = 3; healthScore = 4;
        } else if (lower.includes('chicken') || lower.includes('fish')) {
            calories = 350; protein = 40; carbs = 20; fat = 12; fiber = 2; healthScore = 8;
        } else if (lower.includes('pasta')) {
            calories = 550; protein = 20; carbs = 80; fat = 15; fiber = 4; healthScore = 6;
        } else if (lower.includes('fruit') || lower.includes('smoothie')) {
            calories = 150; protein = 5; carbs = 35; fat = 2; fiber = 5; healthScore = 9;
        } else if (lower.includes('egg')) {
            calories = 150; protein = 13; carbs = 2; fat = 10; fiber = 0; healthScore = 8;
        } else if (lower.includes('sandwich')) {
            calories = 350; protein = 15; carbs = 45; fat = 12; fiber = 4; healthScore = 7;
        }

        return { calories, protein, carbs, fat, fiber, healthScore, servingSize: '1 serving' };
    }

    checkGoalsAchievement() {
        const today = new Date().toDateString();
        const todayMeals = this.meals.filter(m => 
            new Date(m.timestamp).toDateString() === today
        );

        const totalCalories = todayMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
        const totalProtein = todayMeals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0);
        const target = this.goals?.calorieTarget || 2000;

        // Check protein goal
        if (totalProtein >= 50) {
            this.gamification.data.achievements.proteinGoalsMet++;
            this.gamification.addPoints(CONFIG.POINTS.MEET_PROTEIN_GOAL, 'Protein goal met! 💪');
        }

        // Check calorie goal
        if (totalCalories <= target && totalCalories >= target * 0.8) {
            this.gamification.data.achievements.calorieGoalsMet++;
            this.gamification.addPoints(CONFIG.POINTS.STAY_WITHIN_CALORIES, 'Calorie goal achieved! 🎯');
        }

        this.gamification.save();
        this.gamification.checkAchievements();
    }

    updateInsights() {
        const today = new Date().toDateString();
        const todayMeals = this.meals.filter(m => 
            new Date(m.timestamp).toDateString() === today
        );

        const totalCalories = todayMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
        const totalProtein = todayMeals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0);
        const totalFiber = todayMeals.reduce((sum, m) => sum + (m.nutrition?.fiber || 0), 0);
        const avgHealthScore = todayMeals.length > 0 
            ? (todayMeals.reduce((sum, m) => sum + (m.nutrition?.healthScore || 6), 0) / todayMeals.length).toFixed(1)
            : 0;
        const mealCount = todayMeals.length;

        const target = this.goals?.calorieTarget || 2000;
        const remaining = target - totalCalories;

        const html = `
            <div class="insight-card">
                <div class="insight-value">${totalCalories}</div>
                <div class="insight-label">Calories Today</div>
            </div>
            <div class="insight-card">
                <div class="insight-value">${remaining > 0 ? remaining : 0}</div>
                <div class="insight-label">Remaining</div>
            </div>
            <div class="insight-card">
                <div class="insight-value">${totalProtein}g</div>
                <div class="insight-label">Protein</div>
            </div>
            <div class="insight-card">
                <div class="insight-value">${totalFiber}g</div>
                <div class="insight-label">Fiber</div>
            </div>
            <div class="insight-card">
                <div class="insight-value">${avgHealthScore}/10</div>
                <div class="insight-label">Health Score</div>
            </div>
            <div class="insight-card">
                <div class="insight-value">${mealCount}</div>
                <div class="insight-label">Meals Logged</div>
            </div>
        `;

        document.getElementById('insightsDisplay').innerHTML = html;
    }

    async updateRecommendations() {
        const today = new Date().toDateString();
        const todayMeals = this.meals.filter(m => 
            new Date(m.timestamp).toDateString() === today
        );

        const totalCalories = todayMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
        const totalProtein = todayMeals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0);

        const currentStats = {
            calories: totalCalories,
            protein: totalProtein,
            meals: todayMeals.length
        };

        // Try to get AI recommendations
        let recommendations = await this.geminiAI.getSmartRecommendations(
            todayMeals,
            this.goals,
            currentStats
        );

        // Fallback to local recommendations if AI fails
        if (!recommendations || recommendations.length === 0) {
            recommendations = this.generateLocalRecommendations(todayMeals, currentStats);
        }

        const html = recommendations.map(rec => `
            <div class="recommendation-item priority-${rec.priority || 'medium'}">
                <strong>${rec.title}</strong>
                <p>${rec.message}</p>
            </div>
        `).join('');

        document.getElementById('recommendationsDisplay').innerHTML = html || 
            '<p>Log more meals to get personalized recommendations!</p>';
    }

    generateLocalRecommendations(todayMeals, currentStats) {
        const recs = [];
        const currentHour = new Date().getHours();
        const target = this.goals?.calorieTarget || 2000;

        if (todayMeals.length === 0) {
            if (currentHour < 10) {
                recs.push({
                    title: '🌅 Start Your Day Right',
                    message: 'Log your breakfast to track your nutrition and get personalized insights!',
                    priority: 'high'
                });
            } else {
                recs.push({
                    title: '📊 Track Your Meals',
                    message: 'Start logging your meals to get AI-powered recommendations!',
                    priority: 'high'
                });
            }
        }

        if (currentStats.calories > target * 0.8 && todayMeals.length < 3) {
            recs.push({
                title: '⚠️ Calorie Alert',
                message: 'You\'re approaching your daily limit. Consider lighter options like salads or grilled proteins.',
                priority: 'high'
            });
        }

        if (currentStats.protein < 50 && todayMeals.length >= 2) {
            const proteinSuggestions = this.goals?.preferences?.includes('vegetarian') 
                ? 'paneer, dal, chickpeas, or tofu'
                : 'chicken, fish, eggs, or legumes';
            recs.push({
                title: '💪 Protein Boost',
                message: `Try adding ${proteinSuggestions} to your next meal.`,
                priority: 'medium'
            });
        }

        if (currentHour >= 12 && todayMeals.length >= 1) {
            recs.push({
                title: '💧 Stay Hydrated',
                message: 'Don\'t forget to drink water throughout the day. Aim for 8 glasses!',
                priority: 'low'
            });
        }

        return recs;
    }

    updateMealHistory() {
        const recentMeals = this.meals.slice(0, 10);
        const html = recentMeals.map(meal => {
            const date = new Date(meal.timestamp);
            const timeStr = date.toLocaleString();
            const healthScore = meal.nutrition?.healthScore || 6;
            const healthEmoji = healthScore >= 8 ? '🟢' : healthScore >= 6 ? '🟡' : '🔴';
            
            return `
                <div class="meal-item">
                    <div class="meal-header">
                        <strong>${meal.description}</strong>
                        <span class="health-indicator" title="Health Score: ${healthScore}/10">${healthEmoji}</span>
                    </div>
                    <div class="meal-time">${timeStr} • ${meal.nutrition?.calories || 0} cal • ${meal.nutrition?.protein || 0}g protein</div>
                </div>
            `;
        }).join('');

        document.getElementById('mealHistory').innerHTML = html || 
            '<p>No meals logged yet. Start tracking your food!</p>';
    }

    updateGamificationPanel() {
        const level = this.gamification.getCurrentLevel();
        const nextLevel = this.gamification.getNextLevel();
        const progress = this.gamification.getProgressToNextLevel();

        document.getElementById('levelNumber').textContent = level.level;
        document.getElementById('levelName').textContent = level.name;
        document.getElementById('levelPoints').textContent = `${this.gamification.data.points} pts`;
        document.getElementById('levelProgress').style.width = `${progress}%`;
        
        if (nextLevel) {
            const pointsNeeded = nextLevel.pointsRequired - this.gamification.data.points;
            document.getElementById('progressLabel').textContent = 
                `${pointsNeeded} pts to ${nextLevel.name}`;
        } else {
            document.getElementById('progressLabel').textContent = 'Max Level!';
        }

        document.getElementById('streakNumber').textContent = this.gamification.data.streak;

        // Update badges preview
        const recentBadges = this.gamification.data.badges.slice(-3);
        const badgesHTML = recentBadges.length > 0 
            ? recentBadges.map(badgeId => {
                const badge = Object.values(CONFIG.BADGES).find(b => b.id === badgeId);
                return badge ? `
                    <div class="badge-item">
                        <span class="badge-icon-small">${badge.icon}</span>
                        <span>${badge.name}</span>
                    </div>
                ` : '';
            }).join('')
            : '<div class="no-badges">Complete challenges to earn badges!</div>';
        
        document.getElementById('badgesList').innerHTML = badgesHTML;
    }

    updateAchievementsTab() {
        document.getElementById('totalBadges').textContent = this.gamification.data.badges.length;
        document.getElementById('totalPoints').textContent = this.gamification.data.points;
        document.getElementById('currentLevel').textContent = this.gamification.getCurrentLevel().level;

        const allBadgesHTML = Object.values(CONFIG.BADGES).map(badge => {
            const unlocked = this.gamification.data.badges.includes(badge.id);
            return `
                <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon-large">${badge.icon}</div>
                    <div class="badge-card-name">${badge.name}</div>
                    <div class="badge-card-desc">${badge.description}</div>
                    ${unlocked ? '<div class="badge-status">✓ Unlocked</div>' : '<div class="badge-status">🔒 Locked</div>'}
                </div>
            `;
        }).join('');

        document.getElementById('allBadges').innerHTML = allBadgesHTML;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        event.target.closest('.tab').classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // Update content based on tab
        if (tabName === 'dashboard') {
            this.dashboard.update(this.meals, this.goals);
        } else if (tabName === 'history') {
            this.filterHistory('all');
        }
    }

    filterHistory(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        let filteredMeals = this.meals;
        const now = new Date();

        if (filter === 'today') {
            filteredMeals = this.meals.filter(m => 
                new Date(m.timestamp).toDateString() === now.toDateString()
            );
        } else if (filter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredMeals = this.meals.filter(m => 
                new Date(m.timestamp) >= weekAgo
            );
        } else if (filter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredMeals = this.meals.filter(m => 
                new Date(m.timestamp) >= monthAgo
            );
        }

        const html = filteredMeals.map(meal => {
            const date = new Date(meal.timestamp);
            const healthScore = meal.nutrition?.healthScore || 6;
            const healthEmoji = healthScore >= 8 ? '🟢' : healthScore >= 6 ? '🟡' : '🔴';
            
            return `
                <div class="meal-item">
                    <div class="meal-header">
                        <strong>${meal.description}</strong>
                        <span class="health-indicator">${healthEmoji}</span>
                    </div>
                    <div class="meal-time">${date.toLocaleString()}</div>
                    <div class="meal-nutrition">
                        ${meal.nutrition?.calories || 0} cal • 
                        ${meal.nutrition?.protein || 0}g protein • 
                        ${meal.nutrition?.carbs || 0}g carbs • 
                        ${meal.nutrition?.fat || 0}g fat
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('historyContent').innerHTML = html || 
            '<p class="no-data">No meals found for this period.</p>';
    }

    showGoalModal() {
        document.getElementById('goalModal').style.display = 'block';
        if (this.goals) {
            document.getElementById('primaryGoal').value = this.goals.primaryGoal;
            document.getElementById('calorieTarget').value = this.goals.calorieTarget;
            
            // Set checkboxes
            document.querySelectorAll('.checkbox-group input').forEach(cb => {
                cb.checked = this.goals.preferences?.includes(cb.value);
            });
        }
    }

    closeGoalModal() {
        document.getElementById('goalModal').style.display = 'none';
    }

    saveGoals() {
        const preferences = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
            .map(cb => cb.value);

        this.goals = {
            primaryGoal: document.getElementById('primaryGoal').value,
            calorieTarget: parseInt(document.getElementById('calorieTarget').value) || 2000,
            preferences: preferences
        };

        localStorage.setItem('goals', JSON.stringify(this.goals));
        this.closeGoalModal();
        this.updateGoalDisplay();
        this.updateInsights();
        this.updateRecommendations();
    }

    updateGoalDisplay() {
        const display = document.getElementById('goalDisplay');
        if (!this.goals) {
            display.innerHTML = '<p>No goals set yet. Click below to get started!</p>';
            return;
        }

        const goalLabels = {
            weight_loss: 'Weight Loss',
            muscle_gain: 'Muscle Gain',
            maintain: 'Maintain Health',
            energy: 'Increase Energy'
        };

        display.innerHTML = `
            <strong>Goal:</strong> ${goalLabels[this.goals.primaryGoal]}<br>
            <strong>Daily Target:</strong> ${this.goals.calorieTarget} calories<br>
            ${this.goals.preferences.length > 0 ? 
                `<strong>Preferences:</strong> ${this.goals.preferences.join(', ')}` : ''}
        `;
    }

    showLoading(message) {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('.loading-text');
        text.textContent = message;
        overlay.style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// Initialize the enhanced app
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new NutriSmartEnhanced();
});
