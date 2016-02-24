var Main = (function () {
    function Main() {
        this.paddleHeight = 10;
        this.paddleWidth = 75;
    }
    Main.prototype.init = function () {
        Main.canvas = document.getElementById("gameCanvas");
        Main.canvas.width = 480;
        Main.canvas.height = 320;
        Main.context = Main.canvas.getContext("2d");
        new Input().init();
        Main.ball = new Ball(10);
        Main.paddle = new Paddle(0, Main.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
        Main.level1 = new Level(3, 5, 75, 20, 10, 30, 30);
    };
    Main.prototype.update = function () {
        Main.ball.update();
        Main.paddle.update();
        Main.level1.update();
    };
    Main.prototype.draw = function () {
        Main.context.clearRect(0, 0, Main.canvas.width, Main.canvas.height);
        Main.ball.draw();
        Main.paddle.draw();
        Main.level1.draw();
    };
    return Main;
}());
var Input = (function () {
    function Input() {
    }
    Input.prototype.init = function () {
        Input.leftKeyIsDown = false;
        Input.rightKeyIsDown = false;
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
    };
    Input.prototype.keyDownHandler = function (e) {
        if (e.keyCode === 37) {
            Input.leftKeyIsDown = true;
        }
        else if (e.keyCode === 39) {
            Input.rightKeyIsDown = true;
        }
    };
    Input.prototype.keyUpHandler = function (e) {
        if (e.keyCode === 37) {
            Input.leftKeyIsDown = false;
        }
        else if (e.keyCode === 39) {
            Input.rightKeyIsDown = false;
        }
    };
    return Input;
}());
var Ball = (function () {
    function Ball(radius, x, y) {
        this.velocity = {
            x: 2,
            y: -2
        };
        this.x = x || Main.canvas.width / 2;
        this.y = y || Main.canvas.height - radius - 20;
        this.radius = radius;
    }
    Ball.prototype.update = function () {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x - this.radius <= 0 || this.x + this.radius >= Main.canvas.width) {
            this.velocity.x *= -1;
        }
        if (this.y - this.radius <= 0) {
            this.velocity.y *= -1;
        }
        if (this.x - this.radius > Main.paddle.x && this.x + this.radius < Main.paddle.x + Main.paddle.width && this.y + this.radius > Main.paddle.y && this.y - this.radius < Main.paddle.y + Main.paddle.height) {
            this.velocity.y *= -1;
        }
        else if (this.y - this.radius >= Main.canvas.height) {
            document.location.reload();
        }
    };
    ;
    Ball.prototype.draw = function () {
        Main.context.beginPath();
        Main.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        Main.context.fillStyle = "#0095DD";
        Main.context.fill();
        Main.context.closePath();
    };
    return Ball;
}());
var Paddle = (function () {
    function Paddle(x, y, width, height) {
        this.velocity = {
            x: 7,
            y: 0
        };
        this.x = Main.canvas.width / 2 - width / 2;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Paddle.prototype.update = function () {
        if (Input.leftKeyIsDown) {
            this.x -= this.velocity.x;
        }
        else if (Input.rightKeyIsDown) {
            this.x += this.velocity.x;
        }
        if (this.x <= 0 && Input.leftKeyIsDown) {
            Input.leftKeyIsDown = false;
            this.x = 0;
        }
        if (this.x + this.width >= Main.canvas.width && Input.rightKeyIsDown) {
            Input.rightKeyIsDown = false;
            this.x = Main.canvas.width - this.width;
        }
    };
    Paddle.prototype.draw = function () {
        Main.context.beginPath();
        Main.context.fillRect(this.x, this.y, this.width, this.height);
        Main.context.fillStyle = "#0095DD";
        Main.context.fill();
        Main.context.closePath();
    };
    return Paddle;
}());
var Level = (function () {
    function Level(rows, cols, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft) {
        this.x = 0;
        this.y = 0;
        this.rows = rows;
        this.cols = cols;
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickPadding = brickPadding;
        this.brickOffsetTop = brickOffsetTop;
        this.brickOffsetLeft = brickOffsetLeft;
        for (var c = 0; c < this.cols; c++) {
            Level.bricks[c] = [];
            for (var r = 0; r < rows; r++) {
                Level.bricks[c][r] = { x: 0, y: 0, status: true };
            }
        }
    }
    Level.prototype.update = function () {
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var b = Level.bricks[c][r];
                if (b.status === true) {
                    if (Main.ball.x + Main.ball.radius > b.x && Main.ball.x - Main.ball.radius < b.x + this.brickWidth && Main.ball.y + Main.ball.radius > b.y && Main.ball.y - Main.ball.radius < b.y + this.brickHeight) {
                        Main.ball.velocity.y *= -1;
                        b.status = false;
                    }
                }
            }
        }
    };
    Level.prototype.draw = function () {
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                if (Level.bricks[c][r].status === true) {
                    var currentBrickX = (c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft);
                    var currentBrickY = (r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop);
                    Level.bricks[c][r].x = currentBrickX;
                    Level.bricks[c][r].y = currentBrickY;
                    Main.context.beginPath();
                    Main.context.rect(currentBrickX, currentBrickY, this.brickWidth, this.brickHeight);
                    Main.context.fillStyle = "#0095DD";
                    Main.context.fill();
                    Main.context.closePath();
                }
            }
        }
    };
    Level.bricks = [];
    return Level;
}());
window.onload = function () {
    var game = new Main();
    game.init();
    var gameLoop = function () {
        game.update();
        game.draw();
        requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
};
