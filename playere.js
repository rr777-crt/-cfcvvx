class Player {
    constructor() {
        this.name = localStorage.getItem('playerName') || 'Игрок';
        this.stepsRecord = localStorage.getItem('stepsRecord') || 0;
        this.loadPlayerData();
    }

    savePlayerName(name) {
        this.name = name;
        localStorage.setItem('playerName', name);
    }

    checkStepsRecord(steps) {
        if (steps > this.stepsRecord) {
            this.stepsRecord = steps;
            localStorage.setItem('stepsRecord', steps);
            return true;
        }
        return false;
    }

    loadPlayerData() {
        document.getElementById('playerName').value = this.name;
        this.updateBestPlayerDisplay();
    }

    updateBestPlayerDisplay() {
        document.getElementById('bestPlayer').textContent = 
            `Лучший игрок: ${this.name} (${this.stepsRecord} шагов)`;
    }
}

// Инициализация игрока
const player = new Player();

// Сохранение имени
document.getElementById('saveNameBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    if (name) {
        player.savePlayerName(name);
        alert('Ник сохранен!');
    }
});
