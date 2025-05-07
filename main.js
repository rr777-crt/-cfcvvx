// Игровые переменные
let steps = 0;
let coins = 0;
let health = 5;
let maxHealth = 5;
let baseDamage = 1;
let damageModifier = 0;
let kills = 0;
let inBattle = false;
let enemyHealth = 0;
let enemyMaxHealth = 5;
let enemyDamage = 1;
let enemyType = "normal";
let enemyAttackTime = 3000;
let dodgesLeft = 3;
let isPlayerTurn = true;
let defendMode = false;
let inventory = [];
let rageActive = false;
let enemyAttackTimeout = null;
let defense = 0;
let miningActive = false;
let miningProgress = 0;
let miningRequired = 40;
let chestFound = false;
let fakultetActive = false;
let qteCircles = [];
let qteTimeout = null;

// Элементы DOM
const stepBtn = document.getElementById('stepBtn');
const battleActions = document.getElementById('battleActions');
const battleTitle = document.getElementById('battleTitle');
const enemyName = document.getElementById('enemyName');
const enemyStats = document.getElementById('enemyStats');
const attackBtn = document.getElementById('attackBtn');
const defendBtn = document.getElementById('defendBtn');
const dodgeBtn = document.getElementById('dodgeBtn');
const shop = document.getElementById('shop');
const spearBtn = document.getElementById('spearBtn');
const fakultetBtn = document.getElementById('fakultetBtn');
const glovesBtn = document.getElementById('glovesBtn');
const swordBtn = document.getElementById('swordBtn');
const bowBtn = document.getElementById('bowBtn');
const armorBtn = document.getElementById('armorBtn');
const healthBtn = document.getElementById('healthBtn');
const lifeOrbBtn = document.getElementById('lifeOrbBtn');
const healthPotionBtn = document.getElementById('healthPotionBtn');
const rageOrbBtn = document.getElementById('rageOrbBtn');
const pickaxeBtn = document.getElementById('pickaxeBtn');
const miningContainer = document.getElementById('miningContainer');
const chestContainer = document.getElementById('chestContainer');

// Функции обновления интерфейса
function updateUI() {
    document.getElementById('steps').textContent = steps;
    document.getElementById('coins').textContent = coins;
    document.getElementById('kills').textContent = kills;
    document.getElementById('defense').textContent = `${defense}%`;
    
    // Рассчет урона
    const damage = baseDamage + damageModifier;
    document.getElementById('damage').textContent = damage > 1 ? `${damage} (${baseDamage}+${damageModifier})` : damage;
    
    // Обновление HP игрока
    const hpPercent = (health / maxHealth) * 100;
    document.getElementById('hpBar').style.width = `${hpPercent}%`;
    document.getElementById('hpText').textContent = `${health}/${maxHealth}`;
    
    // Обновление HP врага
    if (inBattle) {
        const enemyHpPercent = (enemyHealth / enemyMaxHealth) * 100;
        document.getElementById('enemyHpBar').style.width = `${enemyHpPercent}%`;
        document.getElementById('enemyHpText').textContent = enemyHealth;
        document.getElementById('enemyHpFullText').textContent = `${enemyHealth}/${enemyMaxHealth}`;
    }
    
    // Обновление инвентаря
    const inventoryItems = document.getElementById('inventoryItems');
    if (inventory.length === 0) {
        inventoryItems.innerHTML = 'Пусто';
    } else {
        inventoryItems.innerHTML = '';
        inventory.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.textContent = item;
            
            // Особые действия для некоторых предметов
            if (item === 'Кирка' && miningActive) {
                itemEl.style.backgroundColor = '#f39c12';
                itemEl.onclick = () => mineMineral();
            } else if (item === 'Сфера жизни' || item === 'Сфера ярости' || item === 'Зелье здоровья') {
                itemEl.onclick = () => useItem(item);
            } else {
                itemEl.style.cursor = 'default';
            }
            
            inventoryItems.appendChild(itemEl);
        });
    }
    
    // Показать/скрыть магазин каждые 10 шагов
    if (steps > 0 && steps % 10 === 0 && !inBattle && !miningActive) {
        shop.style.display = 'block';
        
        // 50% шанс найти сундук
        if (!chestFound && Math.random() < 0.5) {
            chestContainer.innerHTML = '<button id="chestBtn" style="background-color:#f1c40f;color:#000;">🎁 Сундук (100 монет)</button>';
            document.getElementById('chestBtn').addEventListener('click', openChest);
            chestFound = true;
        }
    } else {
        shop.style.display = 'none';
    }
    
    // Блокировка кнопок во время хода врага
    attackBtn.disabled = !isPlayerTurn || !inBattle;
    defendBtn.disabled = !isPlayerTurn || !inBattle;
    dodgeBtn.disabled = !inBattle || dodgesLeft <= 0;
    
    // Проверка на максимальный урон для ФАКУЛЬТЕТА
    if (fakultetActive && damageModifier >= 15) {
        stepBtn.classList.add('max-damage');
    } else {
        stepBtn.classList.remove('max-damage');
    }
}

