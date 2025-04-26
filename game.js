// Игровые переменные
let game = {
    steps: 0,
    coins: 0,
    playerHP: 5,
    playerMaxHP: 5,
    baseDamage: 1,
    bonusDamage: 0,
    enemyHP: 5,
    enemyType: "normal",
    healthPotions: 0,
    megaHealthPotions: 0,
    pickaxes: 0,
    inBattle: false,
    inShop: false,
    inUltraShop: false,
    inventoryOpen: false,
    weapon: "fists",
    kills: 0,
    nextAttackMultiplier: 1,
    inOreBattle: false,
    hasSpear: false,
    hasVampireKnife: false,
    hasFaculty: false,
    hasLightStep: false
};

// Элементы DOM
const elements = {
    stepBtn: document.getElementById('step-btn'),
    fightBtn: document.getElementById('fight-btn'),
    defendBtn: document.getElementById('defend-btn'),
    inventoryBtn: document.getElementById('inventory-btn'),
    useHealthBtn: document.getElementById('use-health'),
    useMegaHealthBtn: document.getElementById('use-mega-health'),
    usePickaxeBtn: document.getElementById('use-pickaxe'),
    closeInventoryBtn: document.getElementById('close-inventory'),
    buyHealthBtn: document.getElementById('buy-health'),
    buyPickaxeBtn: document.getElementById('buy-pickaxe'),
    buySpearBtn: document.getElementById('buy-spear'),
    buyVampireBtn: document.getElementById('buy-vampire'),
    buyFacultyBtn: document.getElementById('buy-faculty'),
    buyLightBtn: document.getElementById('buy-light'),
    buyMegaHealthBtn: document.getElementById('buy-mega-health'),
    exitShopBtn: document.getElementById('exit-shop'),
    exitUltraShopBtn: document.getElementById('exit-ultra-shop'),
    stepsDisplay: document.getElementById('steps'),
    coinsDisplay: document.getElementById('coins'),
    playerHpDisplay: document.getElementById('player-hp'),
    playerMaxHpDisplay: document.getElementById('player-max-hp'),
    playerHealthBar: document.getElementById('player-health-bar'),
    playerDamageDisplay: document.getElementById('player-damage'),
    enemyHpDisplay: document.getElementById('enemy-hp'),
    enemyTypeDisplay: document.getElementById('enemy-type'),
    enemyHealthBar: document.getElementById('enemy-health-bar'),
    battleStatus: document.getElementById('battle-status'),
    gameLog: document.getElementById('game-log'),
    battleContainer: document.getElementById('battle-container'),
    shopContainer: document.getElementById('shop-container'),
    ultraShopContainer: document.getElementById('ultra-shop-container'),
    inventoryContainer: document.getElementById('inventory-container'),
    weaponDisplay: document.getElementById('weapon'),
    killsDisplay: document.getElementById('kills')
};

// Функция для добавления сообщения в лог
function addLog(message) {
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    elements.gameLog.appendChild(logEntry);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
}

// Обновление интерфейса
function updateUI() {
    elements.stepsDisplay.textContent = game.steps;
    elements.coinsDisplay.textContent = game.coins;
    elements.playerHpDisplay.textContent = game.playerHP;
    elements.playerMaxHpDisplay.textContent = game.playerMaxHP;
    elements.playerDamageDisplay.textContent = game.baseDamage + game.bonusDamage;
    elements.playerHealthBar.style.width = `${(game.playerHP / game.playerMaxHP) * 100}%`;
    elements.enemyHpDisplay.textContent = game.enemyHP;
    elements.enemyHealthBar.style.width = `${(game.enemyHP / (game.inOreBattle ? 10 : 5)) * 100}%`;
    elements.useHealthBtn.textContent = `Зелье здоровья (${game.healthPotions}) - +5 HP`;
    elements.useMegaHealthBtn.textContent = `Мега зелье (${game.megaHealthPotions}) - +100 HP`;
    elements.usePickaxeBtn.textContent = `Использовать кирку (${game.pickaxes})`;
    elements.killsDisplay.textContent = game.kills;
    
    // Обновление отображения оружия
    let weaponName = "Кулаки";
    if (game.hasSpear) weaponName = "Копьё";
    if (game.hasVampireKnife) weaponName = "Вампирский нож";
    if (game.hasFaculty) weaponName = "Факультет";
    elements.weaponDisplay.textContent = weaponName;
    
    // Проверка фаз для факультета
    if (game.hasFaculty) {
        const totalDamage = game.baseDamage + game.bonusDamage;
        if (totalDamage >= 5 && totalDamage < 50) {
            elements.fightBtn.classList.add('phase-1');
        } else if (totalDamage >= 50) {
            elements.fightBtn.classList.add('phase-2');
            elements.defendBtn.classList.add('phase-2');
            elements.stepBtn.classList.add('phase-2');
        }
    }
    
    if (game.playerHP <= 0) {
        addLog("Игра окончена!");
        disableAllButtons();
    }
}

