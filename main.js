/*********************
 *  ОСНОВНЫЕ ПЕРЕМЕННЫЕ
 *********************/
let steps = 0;
let coins = 0;
let health = 5;
let maxHealth = 5;
let baseDamage = 1;
let damageModifier = 0;
let defense = 0;
let inventory = [];
let level = 1;
let xp = 0;
let kills = 0;
const xpToNextLevel = 150;

/*********************
 *  DOM-ЭЛЕМЕНТЫ
 *********************/
const elements = {
  stepBtn: document.getElementById('stepBtn'),
  attackBtn: document.getElementById('attackBtn'),
  defendBtn: document.getElementById('defendBtn'),
  dodgeBtn: document.getElementById('dodgeBtn'),
  shop: document.getElementById('shop'),
  log: document.getElementById('log'),
  stepsDisplay: document.getElementById('steps'),
  coinsDisplay: document.getElementById('coins'),
  healthDisplay: document.getElementById('health'),
  maxHealthDisplay: document.getElementById('maxHealth'),
  damageDisplay: document.getElementById('damage'),
  defenseDisplay: document.getElementById('defense'),
  levelDisplay: document.getElementById('level'),
  xpDisplay: document.getElementById('xp'),
  inventoryItems: document.getElementById('inventoryItems')
};

/*********************
 *  ИГРОВЫЕ ФУНКЦИИ
 *********************/
// Обновление интерфейса
function updateUI() {
  elements.stepsDisplay.textContent = steps;
  elements.coinsDisplay.textContent = coins;
  elements.healthDisplay.textContent = health;
  elements.maxHealthDisplay.textContent = maxHealth;
  elements.damageDisplay.textContent = `${baseDamage + damageModifier} (${baseDamage}+${damageModifier})`;
  elements.defenseDisplay.textContent = `${defense}%`;
  elements.levelDisplay.textContent = level;
  elements.xpDisplay.textContent = `${xp}/${xpToNextLevel}`;
  
  // Инвентарь
  elements.inventoryItems.innerHTML = inventory.length > 0 
    ? inventory.map(item => `<div class="inventory-item">${item}</div>`).join('')
    : 'Пусто';
}

// Добавление сообщения в лог
function addLog(message) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = message;
  elements.log.prepend(entry);
  if (elements.log.children.length > 10) {
    elements.log.removeChild(elements.log.lastChild);
  }
}

/*********************
 *  СИСТЕМА ШАГОВ
 *********************/
function makeStep() {
  if (inBattle || miningActive) {
    addLog("Сейчас нельзя сделать шаг!");
    return;
  }

  steps++;
  const coinsEarned = Math.floor(Math.random() * 25) + 1;
  coins += coinsEarned;
  addLog(`Шаг ${steps}. Получено ${coinsEarned} монет.`);

  // Проверка событий
  if (steps % 10 === 0) showShop();
  if (Math.random() < 0.3) startBattle();

  updateUI();
}

// Инициализация
function init() {
  elements.stepBtn.addEventListener('click', makeStep);
  updateUI();
  addLog("Игра началась!");
}

window.addEventListener('load', init);
/*********************
 *  БОЕВАЯ СИСТЕМА
 *********************/
let inBattle = false;
let enemyHealth = 0;
let enemyMaxHealth = 5;
let enemyDamage = 1;
let enemyType = "normal";
let dodgesLeft = 3;
let isPlayerTurn = true;

// Начать бой
function startBattle() {
  inBattle = true;
  enemyHealth = enemyMaxHealth;
  dodgesLeft = 3;
  isPlayerTurn = true;
  
  elements.stepBtn.disabled = true;
  elements.attackBtn.disabled = false;
  elements.defendBtn.disabled = false;
  elements.dodgeBtn.disabled = false;
  
  addLog(`Бой начался! У врага ${enemyMaxHealth} HP.`);
  updateUI();
}