// Функция добавления сообщения в лог
function addLog(message) {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    log.prepend(entry);
    
    // Ограничение количества записей в логе
    if (log.children.length > 10) {
        log.removeChild(log.lastChild);
    }
}

// Функция шага
function makeStep() {
    if (inBattle || miningActive) return;
    
    steps++;
    chestFound = false;
    
    // Получение монет
    const coinsEarned = Math.floor(Math.random() * 25) + 1;
    coins += coinsEarned;
    addLog(`Вы сделали шаг и получили ${coinsEarned} монет!`);
    
    // Проверка на встречу с врагом (30% шанс)
    if (Math.random() < 0.3) {
        startBattle();
    }
    
    // Проверка на нахождение минерала (5% шанс, если есть кирка)
    if (inventory.includes('Кирка') && Math.random() < 0.05) {
        startMining();
    }
    
    updateUI();
}

// Функция начала битвы
function startBattle() {
    inBattle = true;
    dodgesLeft = 3;
    isPlayerTurn = true;
    defendMode = false;
    
    // Определение типа врага
    if (steps === 50) {
        // Босс - Король слизней
        enemyType = "slime_king";
        enemyMaxHealth = 100;
        enemyDamage = "2-5";
        enemyAttackTime = 2000;
        battleTitle.textContent = "👑 Босс: Король слизней 👑";
    } else if (steps === 100) {
        // Босс - Тёмный лорд
        enemyType = "dark_lord";
        enemyMaxHealth = 200;
        enemyDamage = 2;
        enemyAttackTime = 1500;
        battleTitle.textContent = "👑 Босс: Тёмный лорд 👑";
    } else if (steps >= 60) {
        // Сильный слизень
        enemyType = "strong_slime";
        enemyMaxHealth = 60;
        enemyDamage = 4;
        enemyAttackTime = Math.random() * 750 + 750; // 0.75-1.5 сек
        battleTitle.textContent = "⚔️ Битва! ⚔️";
    } else if (steps >= 30) {
        // Слабая слизь
        enemyType = "weak_slime";
        enemyMaxHealth = 30;
        enemyDamage = 2;
        enemyAttackTime = Math.random() * 750 + 750; // 0.75-1.5 сек
        battleTitle.textContent = "⚔️ Битва! ⚔️";
    } else {
        // Обычный враг
        enemyType = "normal";
        if (steps >= 60) {
            enemyMaxHealth = 35;
            enemyDamage = 3;
        } else if (steps >= 20) {
            enemyMaxHealth = 15;
            enemyDamage = 2;
        } else {
            enemyMaxHealth = 5;
            enemyDamage = 1;
        }
        enemyAttackTime = 3000;
        battleTitle.textContent = "⚔️ Битва! ⚔️";
    }
    
    enemyHealth = enemyMaxHealth;
    
    // Обновление информации о враге
    enemyName.textContent = getEnemyName(enemyType);
    enemyStats.textContent = `HP: ${enemyMaxHealth}, Урон: ${enemyDamage}` + 
                            (enemyType.includes("slime") ? `, Атака: ${(enemyAttackTime/1000).toFixed(2)}с` : "");
    
    battleActions.style.display = 'block';
    stepBtn.disabled = true;
    
    addLog(`Вы встретили ${getEnemyName(enemyType)}! (${enemyMaxHealth} HP, Урон: ${enemyDamage}) Начинается битва!`);
    updateUI();
}

