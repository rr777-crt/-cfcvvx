class GameSave {
    constructor() {
        this.saveKey = 'gameSaveData';
    }

    saveGame(data) {
        localStorage.setItem(this.saveKey, JSON.stringify(data));
    }

    loadGame() {
        const data = localStorage.getItem(this.saveKey);
        return data ? JSON.parse(data) : null;
    }

    resetGame() {
        localStorage.removeItem(this.saveKey);
        location.reload();
    }
}

const gameSave = new GameSave();

// Добавляем кнопку сброса в HTML
const resetBtn = document.createElement('button');
resetBtn.id = 'resetBtn';
resetBtn.textContent = 'Сбросить прогресс';
document.querySelector('.game-container').appendChild(resetBtn);

resetBtn.addEventListener('click', () => {
    if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
        gameSave.resetGame();
    }
});
class GameSave {
    loadGame() {
        try {
            const data = localStorage.getItem(this.saveKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Ошибка загрузки:", e);
            return null;
        }
    }
    // ... остальные методы
}
