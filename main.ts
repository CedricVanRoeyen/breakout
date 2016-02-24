class Main {
  paddleWidth: number;
  paddleHeight: number;

  static canvas: HTMLCanvasElement;
  static context: CanvasRenderingContext2D;

  static ball: Ball;

  static paddle: Paddle;

  static level1: Level;

  constructor() {
    this.paddleWidth = 75;
    this.paddleHeight = 10;
  }

  init(): void {
    Main.canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
    Main.canvas.width = 480;
    Main.canvas.height = 320;
    Main.context = Main.canvas.getContext("2d");

    new Input().init();

    Main.ball = new Ball(10);
    Main.paddle = new Paddle(0, Main.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);

    Main.level1 = new Level(3, 5, 75, 20, 10, 30, 30);
  }

  update(): void {
    Main.ball.update();
    Main.paddle.update();
    Main.level1.update();
  }

  draw(): void {
    Main.context.clearRect(0, 0, Main.canvas.width, Main.canvas.height);
    Main.ball.draw();
    Main.paddle.draw();
    Main.level1.draw();
  }
}

class Input {
  static leftKeyIsDown: boolean;
  static rightKeyIsDown: boolean;

  init(): void {
    Input.leftKeyIsDown = false;
    Input.rightKeyIsDown = false;

    document.addEventListener("keydown", this.keyDownHandler, false);
    document.addEventListener("keyup", this.keyUpHandler, false);
  }

  keyDownHandler(e): void {
    if (e.keyCode === 37) {
      Input.leftKeyIsDown = true;
    }
    else if (e.keyCode === 39) {
      Input.rightKeyIsDown = true;
    }
  }

  keyUpHandler(e): void {
    if (e.keyCode === 37) {
      Input.leftKeyIsDown = false;
    }
    else if (e.keyCode === 39) {
      Input.rightKeyIsDown = false;
    }
  }
}

class Ball {
  x: number;
  y: number;
  radius: number;
  // ball velocity
  velocity = {
    x: 2,
    y: -2
  };

  constructor(radius: number, x?: number, y?: number) {
    this.x = x || Main.canvas.width / 2;
    this.y = y || Main.canvas.height - radius - 20;
    this.radius = radius;
  }

  // updating the ball
  update(): void {
    // updating the positions First
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // checking for boundrie collisions
    // left and right
    if (this.x - this.radius <= 0 || this.x + this.radius >= Main.canvas.width) {
      this.velocity.x *= -1;
    }
    // top
    if (this.y - this.radius <= 0) {
      this.velocity.y *= -1;
    }

    // paddle collision
    if (this.x - this.radius > Main.paddle.x && this.x + this.radius < Main.paddle.x + Main.paddle.width && this.y + this.radius > Main.paddle.y && this.y - this.radius < Main.paddle.y + Main.paddle.height) {
      this.velocity.y *= -1;
    }
    // bottom => gameOver
    else if (this.y - this.radius >= Main.canvas.height) {
    /*  Main.ball.velocity.x = 0;
      Main.ball.velocity.y = 0;
      Main.ball.y = Main.canvas.height - 40;
      Main.ball.x = Main.canvas.width/2;

      document.location.reload();*/
      new Main().init();
    }
  };

  // drawign the ball
  draw(): void {
    Main.context.beginPath();
    Main.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    Main.context.fillStyle = "#0095DD";
    Main.context.fill();
    Main.context.closePath();
  }
}

class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity = {
    x: 7,
    y: 0
  };

  constructor(x: number, y: number, width: number, height: number) {
    this.x = Main.canvas.width / 2 - width / 2;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(): void {
    // checking the input for the movement
    if (Input.leftKeyIsDown) {
      this.x -= this.velocity.x;
    }
    else if (Input.rightKeyIsDown) {
      this.x += this.velocity.x;
    }

    // collision with bounds
    // left
    if (this.x <= 0 && Input.leftKeyIsDown) {
      Input.leftKeyIsDown = false;
      this.x = 0;
    }
    // right
    if (this.x + this.width >= Main.canvas.width && Input.rightKeyIsDown) {
      Input.rightKeyIsDown = false;
      this.x = Main.canvas.width - this.width;
    }
  }
  draw(): void {
    Main.context.beginPath();
    Main.context.fillRect(this.x, this.y, this.width, this.height);
    Main.context.fillStyle = "#0095DD";
    Main.context.fill();
    Main.context.closePath();
  }
}

class Level {
  x: number;
  y: number;

  rows: number;
  cols: number;
  brickWidth: number;
  brickHeight: number;
  brickPadding: number;
  brickOffsetTop: number;
  brickOffsetLeft: number;

  static bricks = [];

  constructor(rows: number, cols: number, brickWidth: number, brickHeight: number, brickPadding: number, brickOffsetTop: number, brickOffsetLeft) {
    this.x = 0;
    this.y = 0;

    this.rows = rows;
    this.cols = cols;
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.brickPadding = brickPadding;
    this.brickOffsetTop = brickOffsetTop;
    this.brickOffsetLeft = brickOffsetLeft;

    for (var c: number = 0; c < this.cols; c++) {
      Level.bricks[c] = [];
      for (var r: number = 0; r < rows; r++) {
        Level.bricks[c][r] = { x: 0, y: 0, status: true };
      }
    }
  }

  update(): void {
    for (var c: number = 0; c < this.cols; c++) {
      for (var r: number = 0; r < this.rows; r++) {
        var b = Level.bricks[c][r];
        if (b.status === true) {
          if (Main.ball.x + Main.ball.radius > b.x && Main.ball.x - Main.ball.radius < b.x + this.brickWidth && Main.ball.y + Main.ball.radius > b.y && Main.ball.y - Main.ball.radius < b.y + this.brickHeight) {
            Main.ball.velocity.y *= -1;
            b.status = false;
          }
        }
      }
    }
  }

  draw(): void {
    for (var c: number = 0; c < this.cols; c++) {
      for (var r: number = 0; r < this.rows; r++) {
        if (Level.bricks[c][r].status === true) {
          var currentBrickX = (c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft);
          var currentBrickY = (r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop);
          Level.bricks[c][r].x = currentBrickX;
          Level.bricks[c][r].y = currentBrickY;
          // drawing the actual brick
          Main.context.beginPath();
          Main.context.rect(currentBrickX, currentBrickY, this.brickWidth, this.brickHeight);
          Main.context.fillStyle = "#0095DD";
          Main.context.fill();
          Main.context.closePath();
        }
      }
    }
  }
}

window.onload = function() {
  var game= new Main();
  game.init();
  var gameLoop = function(): void {
    game.update();
    game.draw();
    requestAnimationFrame(gameLoop);
  };
  requestAnimationFrame(gameLoop);
};
