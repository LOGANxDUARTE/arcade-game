// OUR INITIAL STATE

let gameState = {
  canvas: new Array(30).fill(new Array(20).fill(''))
}

let snake;

let apple = {
  location: [],
};

let game;

let isGameRunning = false;

// ENDING THE GAME
function endGame() {
  clearInterval(game)
  isGameRunning = false;
}

// MAINTAINING GAME STATE
function buildInitialState() {
  isGameRunning = true;
  resetSnake();
  game = setInterval(tick, 200);
  renderState();
  buildSnake();
  buildApple();
}

// BUILD THE GAMESTATE
function renderState() {
  const canvasElement = $("#canvas");
  canvasElement.empty();

  gameState.canvas.forEach(function (row, rowIndex) {
    row.forEach(function (segment, segmentIndex) {
      const segmentElement = $(
        `<div class="segment" data-x="${rowIndex}" data-y="${segmentIndex}"></div>`
      );
      canvasElement.append(segmentElement);
    });
  });
}

// BUILDING THE SNAKE
function buildSnake() {
  $(".segment").removeClass("snake");
  
  const snakeHead = snake.body[0];
  const snakeHeadX = snakeHead[0];
  const snakeHeadY = snakeHead[1];

  const snakeTail = snake.body[snake.body.length - 1];
  const snakeTailX = snakeTail[0];
  const snakeTailY = snakeTail[1];

  const newSnakeHeadX = snakeHeadX + snake.nextDirection[0];
  const newSnakeHeadY = snakeHeadY + snake.nextDirection[1];
  const newSnakeHead = [newSnakeHeadX, newSnakeHeadY];

  // WHEN THE SNAKE EATS THE APPLE
  if (
    snakeHead[0] === apple.location[0] &&
    snakeHead[1] === apple.location[1]
  ) {
    console.log(snakeHead);
    const newSnakeTailX = snakeTailX + snake.nextDirection[0];
    const newSnakeTailY = snakeTailY + snake.nextDirection[1];
    const newSnakeTail = [newSnakeTailX, newSnakeTailY];
    snake.body.push(newSnakeTail);
    buildApple();
  }

  // WHEN THE SNAKE HITS THE BORDER
  if (
    newSnakeHead[0] > 29 ||
    newSnakeHead[0] < 0 ||
    newSnakeHead[1] > 19 ||
    newSnakeHead[1] < 0
  ) {
    console.log("that is a wall");
    endGame();
  }

  // MOVING THE SNAKE
  snake.body.unshift(newSnakeHead);
  snake.body.pop();

// SNAKE EATING ITSELF
  snake.body.forEach(function (coordinates) {
    const coordinateX = coordinates[0];
    const coordinateY = coordinates[1];
    const segmentElement = $(
      `[data-x="${coordinateX}"][data-y="${coordinateY}"]`
    );
    if (segmentElement.hasClass("snake")) {
      endGame();
    }
    segmentElement.addClass("snake");
  });
}

// SNAKE RETURNS TO SAME PLACE
function resetSnake() {
  snake = {
    body: [
      [10, 11],
      [10, 12],
      [10, 13],
      [10, 14],
    ],
    nextDirection: [0, -1],
  }
}

// BUILD THE APPLE AT RANDOM
function buildApple() {
  $(".segment").removeClass("apple");

  const location = [
    Math.floor(Math.random() * 30),
    Math.floor(Math.random() * 20),
  ];
  apple.location = location;
  const appleX = apple.location[0];
  const appleY = apple.location[1];
  const appleElement = $(`[data-x="${appleX}"][data-y="${appleY}"]`);

// DO NOT DROP THE APPLE ON SNAKE
  if (snake.body.indexOf(apple.location) > -1) {
    buildApple();
  } else {
    appleElement.addClass("apple");
  }
}

// TICK FUNCTION
function tick() {
  // renderState()
  buildSnake();
}

// CONTROLS AND KEYCODE TO START
$(window).on("keydown", function (event) {
  if (isGameRunning) {
    if (event.keyCode === 37 && snake.nextDirection[1] !== 1) {
      snake.nextDirection = [0, -1];
    }
    if (event.keyCode === 38 && snake.nextDirection[0] !== 1) {
      snake.nextDirection = [-1, -0];
    }
    if (event.keyCode === 39 && snake.nextDirection[1] !== -1) {
      snake.nextDirection = [0, 1];
    }
    if (event.keyCode === 40 && snake.nextDirection[0] !== -1) {
      snake.nextDirection = [1, 0];
    }
  } else if (event.keyCode === 13) {
    buildInitialState();
  }
});

// buildInitialState();
