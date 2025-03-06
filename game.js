// Глобальный обработчик для предотвращения скроллинга при свайпах в игре
document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.querySelector('.game-container');
    const gridContainer = document.querySelector('.grid-container');
    
    // Предотвращаем скроллинг на игровом поле
    function preventScroll(e) {
        if (e.target.closest('.grid-container') || e.target.closest('.game-container')) {
            e.preventDefault();
        }
    }
    
    // Добавляем обработчики для всех сенсорных событий
    document.addEventListener('touchmove', preventScroll, { passive: false });
});

// Массив цитат
const quotes = [
    {
        text: "«Наша работа напоминает тетрис: кажется, всё падает на голову, но мы всегда находим, как это сложить в идеальную картинку»",
        author: "Паша Швыдкин ©"
    },
    {
        text: "«Оптимизация — это искусство удаления того, что не нужно»",
        author: "Антуан де Сент-Экзюпери ©"
    },
    {
        text: "«Лучший способ предсказать будущее — создать его»",
        author: "Питер Друкер ©"
    },
    {
        text: "«Сложность — это враг. Любой дурак может сделать что-то сложным, но требуется настоящий гений, чтобы сделать это простым»",
        author: "Альберт Эйнштейн ©"
    },
    {
        text: "«Если вы не можете объяснить это просто, вы не понимаете это достаточно хорошо»",
        author: "Альберт Эйнштейн ©"
    },
    {
        text: "«Совершенство достигается не тогда, когда нечего добавить, а тогда, когда нечего убрать»",
        author: "Антуан де Сент-Экзюпери ©"
    },
    {
        text: "«Оптимизация процессов — это не просто экономия времени, это создание пространства для инноваций»",
        author: "Илон Маск ©"
    },
    {
        text: "«Не бойтесь совершенства — вам его никогда не достичь»",
        author: "Сальвадор Дали ©"
    },
    {
        text: "«Простота — это предельная степень изощренности»",
        author: "Леонардо да Винчи ©"
    },
    {
        text: "«Хороший дизайн очевиден. Отличный дизайн прозрачен»",
        author: "Джо Спаркс ©"
    },
	{
        text: "«Цифровой билайн — это игра в команде. Если каждый постарается стать лидером, то ничего не получится. Но если все согласятся следовать за одним умным капитаном, то успех гарантирован!»",
        author: "Рома Анохин ©"
    },
	{
        text: "«Нас невозможно сбить с пути, нам всё равно, куда идти!»",
        author: "Вера Лисакова ©"
    },
	{
        text: "«Мы не можем без движения, мы всегда под напряжением!»",
        author: "Нина Митякина ©"
    },
	{
        text: "«Каждый шаг оставляет след…Если процесс нельзя оптимизировать, его можно красиво оцифровать)»",
        author: "Света Морозова ©"
    },
	{
        text: "«Лучший уход за собой — это уход с работы!»",
        author: "Никита Пантин ©"
    },
	{
        text: "«Можно работать по 12 часов, а можно работать головой!»",
        author: "Максим Рыжов ©"
    },
	{
        text: "«После понедельника и вторника даже в календаре написано WTF?!?»",
        author: "Настя Старухина ©"
    },
	{
        text: "«Мы готовы на всё ради автоматизации, только откройте окно токсичности в чате для нытинга. Ну хотя бы форточку!»",
        author: "Диана Рыжова ©"
    },
	{
        text: "«Ковальски, варианты! Улыбаемся и переводим процесс с ручного на автоматический, парни!»",
        author: "Ксюша Стрыгина ©"
    },
	{
        text: "«Принцип нашей команды: хорошая идея без действия - ничто!»",
        author: "Полина Трунина ©"
    },
	{
        text: "«Когда у нас всё идёт по плану, становится даже немного тревожно — явно что-то пропустили!»",
        author: "Маша Бурцева ©"
    }
];

// Функция для отображения случайной цитаты
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    
    quoteText.textContent = quotes[randomIndex].text;
    quoteAuthor.innerHTML = `<span class="marker">${quotes[randomIndex].author.split(' ©')[0]}</span> ©`;
}

