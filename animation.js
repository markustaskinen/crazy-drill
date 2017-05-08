var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'crazy-drill', { preload: preload, create: create, update: update, render: render });

var basedir = '.'

function preload() {

    game.load.image('arrow', basedir + '/assets/arrow.png');
    game.load.image('target', basedir + '/assets/target.png');
    game.load.image('hit', basedir + '/assets/hit.png');
    game.load.image('miss', basedir + '/assets/miss.png');
    game.load.image('ground', basedir + '/assets/ground.png');
    game.load.image('drill', basedir + '/assets/drill.png');
    game.load.audio('background', [ basedir + '/assets/Vicious.mp3', basedir + '/assets/Vicious.ogg']);
    game.load.spritesheet('button', basedir + '/assets/button.png', 500, 400);
}

var timer = 0;
var randomInteger = 0;
var tau = Math.PI*2

var gameLength = 100 // How many arrows to spawn until the game is over

var t = 150;
var left = 250;
var leftColumn = 250;
var hitMargin = 30;
var targetHeight = 540;

var score = 0;
var drillPos = 80;
var gameOver = false;

var targets = {};
var arrows = { up:[], down:[], left:[], right:[] };
var deadArrows = [];
var ground;
var drill;

var scoreText;
var music;
var button;
var buttonText;

function getRandomInteger(min, max) {
    randomInteger = Math.floor((Math.random() * max) + min);
}

function createSprite(height, direction, sprite) {
  x = { left:leftColumn, up:leftColumn+t, down:leftColumn+t*2, right: leftColumn+t*3 }[direction];
  rotation = { up:0, down:tau/2, left:tau*3/4, right: tau/4 }[direction];
  sprite = game.add.image(x, height, sprite);
  sprite.scale.setTo(0.2, 0.2);
  // set the pivot point of the arrow, so that the arrow location does not
  // change when rotated
  sprite.pivot.x = 150;
  sprite.pivot.y = 150;
  sprite.rotation += rotation;
  return sprite
}

function create() {
    ground = game.add.tileSprite(0, 0, 800, 600, 'ground');
    music = game.add.audio('background');
    scoreText = game.add.text(10, 20, "Score " + score, {fill: "white"});
    targets['left'] = createSprite(targetHeight, 'left', 'target');
    targets['up'] = createSprite(targetHeight, 'up', 'target');
    targets['down'] = createSprite(targetHeight, 'down', 'target');
    targets['right'] = createSprite(targetHeight, 'right', 'target')
    scoreText = game.add.text(10, 20, "Score " + score, {fill: "white"})
    drill = game.add.sprite(70, drillPos, 'drill');
    startGame();
}

function startGame() {
  gameOver = false;
  score = 0;
  updateScore(0);
  music.play();
  game.time.events.repeat(Phaser.Timer.SECOND*3/4, gameLength, active, this);
  game.time.events.add(Phaser.Timer.SECOND*3/4 * gameLength + Phaser.Timer.SECOND*5, endGame, this);
}

function endGame() {
  music.stop()
  scoreText.setText("Game over! \nYour score was " + score)
  gameOver = true;
  button = game.add.button(game.world.centerX - 95, 300, 'button', actionOnClick, this, 2, 1, 0);
  buttonText = game.add.text(335, 335, "Play again");
}

function actionOnClick () {
  button.destroy()
  buttonText.destroy()
  startGame();
}

function active() {

    getRandomInteger(0,4);

    switch (randomInteger) {
        case 0:
            createArrow('left');
            break;
        case 1:
            createArrow('up');
            break;
        case 2:
            createArrow('down');
            break;
        case 3:
            createArrow('right');
            break;
    }
}

function createArrow(direction) {
    // creates an arrow outside the screen
    height = -60;
    arrows[direction].push(createSprite(height, direction, 'arrow'));
}

function updateScore(amount) {
  // adds the given amount to the score and updates the score text
  score = Math.max(score + amount, 0);
  scoreText.setText("Score " + score)
}

function updateDrill(amount) {
    drillPos = Math.min(Math.max(drillPos + amount, 80), 470);
    drill.y = drillPos;
}

function update() {

    if (!gameOver) {
        ground.tilePosition.y -= 2;
    }

  for (direction in arrows) {
    for ( var i=0; i < arrows[direction].length; i++ ) {
      arrows[direction][i].y += 3;
      // if arrow has passed the target, it is considered dead
      if (arrows[direction][i].y >= targetHeight + hitMargin) {
        deadArrows.push(arrows[direction].splice(i, 1)[0]);
        updateScore(-10)
        updateDrill(-3)
      }
    }
  }
  // keep dead arrows moving until they are no longer visible
  for ( var i=0; i < deadArrows.length; i++ ) {
    deadArrows[i].y += 3;
    if (deadArrows[i].y > game.height+30) {
      deadArrows.splice(i, 1)[0].destroy();
    }
  }

}

function render() {
}

function handleKeyPress(direction) {
  // the first arrow in the array is always the one closest to the target
  if (gameOver) {return} // if game has ended, do nothing
  arrow = arrows[direction][0]
  // If the arrow is close enough to the target
  if (typeof arrow !== 'undefined' && arrow.y > targetHeight - hitMargin && arrow.y < targetHeight + hitMargin) {
    targets[direction].loadTexture('hit');
    arrow.y = 1000
    arrow.destroy()
    arrows[direction].shift()
    updateScore(10)
    updateDrill(3)
  } else { // if player missed the arrow
    targets[direction].loadTexture('miss');
    updateScore(-10)
    updateDrill(-3)
  }
}

$(document).keydown(function (e) {
    switch (e.which) {
    case 37:
      handleKeyPress('left')
      break;

    case 38:
      handleKeyPress('up')
      break;

    case 39:
      handleKeyPress('right')
      break;

    case 40:
      handleKeyPress('down')
      break;
    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function (e) {
    switch (e.which) {
    case 37: // left
        targets['left'].loadTexture('target');
        break;

    case 38:
        targets['up'].loadTexture('target');
        break;

    case 39:
        targets['right'].loadTexture('target');
        break;

    case 40:
        targets['down'].loadTexture('target');
        break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
