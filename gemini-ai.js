// Gemini AI Integration Module

class GeminiAI {
    constructor() {
        this.apiUrl = '/api/generateContent';
    }

    async analyzeNutrition(mealDescription) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze this meal and provide nutrition information: "${mealDescription}". 
                            Return ONLY a JSON object with these exact fields: 
                            {"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "healthScore": number (1-10), "servingSize": "string"}
                            Be accurate for Indian and international foods. Health score should reflect nutritional value (10 being healthiest).`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            throw new Error('No JSON found in response');
        } catch (error) {
            console.error('Gemini AI error:', error);
            return null;
        }
    }

    async getSmartRecommendations(meals, goals, currentStats) {
        try {
            const prompt = `As a nutrition AI assistant, analyze this user's eating pattern and provide 3-4 personalized recommendations.

User Profile:
- Goal: ${goals?.primaryGoal || 'maintain health'}
- Daily Calorie Target: ${goals?.calorieTarget || 2000} calories
- Preferences: ${goals?.preferences?.join(', ') || 'none'}

Today's Meals: ${meals.map(m => m.description).join(', ')}

Current Stats:
- Calories: ${currentStats.calories}/${goals?.calorieTarget || 2000}
- Protein: ${currentStats.protein}g
- Time: ${new Date().getHours()}:00

Provide recommendations in JSON format:
[{"title": "emoji + short title", "message": "actionable advice", "priority": "high/medium/low"}]

Focus on: meal timing, macro balance, hydration, food variety, and goal alignment.`;

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            // Extract JSON array from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            throw new Error('No recommendations found');
        } catch (error) {
            console.error('Gemini recommendations error:', error);
            return null;
        }
    }

    async getMealSuggestions(goals, preferences, timeOfDay) {
        try {
            const prompt = `Suggest 3 healthy meal options for ${timeOfDay} that align with:
- Goal: ${goals?.primaryGoal || 'maintain health'}
- Calorie target: ${goals?.calorieTarget || 2000} daily
- Preferences: ${preferences?.join(', ') || 'none'}

Include Indian and international options. Return JSON:
[{"name": "meal name", "calories": number, "protein": number, "description": "brief description"}]`;

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            return [];
        } catch (error) {
            console.error('Meal suggestions error:', error);
            return [];
        }
    }
}

// Initialize Gemini AI
const geminiAI = new GeminiAI();
