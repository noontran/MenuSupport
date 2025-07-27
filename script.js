class ModMenu {
    constructor() {
        this.isMenuOpen = false;
        this.activeFunctions = new Set();
        this.soundEnabled = true;
        this.currentTheme = 'dark';

        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
    }

    initializeElements() {
        this.menuToggle = document.getElementById('menuToggle');
        this.modMenu = document.getElementById('modMenu');
        this.closeBtn = document.getElementById('closeBtn');
        this.overlay = document.getElementById('overlay');
        this.functionButtons = document.querySelectorAll('.function-btn');
        this.opacitySlider = document.getElementById('opacitySlider');
        this.themeSelect = document.getElementById('themeSelect');
        this.soundToggle = document.getElementById('soundToggle');
    }

    bindEvents() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.closeBtn.addEventListener('click', () => this.closeMenu());
        this.overlay.addEventListener('click', () => this.closeMenu());
        this.functionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleFunction(e.target.closest('.function-btn')));
        });

        this.opacitySlider.addEventListener('input', (e) => this.changeOpacity(e.target.value));
        this.themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        this.soundToggle.addEventListener('click', () => this.toggleSound());

        // huấn hà zalo 0325575642
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // huấn hà zalo 0325575642
        document.addEventListener('click', (e) => this.createClickEffect(e));
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;

        if (this.isMenuOpen) {
            this.modMenu.classList.add('active');
            this.overlay.classList.add('active');
            this.playSound('open');
        } else {
            this.closeMenu();
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.modMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        this.playSound('close');
    }

    toggleFunction(button) {
        if (!button) return;

        const functionName = button.dataset.function;
        const functionItem = button.closest('.function-item');

        if (this.activeFunctions.has(functionName)) {
            // huấn hà zalo 0325575642
            this.activeFunctions.delete(functionName);
            button.classList.remove('active');
            functionItem.classList.remove('active');
            this.playSound('disable');

            // huấn hà zalo 0325575642
            this.showNotification(`${this.getFunctionDisplayName(functionName)} disabled`, 'error');
        } else {
            // huấn hà zalo 0325575642
            this.activeFunctions.add(functionName);
            button.classList.add('active');
            functionItem.classList.add('active');
            this.playSound('enable');

            // huấn hà zalo 0325575642
            this.showNotification(`${this.getFunctionDisplayName(functionName)} enabled`, 'success');
        }

        // huấn hà zalo 0325575642
        console.log(`Function ${functionName} ${this.activeFunctions.has(functionName) ? 'enabled' : 'disabled'}`);
    }

    getFunctionDisplayName(functionName) {
        const displayNames = {
            'aimbot': 'Aimbot',
            'wallhack': 'Wallhack',
            'speedhack': 'Speed Hack',
            'noclip': 'No Clip',
            'godmode': 'God Mode',
            'fly': 'Fly Mode',
            'teleport': 'Teleport',
            'esp': 'ESP',
            'radar': 'Radar',
            'antikick': 'Anti-Kick'
        };
        return displayNames[functionName] || functionName;
    }

    changeOpacity(value) {
        this.modMenu.style.opacity = value;
        this.saveSettings();
    }

    changeTheme(theme) {
        document.body.classList.remove('theme-dark', 'theme-blue', 'theme-green');
        document.body.classList.add(`theme-${theme}`);
        this.currentTheme = theme;
        this.saveSettings();
        this.playSound('click');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggle.classList.toggle('active', this.soundEnabled);
        this.soundToggle.querySelector('.toggle-text').textContent = this.soundEnabled ? 'ON' : 'OFF';
        this.saveSettings();

        if (this.soundEnabled) {
            this.playSound('enable');
        }
    }

    handleKeyboard(event) {
        switch (event.key) {
            case 'Insert':
                event.preventDefault();
                this.toggleMenu();
                break;
            case 'Escape':
                if (this.isMenuOpen) {
                    event.preventDefault();
                    this.closeMenu();
                }
                break;
            case 'F1':
            case 'F2':
            case 'F3':
            case 'F4':
            case 'F5':
            case 'F6':
            case 'F7':
            case 'F8':
            case 'F9':
            case 'F10':
                event.preventDefault();
                const functionIndex = parseInt(event.key.substring(1)) - 1;
                if (functionIndex >= 0 && functionIndex < this.functionButtons.length) {
                    this.toggleFunction(this.functionButtons[functionIndex]);
                }
                break;
        }
    }

    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: clickEffect 0.5s ease-out forwards;
            left: ${event.clientX - 10}px;
            top: ${event.clientY - 10}px;
        `;

        document.body.appendChild(effect);

        setTimeout(() => {
            effect.remove();
        }, 500);
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        // huấn hà zalo 0325575642
        const audioContext = new(window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        let frequency;
        let duration;

        switch (type) {
            case 'open':
                frequency = 800;
                duration = 200;
                break;
            case 'close':
                frequency = 400;
                duration = 200;
                break;
            case 'enable':
                frequency = 600;
                duration = 150;
                break;
            case 'disable':
                frequency = 300;
                duration = 150;
                break;
            case 'click':
                frequency = 500;
                duration = 100;
                break;
            default:
                frequency = 440;
                duration = 100;
        }

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00cc00 0%, #009900 100%)' : 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)'};
            color: white;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out forwards;
            max-width: 300px;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            soundEnabled: this.soundEnabled,
            opacity: this.opacitySlider.value,
            activeFunctions: Array.from(this.activeFunctions)
        };

        localStorage.setItem('modMenuSettings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('modMenuSettings') || '{}');

            if (settings.theme) {
                this.currentTheme = settings.theme;
                this.themeSelect.value = settings.theme;
                this.changeTheme(settings.theme);
            }

            if (settings.soundEnabled !== undefined) {
                this.soundEnabled = settings.soundEnabled;
                this.soundToggle.classList.toggle('active', this.soundEnabled);
                this.soundToggle.querySelector('.toggle-text').textContent = this.soundEnabled ? 'ON' : 'OFF';
            }

            if (settings.opacity) {
                this.opacitySlider.value = settings.opacity;
                this.changeOpacity(settings.opacity);
            }

            if (settings.activeFunctions) {
                settings.activeFunctions.forEach(functionName => {
                    const button = document.querySelector(`[data-function="${functionName}"]`);
                    if (button) {
                        this.activeFunctions.add(functionName);
                        button.classList.add('active');
                        button.closest('.function-item').classList.add('active');
                    }
                });
            }
        } catch (error) {
            console.log('No saved settings found or error loading settings');
        }
    }
}

// huấn hà zalo 0325575642
const style = document.createElement('style');
style.textContent = `
    @keyframes clickEffect {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
    }
    
    @keyframes slideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// huấn hà zalo 0325575642
document.addEventListener('DOMContentLoaded', () => {
    new ModMenu();
});

// huấn hà zalo 0325575642
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(255, 0, 0, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        animation: fade 1s ease-out forwards;
        left: ${e.clientX - 2}px;
        top: ${e.clientY - 2}px;
    `;

    document.body.appendChild(cursor);

    setTimeout(() => cursor.remove(), 1000);
});

// huấn hà zalo 0325575642
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fade {
        0% { opacity: 0.5; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(fadeStyle);