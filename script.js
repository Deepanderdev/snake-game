const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let intervalId;

document.addEventListener('keydown', changeDirection);

function setup() {
    snake = new Snake();
    food = new Food();
    food.spawn();
    intervalId = setInterval(gameLoop, 100);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.update();
    if (snake.checkCollision() || snake.checkBorder()) {
        gameOver();
        return;
    }

    if (snake.eat(food)) {
        food.spawn();
        score++;
    }

    snake.draw();
    food.draw();
}

function changeDirection(event) {
    const key = event.keyCode;
    switch (key) {
        case 37:
            if (snake.direction !== 'RIGHT') snake.setDirection('LEFT');
            break;
        case 38:
            if (snake.direction !== 'DOWN') snake.setDirection('UP');
            break;
        case 39:
            if (snake.direction !== 'LEFT') snake.setDirection('RIGHT');
            break;
        case 40:
            if (snake.direction !== 'UP') snake.setDirection('DOWN');
            break;
    }
}

function gameOver() {
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = `Score: ${score}`;
    clearInterval(intervalId);
}

class Snake {
    constructor() {
        this.body = [{ x: 2 * scale, y: 2 * scale }];
        this.direction = 'RIGHT';
        this.newDirection = 'RIGHT';
    }

    setDirection(direction) {
        this.newDirection = direction;
    }

    update() {
        this.direction = this.newDirection;
        let head = { ...this.body[0] };

        switch (this.direction) {
            case 'LEFT':
                head.x -= scale;
                break;
            case 'UP':
                head.y -= scale;
                break;
            case 'RIGHT':
                head.x += scale;
                break;
            case 'DOWN':
                head.y += scale;
                break;
        }

        this.body.unshift(head);
        if (!this.eat(food)) {
            this.body.pop(); 
        }
    }

    draw() {
        ctx.fillStyle = 'white';
        this.body.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, scale, scale);
        });
    }

    eat(food) {
        const head = this.body[0];
        if (head.x === food.x && head.y === food.y) {
            return true;
        }
        return false;
    }

    checkCollision() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    checkBorder() {
        const head = this.body[0];
        return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    }
}

class Food {
    constructor() {
        this.x;
        this.y;
    }

    spawn() {
        this.x = Math.floor(Math.random() * columns) * scale;
        this.y = Math.floor(Math.random() * rows) * scale;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

setup();
