const Game = {
    // Основные параметры
    money: 100,
    luck: 0,
    inventorySize: 10,
    houses: 0,

    // Ресурсы
    resources: {
        wood: 0,
        stone: 0,
        fishingOre: 0,
        lightDust: 0,
        darkDust: 0,
        angelingot: 0,
        hellingot: 0,
        yinyang: 0
    },

    // Состояние боя
    bomjHealth: 20,

    // Квесты
    currentQuest: null,
    questProgress: 0,

    // Таймеры
    intervals: []
};

// Инициализация игры
function init() {
    // Привязка событий
    document.getElementById('fish-btn').addEventListener('click', startFishing);
    document.getElementById('mine-btn').addEventListener('click', mineResources);
    document.getElementById('attack-btn').addEventListener('click', attackBomj);
    document.getElementById('craft-yinyang-btn').addEventListener('click', craftYinYang);
    
    // Запуск пассивного дохода
    Game.intervals.push(setInterval(() => {
        Game.money += Game.houses;
        updateUI();
    }, 3000));

    // Генерация первого квеста
    generateQuest();
    updateUI();
}

// Рыбалка
function startFishing() {
    const btn = document.getElementById('fish-btn');
    btn.disabled = true;

    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        document.getElementById('fishing-progress').style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            finishFishing();
            btn.disabled = false;
        }
    }, 50);
}

function finishFishing() {
    const result = document.getElementById('fishing-result');
    
    // Шанс получить рыболовную руду
    const chance = Game.luck > 0 ? 0.5 : 0.02;
    if (Math.random() < chance) {
        Game.resources.fishingOre++;
        result.textContent = "🎣 Вы нашли рыболовную руду!";
        result.style.color = "#e74c3c";
    } else {
        Game.money += 1;
        result.textContent = "🐟 Поймана рыба (+1$)";
        result.style.color = "#2ecc71";
    }

    checkQuest('fish');
    updateUI();
}

// Майнинг
function mineResources() {
    if (Game.money < 5) {
        alert("Недостаточно денег!");
        return;
    }

    Game.money -= 5;
    const rand = Math.random();
    
    if (rand < 0.6) {
        Game.resources.wood++;
        showResult("🪵 Добыто дерево", "#8B4513");
    } else {
        Game.resources.stone++;
        showResult("🪨 Добыт камень", "#808080");
        checkQuest('stone');
    }

    updateUI();
}

// Битва с бомжом
function attackBomj() {
    if (Math.random() < 0.7) {
        Game.bomjHealth -= 1;
        if (Game.bomjHealth <= 0) {
            Game.money += 50;
            showResult("🎉 Вы победили бомжа! (+50$)", "#27ae60");
            resetBomj();
        }
    } else {
        Game.money = Math.max(0, Game.money - 10);
        showResult("💥 Бомж контратаковал! (-10$)", "#c0392b");
    }
    
    updateUI();
}

function resetBomj() {
    Game.bomjHealth = 20;
    document.getElementById('attack-btn').disabled = true;
}

// Крафт
function craftYinYang() {
    if (Game.resources.angelingot >= 1 && Game.resources.hellingot >= 1) {
        Game.resources.angelingot--;
        Game.resources.hellingot--;
        Game.resources.yinyang++;
        Game.luck += 100;
        showResult("☯ Создана Инь-Янь (+100% удачи)", "#2c3e50");
        updateUI();
    }
}

// Квесты
function generateQuest() {
    const quests = [
        { type: 'fish', target: 5, reward: 15, text: "Поймать 5 рыб" },
        { type: 'stone', target: 8, reward: 25, text: "Добыть 8 камней" }
    ];
    
    Game.currentQuest = quests[Math.floor(Math.random() * quests.length)];
    Game.questProgress = 0;
    updateQuestUI();
}

function checkQuest(type) {
    if (!Game.currentQuest || Game.currentQuest.type !== type) return;
    
    Game.questProgress++;
    if (Game.questProgress >= Game.currentQuest.target) {
        document.getElementById('claim-btn').disabled = false;
    }
    updateQuestUI();
}

// Обновление интерфейса
function updateUI() {
    // Деньги и ресурсы
    document.getElementById('money').textContent = Game.money;
    document.getElementById('luck').textContent = Game.luck;
    document.getElementById('houses').textContent = Game.houses;
    
    // Ресурсы
    document.getElementById('wood').textContent = `Дерево: ${Game.resources.wood}`;
    document.getElementById('stone').textContent = `Камень: ${Game.resources.stone}`;

    // Кнопки
    document.getElementById('mine-btn').disabled = Game.money < 5;
    document.getElementById('craft-yinyang-btn').disabled = 
        Game.resources.angelingot < 1 || Game.resources.hellingot < 1;
}

function updateQuestUI() {
    if (Game.currentQuest) {
        document.getElementById('quest-text').textContent = Game.currentQuest.text;
        document.getElementById('quest-progress').textContent = 
            `Прогресс: ${Game.questProgress}/${Game.currentQuest.target}`;
    }
}

function showResult(text, color) {
    const result = document.getElementById('mining-result');
    result.textContent = text;
    result.style.color = color;
    setTimeout(() => result.textContent = '', 3000);
}

// Запуск игры
init();
