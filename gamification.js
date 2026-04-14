// Gamification Module

class Gamification {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('gamification')) || {
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
                earlyBreakfasts: 0,
                balancedDays: 0
            }
        };
    }

    addPoints(points, reason) {
        this.data.points += points;
        this.checkLevelUp();
        this.save();
        this.showPointsNotification(points, reason);
    }

    checkLevelUp() {
        const currentLevel = this.getCurrentLevel();
        if (currentLevel.level > this.data.level) {
            this.data.level = currentLevel.level;
            this.showLevelUpNotification(currentLevel);
        }
    }

    getCurrentLevel() {
        for (let i = CONFIG.LEVELS.length - 1; i >= 0; i--) {
            if (this.data.points >= CONFIG.LEVELS[i].pointsRequired) {
                return CONFIG.LEVELS[i];
            }
        }
        return CONFIG.LEVELS[0];
    }

    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const nextLevelIndex = CONFIG.LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
        return nextLevelIndex < CONFIG.LEVELS.length ? CONFIG.LEVELS[nextLevelIndex] : null;
    }

    unlockBadge(badgeId) {
        if (!this.data.badges.includes(badgeId)) {
            this.data.badges.push(badgeId);
            this.save();
            this.showBadgeNotification(CONFIG.BADGES[badgeId]);
            return true;
        }
        return false;
    }

    checkAchievements() {
        const achievements = this.data.achievements;
        
        // First meal badge
        if (achievements.mealsLogged === 1) {
            this.unlockBadge('FIRST_MEAL');
        }
        
        // Protein champion
        if (achievements.proteinGoalsMet >= 10) {
            this.unlockBadge('PROTEIN_CHAMP');
        }
        
        // Veggie lover
        if (achievements.vegetablesLogged >= 20) {
            this.unlockBadge('VEGGIE_LOVER');
        }
        
        // Calorie master
        if (achievements.calorieGoalsMet >= 15) {
            this.unlockBadge('CALORIE_MASTER');
        }
        
        // Early bird
        if (achievements.earlyBreakfasts >= 10) {
            this.unlockBadge('EARLY_BIRD');
        }
        
        // Balanced diet
        if (achievements.balancedDays >= 7) {
            this.unlockBadge('BALANCED_DIET');
        }
        
        // Streak badges
        if (this.data.streak >= 3) {
            this.unlockBadge('STREAK_3');
        }
        if (this.data.streak >= 7) {
            this.unlockBadge('STREAK_7');
        }
        if (this.data.streak >= 30) {
            this.unlockBadge('STREAK_30');
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastLog = this.data.lastLogDate;
        
        if (!lastLog) {
            this.data.streak = 1;
        } else {
            const lastDate = new Date(lastLog);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate.toDateString() === yesterday.toDateString()) {
                this.data.streak++;
                this.addPoints(CONFIG.POINTS.DAILY_STREAK, `${this.data.streak}-day streak! 🔥`);
            } else if (lastDate.toDateString() !== today) {
                this.data.streak = 1;
            }
        }
        
        this.data.lastLogDate = today;
        this.save();
        this.checkAchievements();
    }

    showPointsNotification(points, reason) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-badge">+${points} pts</div>
            <div class="points-reason">${reason}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-info">
                <div class="badge-title">Badge Unlocked!</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.description}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'levelup-notification';
        notification.innerHTML = `
            <div class="levelup-icon">🎉</div>
            <div class="levelup-info">
                <div class="levelup-title">Level Up!</div>
                <div class="levelup-level">Level ${level.level}: ${level.name}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    save() {
        localStorage.setItem('gamification', JSON.stringify(this.data));
    }

    getProgressToNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        
        if (!nextLevel) return 100;
        
        const currentPoints = this.data.points - currentLevel.pointsRequired;
        const pointsNeeded = nextLevel.pointsRequired - currentLevel.pointsRequired;
        
        return Math.min(100, (currentPoints / pointsNeeded) * 100);
    }
}