// Функция получения имени врага
function getEnemyName(type) {
    switch(type) {
        case "slime_king": return "Король слизней";
        case "dark_lord": return "Тёмный лорд";
        case "strong_slime": return "Сильный слизень";
        case "weak_slime": return "Слизень";
        default: return "Враг";
    }
}

// Функция окончания битвы
function endBattle(victory = true) {
    if (victory) {
        kills++;
        if (fakultetActive && damageModifier < 15) {
            damageModifier++;
            addLog(`ФАКУЛЬТЕТ: +1 к урону! Теперь урон: ${baseDamage + damageModifier}`);
        }
    }
    
    inBattle = false;
    battleActions.style.display = 'none';
    stepBtn.disabled = false;
    
    // Очистка QTE для босса
    clearQTE();
    
    // Очистка таймера атаки врага
    if (enemyAttackTimeout) {
        clearTimeout(enemyAttackTimeout);
        enemyAttackTimeout = null;
    }
    
    updateUI();
}

// Функция атаки игрока
function playerAttack() {
    if (!isPlayerTurn || !inBattle) return;
    
    let attackDamage = baseDamage + damageModifier;
    if (rageActive) {
        attackDamage *= 2;
        rageActive = false;
        addLog('Сфера ярости активирована! Урон удвоен!');
    }
    
    // Для лука - случайный урон от 3 до 6
    if (inventory.includes('Лук')) {
        attackDamage = Math.floor(Math.random() * 4) + 3;
        addLog(`Вы стреляете из лука и наносите ${attackDamage} урона!`);
    } else {
        addLog(`Вы атакуете врага и наносите ${attackDamage} урона!`);
    }
    
    enemyHealth -= attackDamage;
    
    if (enemyHealth <= 0) {
        enemyHealth = 0;
        addLog(`Вы победили ${getEnemyName(enemyType)}!`);
        endBattle();
        return;
    }
    
    isPlayerTurn = false;
    updateUI();
    
    // Ход врага через заданное время
    enemyAttackTimeout = setTimeout(enemyTurn, enemyAttackTime);
    
    // Для тёмного лорда - запускаем QTE
    if (enemyType === "dark_lord") {
        startQTE();
    }
}

// Функция защиты игрока
function playerDefend() {
    if (!isPlayerTurn || !inBattle) return;
    
    defendMode = true;
    addLog('Вы готовитесь к защите!');
    
    isPlayerTurn = false;
    updateUI();
    
    // Ход врага через заданное время
    enemyAttackTimeout = setTimeout(enemyTurn, enemyAttackTime);
    
    // Для тёмного лорда - запускаем QTE
    if (enemyType === "dark_lord") {
        startQTE();
    }
}

// Функция уворота игрока
function playerDodge() {
    if (!inBattle || dodgesLeft <= 0) return;
    
    dodgesLeft--;
    addLog('Вы увернулись от атаки врага!');
    
    // Если увернулись во время хода врага, отменяем его атаку
    if (!isPlayerTurn && enemyAttackTimeout) {
        clearTimeout(enemyAttackTimeout);
        isPlayerTurn = true;
        addLog('Вы перехватили инициативу!');
        clearQTE();
    }
    
    updateUI();
}