function disableAllButtons() {
    elements.stepBtn.disabled = true;
    elements.fightBtn.disabled = true;
    elements.defendBtn.disabled = true;
}

// Начало боя
function startBattle() {
    // 10% шанс встретить руду
    if (Math.random() < 0.1 && game.pickaxes > 0) {
        game.inOreBattle = true;
        game.enemyType = "ore";
        game.enemyHP = 10;
    } else {
        game.inOreBattle = false;
        game.enemyType = "normal";
        game.enemyHP = 5;
    }
    
    game.inBattle = true;
    elements.battleContainer.style.display = 'block';
    elements.fightBtn.disabled = false;
    elements.defendBtn.disabled = false;
    elements.stepBtn.disabled = true;
    elements.enemyTypeDisplay.textContent = `Враг: ${game.inOreBattle ? "Руда" : "Обычный"}`;
    updateUI();
    addLog(`Начался бой с ${game.inOreBattle ? "рудой!" : "врагом!"}`);
}

// Конец боя
function endBattle() {
    game.inBattle = false;
    game.inOreBattle = false;
    elements.battleContainer.style.display = 'none';
    elements.fightBtn.disabled = true;
    elements.defendBtn.disabled = true;
    elements.stepBtn.disabled = false;
    addLog("Бой окончен!");
    updateUI();
}

// Открытие магазина
function openShop() {
    if (game.steps % 75 === 0 && game.steps > 0) {
        game.inUltraShop = true;
        elements.ultraShopContainer.style.display = 'block';
        addLog("Добро пожаловать в УЛЬТРА МАГАЗИН!");
    } else {
        game.inShop = true;
        elements.shopContainer.style.display = 'block';
        addLog("Добро пожаловать в магазин!");
    }
    elements.stepBtn.disabled = true;
}

// Закрытие магазина
function closeShop() {
    if (game.inUltraShop) {
        game.inUltraShop = false;
        elements.ultraShopContainer.style.display = 'none';
    } else {
        game.inShop = false;
        elements.shopContainer.style.display = 'none';
    }
    elements.stepBtn.disabled = false;
}

// Открытие/закрытие инвентаря
function toggleInventory() {
    game.inventoryOpen = !game.inventoryOpen;
    elements.inventoryContainer.style.display = game.inventoryOpen ? 'block' : 'none';
}

// Атака игрока
function playerAttack() {
    let damage = game.baseDamage + game.bonusDamage;
    
    // Умножение урона для мега зелья
    damage *= game.nextAttackMultiplier;
    game.nextAttackMultiplier = 1;
    
    // Особенности оружия
    if (game.hasSpear && Math.random() < 0.25) {
        damage *= 2; // 25% шанс двойного удара копьём
        addLog("Копьё наносит двойной урон!");
    }
    
    game.enemyHP -= damage;
    addLog(`Вы нанесли ${damage} урона!`);
    
    // Вампиризм
    if (game.hasVampireKnife) {
        const healAmount = 2;
        game.playerHP = Math.min(game.playerHP + healAmount, game.playerMaxHP);
        addLog(`Вампирский нож восстанавливает ${healAmount} HP!`);
    }
    
    if (game.enemyHP <= 0) {
        if (game.inOreBattle) {
            const reward = Math.floor(Math.random() * 31) + 20; // 20-50 монет
            game.coins += reward;
            game.pickaxes--; // Тратим кирку
            addLog(`Руда разрушена! Вы получили ${reward} монет.`);
        } else {
            const reward = Math.floor(Math.random() * 10) + 5;
            game.coins += reward;
            game.kills++;
            addLog(`Победа! Вы получили ${reward} монет.`);
            
            // Бонус факультета
            if (game.hasFaculty) {
                game.bonusDamage++;
                addLog("Факультет увеличивает ваш урон на 1!");
            }
        }
        endBattle();
    } else {
        setTimeout(() => {
            if (game.inOreBattle) {
                // Руда не атакует
                addLog("Руда беззащитна перед вами!");
                elements.fightBtn.disabled = false;
            } else {
                enemyAttack();
            }
            updateUI();
        }, 1000);
    }
    
    updateUI();
}

// Атака врага
function enemyAttack() {
    const damage = 1;
    game.playerHP -= damage;
    addLog(`Враг нанес вам ${damage} урон!`);
    
    if (game.playerHP <= 0) {
        endBattle();
    } else {
        elements.fightBtn.disabled = false;
        elements.defendBtn.disabled = false;
    }
}

