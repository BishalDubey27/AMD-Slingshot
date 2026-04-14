// Configuration file for NutriSmart
const CONFIG = {
    
    // Gamification Settings
    POINTS: {
        LOG_MEAL: 10,
        MEET_PROTEIN_GOAL: 20,
        STAY_WITHIN_CALORIES: 25,
        LOG_VEGETABLES: 15,
        DAILY_STREAK: 30,
        COMPLETE_CHALLENGE: 50
    },
    
    LEVELS: [
        { level: 1, name: 'Beginner', pointsRequired: 0 },
        { level: 2, name: 'Novice', pointsRequired: 100 },
        { level: 3, name: 'Intermediate', pointsRequired: 300 },
        { level: 4, name: 'Advanced', pointsRequired: 600 },
        { level: 5, name: 'Expert', pointsRequired: 1000 },
        { level: 6, name: 'Master', pointsRequired: 1500 },
        { level: 7, name: 'Champion', pointsRequired: 2500 }
    ],
    
    BADGES: {
        FIRST_MEAL: { id: 'first_meal', name: 'First Steps', icon: '🎯', description: 'Log your first meal' },
        STREAK_3: { id: 'streak_3', name: '3-Day Streak', icon: '🔥', description: 'Log meals for 3 days in a row' },
        STREAK_7: { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: 'Log meals for 7 days in a row' },
        STREAK_30: { id: 'streak_30', name: 'Monthly Master', icon: '👑', description: 'Log meals for 30 days in a row' },
        PROTEIN_CHAMP: { id: 'protein_champ', name: 'Protein Champion', icon: '💪', description: 'Meet protein goal 10 times' },
        VEGGIE_LOVER: { id: 'veggie_lover', name: 'Veggie Lover', icon: '🥦', description: 'Log vegetables 20 times' },
        CALORIE_MASTER: { id: 'calorie_master', name: 'Calorie Master', icon: '🎯', description: 'Stay within calorie goal 15 times' },
        EARLY_BIRD: { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Log breakfast before 9 AM, 10 times' },
        BALANCED_DIET: { id: 'balanced_diet', name: 'Balanced Diet', icon: '⚖️', description: 'Maintain balanced macros for 7 days' }
    },
    
    // Tutorial Settings
    TUTORIAL_STEPS: [
        {
            target: '#goalSection',
            title: 'Welcome to NutriSmart! 🥗',
            content: 'Let\'s start by setting your health goals. This helps us personalize your experience.',
            position: 'bottom'
        },
        {
            target: '#mealInput',
            title: 'Log Your Meals 📝',
            content: 'Simply type what you ate in natural language. Try "chicken biryani" or "2 idlis with sambar".',
            position: 'bottom'
        },
        {
            target: '#insightsDisplay',
            title: 'Track Your Progress 📊',
            content: 'See real-time insights about your nutrition, calories, and protein intake.',
            position: 'top'
        },
        {
            target: '#recommendationsDisplay',
            title: 'Get Smart Recommendations 🤖',
            content: 'Our AI analyzes your eating patterns and provides personalized suggestions.',
            position: 'top'
        },
        {
            target: '#gamificationPanel',
            title: 'Earn Rewards! 🏆',
            content: 'Complete challenges, earn badges, and level up as you build healthy habits.',
            position: 'left'
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
