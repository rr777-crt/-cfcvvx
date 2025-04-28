// Игровые переменные
const gameState = {
    money: 0,
    inventory: [],
    resources: {
        wood: 0,
        stone: 0,
        iron: 0,
        diamond: 0,
        fishingOre: 0,
        lightDust: 0,
        darkDust: 0
    },
    upgrades: {
        fishingSpeed: 10,
        sellSpeed: 5,
        inventorySize: 5,
        houses: 0
    },
    activeBait: null,
    currentQuest: null
};

// Инициализация игры
function initGame() {
    // Настройка обработчиков событий
    document.getElementById('fish-button').addEventListener('click', startFishing);
    document.getElementById('build-house-button').addEventListener('click', buildHouse);
    
    // Запуск пассивного дохода
    setInterval(() => {
        gameState.money += gameState.upgrades.houses;
        updateUI();
    }, 3000);
    
    // Первый квест через 10 секунд
    setTimeout(giveNewQuest, 10000);
}

// Обновление интерфейса
function updateUI() {
    // Обновляем все счетчики
    document.getElementById('money').textContent = gameState.money;
    document.getElementById('fishingore-count').textContent = gameState.resources.fishingOre;
    
    // Обновляем кнопки
    document.getElementById('build-house-button').disabled = 
        gameState.resources.wood < 25 || gameState.resources.stone < 10;
}

// Система квестов
const quests = [
    {
        type: 'catch',
        target: 'Рыба',
        amount: 5,
        reward: 10,
        description: 'Поймать 5 рыб'
    },
    // Другие квесты
];

function giveNewQuest() {
    const randomQuest = quests[Math.floor(Math.random() * quests.length)];
    gameState.currentQuest = {...randomQuest, progress: 0};
    showQuest(gameState.currentQuest);
}

function showQuest(quest) {
    document.getElementById('quest-text').textContent = quest.description;
    document.getElementById('quest-progress').textContent = `Прогресс: ${quest.progress}/${quest.amount}`;
    document.getElementById('quest-reward').textContent = `Награда: $${quest.reward}`;
}

// Запуск игры
initGame();
updateUI();