class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.history = [];
        this.winShown = false;
        this.setupEventListeners();
        this.newGame();
        
        // Отображаем случайную цитату при загрузке
        displayRandomQuote();
    }

    setupEventListeners() {
        // Клавиатура
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Кнопки управления
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        
        // Модальное окно с правилами
        const rulesBtn = document.getElementById('rules-btn');
        const modal = document.getElementById('rules-modal');
        const closeBtn = document.getElementsByClassName('close')[0];

        rulesBtn.onclick = () => modal.style.display = "block";
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = "none";
            }
        }
        
        // Кнопки в модальных окнах уведомлений
        document.getElementById('continue-btn').addEventListener('click', () => {
            document.getElementById('win-modal').style.display = "none";
        });
        
        document.getElementById('new-game-win').addEventListener('click', () => {
            document.getElementById('win-modal').style.display = "none";
            this.newGame();
        });
        
        document.getElementById('new-game-over').addEventListener('click', () => {
            document.getElementById('game-over-modal').style.display = "none";
            this.newGame();
        });
        
        // Закрытие модальных окон уведомлений
        const closeButtons = document.getElementsByClassName('close');
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', () => {
                closeButtons[i].closest('.modal').style.display = "none";
            });
        }
        
        // Сенсорные жесты
        this.setupTouchEvents();
    }
    
    // Обработка сенсорных жестов
    setupTouchEvents() {
        const gridContainer = document.querySelector('.grid-container');
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        gridContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            e.preventDefault(); // Предотвращаем стандартное поведение браузера
        }, { passive: false });
        
        gridContainer.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Предотвращаем скроллинг при движении пальца
        }, { passive: false });
        
        gridContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
            e.preventDefault(); // Предотвращаем стандартное поведение браузера
        }, { passive: false });
    }
    
    // Определение направления свайпа
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Минимальное расстояние для определения свайпа
        const minDistance = 50;
        
        // Определяем, был ли свайп достаточно длинным
        if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
            return; // Слишком короткий свайп
        }
        
        // Определяем направление свайпа
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Горизонтальный свайп
            if (deltaX > 0) {
                this.handleMobileControl('ArrowRight');
            } else {
                this.handleMobileControl('ArrowLeft');
            }
        } else {
            // Вертикальный свайп
            if (deltaY > 0) {
                this.handleMobileControl('ArrowDown');
            } else {
                this.handleMobileControl('ArrowUp');
            }
        }
    }
    
    // Обработка мобильного управления
    handleMobileControl(direction) {
        const event = { key: direction, preventDefault: () => {} };
        this.handleKeyPress(event);
    }

    newGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.history = [];
        this.winShown = false;
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
        
        // Отображаем новую случайную цитату при начале новой игры
        displayRandomQuote();
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    saveState() {
        this.history.push({
            grid: JSON.parse(JSON.stringify(this.grid)),
            score: this.score
        });
    }

    undo() {
        if (this.history.length) {
            const previousState = this.history.pop();
            this.grid = previousState.grid;
            this.score = previousState.score;
            this.updateDisplay();
        }
    }

    handleKeyPress(event) {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        
        event.preventDefault();
        this.saveState();
        
        let moved = false;
        const oldGrid = JSON.parse(JSON.stringify(this.grid));

        switch(event.key) {
            case 'ArrowUp': moved = this.moveUp(); break;
            case 'ArrowDown': moved = this.moveDown(); break;
            case 'ArrowLeft': moved = this.moveLeft(); break;
            case 'ArrowRight': moved = this.moveRight(); break;
        }

        if (moved) {
            this.addNewTile();
            this.updateDisplay();
            
            if (this.checkWin()) {
                this.showWinModal();
            } else if (this.checkGameOver()) {
                this.showGameOverModal();
            }
        } else {
            this.history.pop(); // Отменяем сохранение состояния, если ход не выполнен
        }
    }

    moveLeft() {
        return this.move(row => {
            const newRow = row.filter(cell => cell !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow.splice(i + 1, 1);
                }
            }
            while (newRow.length < 4) newRow.push(0);
            return newRow;
        });
    }

    moveRight() {
        return this.move(row => {
            const newRow = row.filter(cell => cell !== 0);
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow.splice(i - 1, 1);
                    i--;
                }
            }
            while (newRow.length < 4) newRow.unshift(0);
            return newRow;
        });
    }

    moveUp() {
        return this.move(col => {
            const newCol = col.filter(cell => cell !== 0);
            for (let i = 0; i < newCol.length - 1; i++) {
                if (newCol[i] === newCol[i + 1]) {
                    newCol[i] *= 2;
                    this.score += newCol[i];
                    newCol.splice(i + 1, 1);
                }
            }
            while (newCol.length < 4) newCol.push(0);
            return newCol;
        }, true);
    }

    moveDown() {
        return this.move(col => {
            const newCol = col.filter(cell => cell !== 0);
            for (let i = newCol.length - 1; i > 0; i--) {
                if (newCol[i] === newCol[i - 1]) {
                    newCol[i] *= 2;
                    this.score += newCol[i];
                    newCol.splice(i - 1, 1);
                    i--;
                }
            }
            while (newCol.length < 4) newCol.unshift(0);
            return newCol;
        }, true);
    }

    move(callback, isVertical = false) {
        let moved = false;
        const oldGrid = JSON.parse(JSON.stringify(this.grid));

        for (let i = 0; i < 4; i++) {
            const line = isVertical 
                ? this.grid.map(row => row[i])
                : [...this.grid[i]];
            
            const newLine = callback(line);
            
            for (let j = 0; j < 4; j++) {
                if (isVertical) {
                    if (this.grid[j][i] !== newLine[j]) {
                        moved = true;
                        this.grid[j][i] = newLine[j];
                    }
                } else {
                    if (this.grid[i][j] !== newLine[j]) {
                        moved = true;
                        this.grid[i][j] = newLine[j];
                    }
                }
            }
        }

        return moved;
    }

    checkWin() {
        return this.grid.some(row => row.some(cell => cell === 2048));
    }

    checkGameOver() {
        // Проверка наличия пустых ячеек
        if (this.grid.some(row => row.some(cell => cell === 0))) return false;

        // Проверка возможности объединения по горизонтали
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[i][j] === this.grid[i][j + 1]) return false;
            }
        }

        // Проверка возможности объединения по вертикали
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === this.grid[i + 1][j]) return false;
            }
        }

        return true;
    }

    updateDisplay() {
        const cells = document.getElementsByClassName('grid-cell');
        let index = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                cells[index].className = `grid-cell${value ? ` tile-${value}` : ''}`;
                cells[index].textContent = value || '';
                index++;
            }
        }

        document.getElementById('score').innerHTML = `<span class="marker">${this.score}</span>`;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        document.getElementById('best-score').innerHTML = `<span class="marker">${this.bestScore}</span>`;
    }
    
    // Показать модальное окно победы
    showWinModal() {
        // Проверяем, показывали ли мы уже окно победы
        if (!this.winShown) {
            document.getElementById('win-modal').style.display = "block";
            this.winShown = true;
        }
    }
    
    // Показать модальное окно окончания игры
    showGameOverModal() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over-modal').style.display = "block";
    }
}

// Запуск игры
new Game2048(); 