// Ход врага
function enemyTurn() {
    if (!inBattle) return;
    
    // 15% шанс что враг промахнется (кроме боссов)
    if (enemyType !== "slime_king" && enemyType !== "dark_lord" && Math.random() < 0.15) {
        addLog('Враг промахнулся!');
        isPlayerTurn = true;
        updateUI();
        return;
    }
    
    let damageTaken = typeof enemyDamage === 'string' ? 
        Math.floor(Math.random() * 4) + 2 : // Для короля слизней 2-5 урона
        enemyDamage;
    
    // Учет защиты
    if (defense > 0) {
        const damageReduction = Math.floor(damageTaken * (defense / 100));
        damageTaken -= damageReduction;
        addLog(`Ваша броня уменьшила урон на ${damageReduction}!`);
    }
    
    if (defendMode) {
        damageTaken = Math.max(1, Math.floor(damageTaken * 0.5));
        addLog(`Враг атакует, но вы заблокировали часть урона! (Получено ${damageTaken} урона)`);
        defendMode = false;
    } else {
        addLog(`Враг атакует и наносит ${damageTaken} урона!`);
    }
    
    health -= damageTaken;
    
    if (health <= 0) {
        health = 0;
        addLog('Вы проиграли! Игра окончена.');
        endBattle(false);
        stepBtn.disabled = true;
        return;
    }
    
    isPlayerTurn = true;
    updateUI();
}

// Функция использования предмета из инвентаря
function useItem(item) {
    if (item === 'Сфера жизни') {
        health = Math.min(health + 10, maxHealth);
        inventory = inventory.filter(i => i !== item);
        addLog('Вы использовали Сферу жизни и восстановили 10 HP!');
    } else if (item === 'Сфера ярости') {
        rageActive = true;
        inventory = inventory.filter(i => i !== item);
        addLog('Вы активировали Сферу ярости! Следующая атака будет сильнее!');
    } else if (item === 'Зелье здоровья') {
        health = maxHealth;
        inventory = inventory.filter(i => i !== item);
        addLog('Вы использовали Зелье здоровья и полностью восстановили HP!');
    }
    
    updateUI();
}

// Функция начала добычи минерала
function startMining() {
    miningActive = true;
    miningProgress = 0;
    miningContainer.style.display = 'block';
    document.getElementById('miningProgress').style.width = '0%';
    addLog('Вы нашли минерал! Используйте кирку из инвентаря, чтобы добыть его.');
    updateUI();
}

// Функция добычи минерала
function mineMineral() {
    if (!miningActive) return;
    
    miningProgress++;
    document.getElementById('miningProgress').style.width = `${(miningProgress / miningRequired) * 100}%`;
    
    if (miningProgress >= miningRequired) {
        const minedCoins = Math.floor(Math.random() * 66) + 60;
        coins += minedCoins;
        addLog(`Вы добыли минерал и получили ${minedCoins} монет!`);
        miningActive = false;
        miningContainer.style.display = 'none';
    }
    
    updateUI();
}

// Функция открытия сундука
function openChest() {
    coins += 100;
    addLog('Вы нашли сундук с 100 монетами!');
    chestContainer.innerHTML = '';
    updateUI();
}

// Функция запуска QTE для тёмного лорда
function startQTE() {
    clearQTE();
    
    // Создаем 3 кружка в случайных местах
    for (let i = 0; i < 3; i++) {
        createQTECircle();
    }
    
    // Устанавливаем таймер на неудачное QTE
    qteTimeout = setTimeout(() => {
        if (inBattle && enemyType === "dark_lord") {
            health -= 5;
            addLog('Вы не успели реагировать на атаку Тёмного лорда и получили 5 урона!');
            
            if (health <= 0) {
                health = 0;
                addLog('Вы проиграли! Игра окончена.');
                endBattle(false);
                stepBtn.disabled = true;
            } else {
                updateUI();
            }
        }
        clearQTE();
    }, 3000);
}

// Функция создания кружка QTE
function createQTECircle() {
    const circle = document.createElement('div');
    circle.className = 'boss-qte';
    circle.textContent = '!';
    
    // Случайная позиция на экране
    const x = Math.random() * (window.innerWidth - 100) + 50;
    const y = Math.random() * (window.innerHeight - 100) + 50;
    
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    
    circle.onclick = () => {
        circle.remove();
        qteCircles = qteCircles.filter(c => c !== circle);
        
        // Если все кружки нажаты, отменяем урон
        if (qteCircles.length === 0 && qteTimeout) {
            clearTimeout(qteTimeout);
            addLog('Вы успешно отразили атаку Тёмного лорда!');
        }
    };
    
    document.body.appendChild(circle);
    qteCircles.push(circle);
}