// Атака игрока
function playerAttack() {
  if (!inBattle || !isPlayerTurn) return;
  
  const damage = baseDamage + damageModifier;
  enemyHealth -= damage;
  addLog(`Вы атакуете (${damage} урона)!`);
  
  if (enemyHealth <= 0) {
    endBattle(true);
    return;
  }
  
  isPlayerTurn = false;
  setTimeout(enemyTurn, 1000);
  updateUI();
}

// Ход врага
function enemyTurn() {
  if (!inBattle) return;
  
  const damageTaken = Math.max(1, enemyDamage - Math.floor(enemyDamage * defense / 100));
  health -= damageTaken;
  addLog(`Враг атакует (${damageTaken} урона)!`);
  
  if (health <= 0) {
    health = 0;
    endBattle(false);
    return;
  }
  
  isPlayerTurn = true;
  updateUI();
}

// Завершение боя
function endBattle(victory) {
  inBattle = false;
  elements.stepBtn.disabled = false;
  
  if (victory) {
    const xpEarned = enemyType === "boss" ? 50 : 10;
    xp += xpEarned;
    addLog(`Победа! +${xpEarned} опыта.`);
    checkLevelUp();
  } else {
    addLog("Поражение! Игра окончена.");
  }
  updateUI();
}

/*********************
 *  МАГАЗИН
 *********************/
function showShop() {
  elements.shop.style.display = 'block';
  addLog("Открылся магазин!");
}

// Покупка предметов
function buyItem(itemName, cost, effect) {
  if (coins >= cost) {
    coins -= cost;
    effect();
    addLog(`Куплено: ${itemName}`);
  } else {
    addLog("Недостаточно монет!");
  }
  updateUI();
}

// Пример предмета
function buyHealthPotion() {
  buyItem("Зелье здоровья", 50, () => {
    health = Math.min(health + 10, maxHealth);
  });
}

// Инициализация магазина
function initShop() {
  document.getElementById('healthPotionBtn').addEventListener('click', buyHealthPotion);
  // Добавьте другие предметы аналогично
}

// Добавить в init()
initShop();
/*********************
 *  СИСТЕМА УРОВНЕЙ
 *********************/
function checkLevelUp() {
  if (xp >= xpToNextLevel) {
    level++;
    xp -= xpToNextLevel;
    baseDamage++;
    maxHealth += 2;
    health = maxHealth;
    addLog(`Уровень ${level}! +1 урон, +2 макс. HP`);
    updateUI();
  }
}

/*********************
 *  БОССЫ И QTE
 *********************/
function startBossFight() {
  if (steps % 50 !== 0) return;
  
  enemyType = "boss";
  enemyMaxHealth = 100;
  enemyDamage = 5;
  startBattle();
  addLog("Появился босс! Приготовьтесь!");
}

function initQTE() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qte-circle')) {
      e.target.remove();
      addLog("QTE успешно!");
    }
  });
}

/*********************
 *  СОХРАНЕНИЯ
 *********************/
function saveGame() {
  const saveData = {
    steps, coins, health, maxHealth,
    baseDamage, level, xp, inventory
  };
  localStorage.setItem('gameSave', JSON.stringify(saveData));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem('gameSave'));
  if (data) {
    Object.assign(this, data);
    addLog("Игра загружена");
  }
}

/*********************
 *  ИНИЦИАЛИЗАЦИЯ
 *********************/
function init() {
  // Часть 1
  elements.stepBtn.addEventListener('click', makeStep);
  
  // Часть 2
  elements.attackBtn.addEventListener('click', playerAttack);
  elements.defendBtn.addEventListener('click', () => {
    if (inBattle) {
      addLog("Вы защищаетесь (урон уменьшен)");
      defendMode = true;
    }
  });
  
  // Часть 3
  initQTE();
  loadGame();
  updateUI();
  
  // Проверка босса каждые 50 шагов
  setInterval(startBossFight, 1000);
}

window.addEventListener('load', init);
