// Enhanced Dashboard with Charts

class Dashboard {
    constructor(meals, goals) {
        this.meals = meals;
        this.goals = goals;
    }

    update(meals, goals) {
        this.meals = meals;
        this.goals = goals;
        this.render();
    }

    render() {
        const dashboardHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>📊 Weekly Overview</h3>
                    <div id="weeklyChart" class="chart-container"></div>
                </div>
                
                <div class="dashboard-card">
                    <h3>🎯 Macro Balance</h3>
                    <div id="macroChart" class="chart-container"></div>
                </div>
                
                <div class="dashboard-card">
                    <h3>📈 Progress Trends</h3>
                    <div id="trendChart" class="chart-container"></div>
                </div>
                
                <div class="dashboard-card">
                    <h3>🏆 Achievements</h3>
                    <div id="achievementsDisplay" class="achievements-grid"></div>
                </div>
            </div>
        `;
        
        const dashboardElement = document.getElementById('dashboardContent');
        if (dashboardElement) {
            dashboardElement.innerHTML = dashboardHTML;
            this.renderCharts();
        }
    }

    renderCharts() {
        this.renderWeeklyChart();
        this.renderMacroChart();
        this.renderTrendChart();
    }

    renderWeeklyChart() {
        const weekData = this.getWeeklyData();
        const container = document.getElementById('weeklyChart');
        
        if (!container) return;
        
        const maxCalories = Math.max(...weekData.map(d => d.calories), this.goals?.calorieTarget || 2000);
        
        container.innerHTML = `
            <div class="bar-chart">
                ${weekData.map(day => `
                    <div class="bar-group">
                        <div class="bar-container">
                            <div class="bar" style="height: ${(day.calories / maxCalories) * 100}%">
                                <span class="bar-value">${day.calories}</span>
                            </div>
                            ${this.goals?.calorieTarget ? `
                                <div class="bar-target" style="bottom: ${(this.goals.calorieTarget / maxCalories) * 100}%"></div>
                            ` : ''}
                        </div>
                        <div class="bar-label">${day.day}</div>
                    </div>
                `).join('')}
            </div>
            <div class="chart-legend">
                <span class="legend-item"><span class="legend-color" style="background: var(--primary-gradient)"></span> Calories</span>
                ${this.goals?.calorieTarget ? '<span class="legend-item"><span class="legend-line"></span> Target</span>' : ''}
            </div>
        `;
    }

    renderMacroChart() {
        const macros = this.getTodayMacros();
        const container = document.getElementById('macroChart');
        
        if (!container) return;
        
        const total = macros.protein + macros.carbs + macros.fat;
        const proteinPercent = total > 0 ? (macros.protein * 4 / (total * 4)) * 100 : 33;
        const carbsPercent = total > 0 ? (macros.carbs * 4 / (total * 4)) * 100 : 33;
        const fatPercent = total > 0 ? (macros.fat * 9 / (total * 4 + macros.fat * 5)) * 100 : 33;
        
        container.innerHTML = `
            <div class="pie-chart">
                <svg viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e74c3c" stroke-width="40"
                        stroke-dasharray="${proteinPercent * 5.03} 503"
                        transform="rotate(-90 100 100)"/>
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#3498db" stroke-width="40"
                        stroke-dasharray="${carbsPercent * 5.03} 503"
                        stroke-dashoffset="${-proteinPercent * 5.03}"
                        transform="rotate(-90 100 100)"/>
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#f39c12" stroke-width="40"
                        stroke-dasharray="${fatPercent * 5.03} 503"
                        stroke-dashoffset="${-(proteinPercent + carbsPercent) * 5.03}"
                        transform="rotate(-90 100 100)"/>
                </svg>
                <div class="pie-center">
                    <div class="pie-total">${total}g</div>
                    <div class="pie-label">Total</div>
                </div>
            </div>
            <div class="macro-stats">
                <div class="macro-item">
                    <span class="macro-color" style="background: #e74c3c"></span>
                    <span class="macro-name">Protein</span>
                    <span class="macro-value">${macros.protein}g</span>
                </div>
                <div class="macro-item">
                    <span class="macro-color" style="background: #3498db"></span>
                    <span class="macro-name">Carbs</span>
                    <span class="macro-value">${macros.carbs}g</span>
                </div>
                <div class="macro-item">
                    <span class="macro-color" style="background: #f39c12"></span>
                    <span class="macro-name">Fat</span>
                    <span class="macro-value">${macros.fat}g</span>
                </div>
            </div>
        `;
    }

    renderTrendChart() {
        const trendData = this.getTrendData();
        const container = document.getElementById('trendChart');
        
        if (!container || trendData.length === 0) {
            if (container) {
                container.innerHTML = '<p class="no-data">Log meals for 7 days to see trends</p>';
            }
            return;
        }
        
        const maxValue = Math.max(...trendData.map(d => d.value));
        const points = trendData.map((d, i) => {
            const x = (i / (trendData.length - 1)) * 280 + 10;
            const y = 150 - (d.value / maxValue) * 120;
            return `${x},${y}`;
        }).join(' ');
        
        container.innerHTML = `
            <svg class="line-chart" viewBox="0 0 300 160">
                <polyline points="${points}" fill="none" stroke="url(#lineGradient)" stroke-width="3"/>
                ${trendData.map((d, i) => {
                    const x = (i / (trendData.length - 1)) * 280 + 10;
                    const y = 150 - (d.value / maxValue) * 120;
                    return `<circle cx="${x}" cy="${y}" r="4" fill="#667eea"/>`;
                }).join('')}
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>
            <div class="trend-labels">
                ${trendData.map(d => `<span>${d.label}</span>`).join('')}
            </div>
        `;
    }

    getWeeklyData() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayMeals = this.meals.filter(m => 
                new Date(m.timestamp).toDateString() === dateStr
            );
            
            const calories = dayMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
            
            weekData.push({
                day: days[date.getDay()],
                calories: calories
            });
        }
        
        return weekData;
    }

    getTodayMacros() {
        const today = new Date().toDateString();
        const todayMeals = this.meals.filter(m => 
            new Date(m.timestamp).toDateString() === today
        );
        
        return {
            protein: todayMeals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0),
            carbs: todayMeals.reduce((sum, m) => sum + (m.nutrition?.carbs || 0), 0),
            fat: todayMeals.reduce((sum, m) => sum + (m.nutrition?.fat || 0), 0)
        };
    }

    getTrendData() {
        const last7Days = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayMeals = this.meals.filter(m => 
                new Date(m.timestamp).toDateString() === dateStr
            );
            
            const calories = dayMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
            
            if (calories > 0) {
                last7Days.push({
                    label: `${date.getDate()}`,
                    value: calories
                });
            }
        }
        
        return last7Days;
    }
}