// Функция очистки QTE
function clearQTE() {
    qteCircles.forEach(circle => circle.remove());
    qteCircles = [];
    if (qteTimeout) {
        clearTimeout(qteTimeout);
        qteTimeout = null;
    }
}

// Покупки в магазине
function buySpear() {
    if (coins >= 1000) {
        coins -= 1000;
        baseDamage = 8; // Урон не суммируется, заменяется
        damageModifier = 0;
        addLog('Вы купили копьё! Теперь ваш урон 8.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки копья!');
    }
}

function buyFakultet() {
    if (coins >= 2500) {
        coins -= 2500;
        fakultetActive = true;
        addLog('Вы купили ФАКУЛЬТЕТ! Теперь за каждое убийство вы получаете +1 к урону (макс. +15).');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки ФАКУЛЬТЕТА!');
    }
}

function buySword() {
    if (coins >= 150) {
        coins -= 150;
        baseDamage = 4; // Урон не суммируется, заменяется
        damageModifier = 0;
        addLog('Вы купили меч! Теперь ваш урон 4.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки меча!');
    }
}

function buyBow() {
    if (coins >= 300) {
        coins -= 300;
        baseDamage = 3; // Минимальный урон лука
        damageModifier = 3; // Максимальный урон будет 6 (3+3)
        addLog('Вы купили лук! Теперь ваш урон 3-6.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки лука!');
    }
}

function buyGloves() {
    if (coins >= 100) {
        coins -= 100;
        damageModifier += 2;
        addLog('Вы купили перчатки! Урон увеличен на 2.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки перчаток!');
    }
}

function buyArmor() {
    if (coins >= 200) {
        coins -= 200;
        defense = 20;
        addLog('Вы купили железную броню! Теперь вы получаете на 20% меньше урона.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки брони!');
    }
}

function buyHealthUpgrade() {
    if (coins >= 25) {
        coins -= 25;
        maxHealth += 1;
        health += 1;
        addLog('Вы увеличили максимальное здоровье на 1!');
        updateUI();
    } else {
        addLog('Недостаточно монет для увеличения здоровья!');
    }
}

function buyLifeOrb() {
    if (coins >= 50) {
        coins -= 50;
        inventory.push('Сфера жизни');
        addLog('Вы купили Сферу жизни!');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки Сферы жизни!');
    }
}

function buyHealthPotion() {
    if (coins >= 150) {
        coins -= 150;
        inventory.push('Зелье здоровья');
        addLog('Вы купили Зелье здоровья!');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки Зелья здоровья!');
    }
}

function buyRageOrb() {
    if (coins >= 25) {
        coins -= 25;
        inventory.push('Сфера ярости');
        addLog('Вы купили Сферу ярости!');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки Сферы ярости!');
    }
}

function buyPickaxe() {
    if (coins >= 10) {
        coins -= 10;
        inventory.push('Кирка');
        addLog('Вы купили кирку! Теперь вы можете добывать минералы.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки кирки!');
    }
}

// События кнопок
stepBtn.addEventListener('click', makeStep);
attackBtn.addEventListener('click', playerAttack);
defendBtn.addEventListener('click', playerDefend);
dodgeBtn.addEventListener('click', playerDodge);
spearBtn.addEventListener('click', buySpear);
fakultetBtn.addEventListener('click', buyFakultet);
swordBtn.addEventListener('click', buySword);
bowBtn.addEventListener('click', buyBow);
glovesBtn.addEventListener('click', buyGloves);
armorBtn.addEventListener('click', buyArmor);
healthBtn.addEventListener('click', buyHealthUpgrade);
lifeOrbBtn.addEventListener('click', buyLifeOrb);
healthPotionBtn.addEventListener('click', buyHealthPotion);
rageOrbBtn.addEventListener('click', buyRageOrb);
pickaxeBtn.addEventListener('click', buyPickaxe);

// Инициализация игры
updateUI();
// ... (предыдущий код остаётся без изменений до строки с объявлением переменных)