// Защита игрока
function playerDefend() {
    addLog("Вы защищаетесь!");
    
    setTimeout(() => {
        if (Math.random() < 0.5) {
            // 50% шанс получить 50% урона от макс HP
            const damage = Math.floor(game.playerMaxHP * 0.5);
            game.playerHP -= damage;
            addLog(`Вы получили ${damage} урона при защите!`);
        } else {
            // 50% шанс получить +1 HP
            game.playerHP = Math.min(game.playerHP + 1, game.playerMaxHP);
            addLog("Вы успешно защитились и получили +1 HP!");
        }
        
        if (game.playerHP <= 0) {
            endBattle();
        } else {
            elements.fightBtn.disabled = false;
            elements.defendBtn.disabled = false;
        }
        
        updateUI();
    }, 1000);
}

// Обработчики событий
elements.stepBtn.addEventListener('click', () => {
    game.steps++;
    
    if (game.steps % 10 === 0 || game.steps % 75 === 0) {
        openShop();
    } else if (Math.random() < 0.3) {
        startBattle();
    } else {
        const coinsGained = Math.floor(Math.random() * 10) + 1;
        game.coins += coinsGained;
        addLog(`Шаг ${game.steps}: Вы нашли ${coinsGained} монет!`);
    }
    
    updateUI();
});

elements.fightBtn.addEventListener('click', () => {
    elements.fightBtn.disabled = true;
    elements.defendBtn.disabled = true;
    playerAttack();
});

elements.defendBtn.addEventListener('click', () => {
    elements.fightBtn.disabled = true;
    elements.defendBtn.disabled = true;
    playerDefend();
});

elements.inventoryBtn.addEventListener('click', toggleInventory);
elements.closeInventoryBtn.addEventListener('click', toggleInventory);

elements.useHealthBtn.addEventListener('click', () => {
    if (game.healthPotions > 0) {
        game.healthPotions--;
        game.playerHP = Math.min(game.playerHP + 5, game.playerMaxHP);
        addLog("Использовано зелье здоровья (+5 HP)");
        updateUI();
    }
});

elements.useMegaHealthBtn.addEventListener('click', () => {
    if (game.megaHealthPotions > 0) {
        game.megaHealthPotions--;
        game.playerHP = Math.min(game.playerHP + 100, game.playerMaxHP);
        game.nextAttackMultiplier = 15;
        addLog("Использовано МЕГА зелье (+100 HP, следующая атака ×15)");
        updateUI();
    }
});

elements.usePickaxeBtn.addEventListener('click', () => {
    if (game.pickaxes > 0 && game.inBattle && game.inOreBattle) {
        game.pickaxes--;
        playerAttack();
    }
});

// Покупки в обычном магазине
elements.buyHealthBtn.addEventListener('click', () => {
    if (game.coins >= 20) {
        game.coins -= 20;
        game.healthPotions++;
        addLog("Куплено зелье здоровья");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

elements.buyPickaxeBtn.addEventListener('click', () => {
    if (game.coins >= 10) {
        game.coins -= 10;
        game.pickaxes++;
        addLog("Куплена кирка");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

elements.buySpearBtn.addEventListener('click', () => {
    if (game.coins >= 1000) {
        game.coins -= 1000;
        game.hasSpear = true;
        game.baseDamage = 9;
        addLog("Куплено копьё (Урон: 9, 25% шанс двойного удара)");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

elements.buyVampireBtn.addEventListener('click', () => {
    if (game.coins >= 666) {
        game.coins -= 666;
        game.hasVampireKnife = true;
        game.baseDamage = 5;
        addLog("Куплен вампирский нож (Урон: 5, +2 HP за удар)");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

elements.buyFacultyBtn.addEventListener('click', () => {
    if (game.coins >= 2000) {
        game.coins -= 2000;
        game.hasFaculty = true;
        game.baseDamage = 1;
        game.bonusDamage = 0;
        addLog("Куплен факультет (Урон: 1, +1 урон за убийство)");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

elements.buyLightBtn.addEventListener('click', () => {
    if (game.coins >= 250) {
        game.coins -= 250;
        game.playerMaxHP += 25;
        game.playerHP += 25;
        game.steps += 10;
        addLog("Куплен Шаг Света (+25 Max HP, +10 шагов)");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

// Покупки в ультра магазине
elements.buyMegaHealthBtn.addEventListener('click', () => {
    if (game.coins >= 161) {
        game.coins -= 161;
        game.megaHealthPotions++;
        addLog("Куплено МЕГА зелье (+100 HP, ×15 урон в след. атаке)");
        updateUI();
    } else {
        addLog("Недостаточно монет!");
    }
});

elements.exitShopBtn.addEventListener('click', closeShop);
elements.exitUltraShopBtn.addEventListener('click', closeShop);

// Инициализация игры
updateUI();
addLog("Добро пожаловать в игру! Нажимайте 'Сделать шаг' чтобы начать.");
