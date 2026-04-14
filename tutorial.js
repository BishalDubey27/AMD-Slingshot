// Interactive Tutorial System

class Tutorial {
    constructor() {
        this.steps = CONFIG.TUTORIAL_STEPS;
        this.currentStep = 0;
        this.overlay = null;
        this.tooltip = null;
    }

    start() {
        this.createOverlay();
        this.showStep(0);
    }

    createOverlay() {
        // Create dark overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.innerHTML = `
            <div class="tutorial-spotlight"></div>
        `;
        document.body.appendChild(this.overlay);

        // Create tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        document.body.appendChild(this.tooltip);
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            this.complete();
            return;
        }

        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        const target = document.querySelector(step.target);

        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.next();
            return;
        }

        // Highlight target element
        this.highlightElement(target);

        // Position and show tooltip
        this.showTooltip(target, step, stepIndex);
    }

    highlightElement(element) {
        const rect = element.getBoundingClientRect();
        const spotlight = this.overlay.querySelector('.tutorial-spotlight');
        
        spotlight.style.top = `${rect.top - 10}px`;
        spotlight.style.left = `${rect.left - 10}px`;
        spotlight.style.width = `${rect.width + 20}px`;
        spotlight.style.height = `${rect.height + 20}px`;
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showTooltip(target, step, stepIndex) {
        const rect = target.getBoundingClientRect();
        const isLastStep = stepIndex === this.steps.length - 1;
        
        this.tooltip.innerHTML = `
            <div class="tutorial-header">
                <h3>${step.title}</h3>
                <button class="tutorial-close" onclick="tutorial.skip()">×</button>
            </div>
            <div class="tutorial-content">
                <p>${step.content}</p>
            </div>
            <div class="tutorial-footer">
                <div class="tutorial-progress">
                    ${stepIndex + 1} / ${this.steps.length}
                </div>
                <div class="tutorial-buttons">
                    ${stepIndex > 0 ? '<button class="btn-tutorial" onclick="tutorial.prev()">Previous</button>' : ''}
                    ${!isLastStep ? '<button class="btn-tutorial btn-primary" onclick="tutorial.next()">Next</button>' : ''}
                    ${isLastStep ? '<button class="btn-tutorial btn-primary" onclick="tutorial.complete()">Get Started!</button>' : ''}
                </div>
            </div>
        `;

        // Position tooltip
        this.positionTooltip(rect, step.position);
        
        // Show with animation
        setTimeout(() => {
            this.tooltip.classList.add('show');
        }, 100);
    }

    positionTooltip(targetRect, position) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const padding = 20;
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - padding;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + padding;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - padding;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + padding;
                break;
            default:
                top = targetRect.bottom + padding;
                left = targetRect.left;
        }
        
        // Keep tooltip within viewport
        top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
        
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    next() {
        this.tooltip.classList.remove('show');
        setTimeout(() => {
            this.showStep(this.currentStep + 1);
        }, 300);
    }

    prev() {
        this.tooltip.classList.remove('show');
        setTimeout(() => {
            this.showStep(this.currentStep - 1);
        }, 300);
    }

    skip() {
        if (confirm('Are you sure you want to skip the tutorial? You can always restart it from settings.')) {
            this.complete();
        }
    }

    complete() {
        this.tooltip.classList.remove('show');
        this.overlay.classList.add('fade-out');
        
        setTimeout(() => {
            this.overlay?.remove();
            this.tooltip?.remove();
            localStorage.setItem('tutorialCompleted', 'true');
        }, 300);
    }

    restart() {
        localStorage.removeItem('tutorialCompleted');
        this.currentStep = 0;
        this.start();
    }
}

// Global tutorial instance
let tutorial;