// Добавляем новые переменные для системы уровней
let level = 1;
let xp = 0;
let xpToNextLevel = 150;
let chestChance = 10; // 10% шанс на сундук вместо 50%

// В функции updateUI() добавляем обновление уровня и опыта:
function updateUI() {
    // ... (предыдущий код)
    document.getElementById('level').textContent = level;
    document.getElementById('xp').textContent = `${xp}/${xpToNextLevel}`;
    // ... (остальной код)
}

// В функцию endBattle() добавляем начисление опыта:
function endBattle(victory = true) {
    if (victory) {
        // Начисляем опыт в зависимости от типа врага
        switch(enemyType) {
            case "slime_king":
            case "dark_lord":
                xp += 50;
                break;
            case "strong_slime":
                xp += 20;
                break;
            case "weak_slime":
                xp += 15;
                break;
            default:
                xp += 5;
        }
        
        // Проверяем уровень
        if (xp >= xpToNextLevel) {
            levelUp();
        }
        
        // ... (остальной код)
    }
    // ... (остальной код)
}

// Новая функция для повышения уровня
function levelUp() {
    level++;
    xp -= xpToNextLevel;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.2); // Увеличиваем требуемый опыт
    
    // Бонусы за уровень
    baseDamage += 1;
    chestChance += 1;
    
    addLog(`Поздравляем! Вы достигли ${level} уровня!`);
    addLog(`Бонусы: +1 урон, +1% к шансу найти сундук (теперь ${chestChance}%)`);
    
    updateUI();
}

// В функции makeStep() изменяем шанс на сундук:
function makeStep() {
    // ... (предыдущий код)
    
    // Проверка на магазин (каждые 10 шагов, но не на 50, 100 и т.д.)
    if (steps > 0 && steps % 10 === 0 && steps % 50 !== 0 && !inBattle && !miningActive) {
        shop.style.display = 'block';
        
        // Проверка на сундук с новым шансом
        if (!chestFound && Math.random() < chestChance / 100) {
            chestContainer.innerHTML = '<button id="chestBtn" style="background-color:#f1c40f;color:#000;">🎁 Сундук (100 монет)</button>';
            document.getElementById('chestBtn').addEventListener('click', openChest);
            chestFound = true;
        }
    } else {
        shop.style.display = 'none';
    }
    
    // ... (остальной код)
}

// Добавляем функции для новых предметов:
function buyCoinCase() {
    if (coins >= 25) {
        coins -= 25;
        coins += 5; // Возвращаем 5 монет
        addLog('Вы купили монетницу! Получили 5 монет обратно.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки монетницы!');
    }
}

function buyMegaGlove() {
    if (coins >= 2000) {
        coins -= 2000;
        baseDamage = 15;
        damageModifier = 0;
        addLog('Вы купили мегапечатку! Теперь ваш урон 15.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки мегапечатки!');
    }
}

function buyDiamondArmor() {
    if (coins >= 1000) {
        coins -= 1000;
        defense = 50;
        addLog('Вы купили алмазную броню! Теперь вы получаете на 50% меньше урона.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки алмазной брони!');
    }
}

function buyGatePlus() {
    if (coins >= 100) {
        coins -= 100;
        maxHealth += 1;
        health += 1;
        addLog('Вы купили +1 у ворот! Максимальное здоровье увеличено на 1.');
        updateUI();
    } else {
        addLog('Недостаточно монет для покупки +1 у ворот!');
    }
}

// В конец файла добавляем обработчики для новых кнопок:
document.getElementById('coinCaseBtn').addEventListener('click', buyCoinCase);
document.getElementById('megaGloveBtn').addEventListener('click', buyMegaGlove);
document.getElementById('diamondArmorBtn').addEventListener('click', buyDiamondArmor);
document.getElementById('gatePlusBtn').addEventListener('click', buyGatePlus);

// Исправление бага с битвой:
function startBattle() {
    // В начале функции добавляем:
    if (inBattle) return;
    
    // ... (остальной код)
}

// Инициализация игры
updateUI();
