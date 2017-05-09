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
    game.load.audio('hard', [basedir + '/assets/Exit_the_premises.mp3', basedir + '/assets/Exit_the_premises.ogg']);
    game.load.spritesheet('button', basedir + '/assets/button.png', 500, 400);
}

var timer = 0;
var randomInteger = 0;
var tau = Math.PI*2

var gameLength = 200; // How many arrows to spawn until the game is over
var bpm = 80; // Beats per minute
var arrowSpeed = 4;
var t = 150;
var left = 250;
var leftColumn = 250;
var hitMargin = 30;
var targetHeight = 540;

var score = 0;
var drillStartPos = 80;
var drillEndPos = 470;
var gameOver = true;

var targets = {};
var arrows = { up:[], down:[], left:[], right:[] };
var deadArrows = [];
var ground;
var drill;

var scoreText;
var music;
var button;
var buttonText;
var difficultyButton;
var difficultyText;
var helpText;
var helpString = "Syvemmältä maan uumenista saa paremmin \nlämpöä. Painele siis nuolinäppäimiä biisin \ntahtiin ja poraa niin syvälle kuin pystyt!";
var difficulty = 0;

function getRandomInteger(min, max) {
    return Math.floor((Math.random() * max) + min);
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

function startMenu() {
  scoreText.x = 10;
  updateScore(0)
  button = game.add.button(game.world.centerX - 95, 300, 'button', onPlayButtonClick, this, 2, 1, 0);
  buttonText = game.add.text(335, 335, "Aloita peli", {fill: "white"});
  difficultyButton = game.add.button(game.world.centerX, 250, 'button', changeDifficulty, this, 2, 1, 0);
  difficultyButton.pivot.x = 99;
  difficultyButton.pivot.y = 50;
  difficultyText = game.add.text(game.world.centerX - 50, 235, "", {fill: "white"});
  helpText = game.add.text(game.world.centerX - 200, 50, helpString, {fill: "white"})
  updateDifficulty();
}

function changeDifficulty() {
  difficulty ++;
  difficulty = difficulty%2;
  updateDifficulty();
}

function updateDifficulty() {
  switch (difficulty) {
    case 0:
      difficultyText.setText("Helppo");
      bpm = 160;
      gameLength = 200;
      arrowSpeed = 4;
      music = game.add.audio('background');
      break;
    case 1:
      difficultyText.setText("Vaikea");
      music = game.add.audio('hard');
      arrowSpeed = 7;
      gameLength = 300;
      bpm = 270;
      break;
  }
  // Always 10 frames margin to hit the target
  hitMargin = 10*arrowSpeed;
}

function create() {
    ground = game.add.tileSprite(0, 0, 800, 600, 'ground');
    scoreText = game.add.text(10, 20, "Pisteet " + score, {fill: "white"});
    targets['left'] = createSprite(targetHeight, 'left', 'target');
    targets['up'] = createSprite(targetHeight, 'up', 'target');
    targets['down'] = createSprite(targetHeight, 'down', 'target');
    targets['right'] = createSprite(targetHeight, 'right', 'target')
    drill = game.add.sprite(70, drillStartPos, 'drill');
    drawThermometer();
    startMenu();
}

function startGame() {
  helpText.destroy();
  arrowInterval = Phaser.Timer.SECOND*60/bpm;
  gameOver = false;
  score = 0;
  updateScore(0);
  music.play();
  game.time.events.repeat(arrowInterval, gameLength, active, this);
  game.time.events.add(arrowInterval * gameLength + Phaser.Timer.SECOND*5, endGame, this);
}

function endGame() {
  music.stop();
  scoreText.setText("Peli loppui! \nSait " + score+ " pistettä!");
  scoreText.x = game.world.centerX - 95;
  gameOver = true;
  button = game.add.button(game.world.centerX - 95, 300, 'button', onButtonClick, this, 2, 1, 0);
  buttonText = game.add.text(335, 335, "Päävalikko", {fill: "white"});
}

function onButtonClick () {
  button.destroy()
  buttonText.destroy()
  startMenu();
}

function onPlayButtonClick () {
  button.destroy()
  buttonText.destroy()
  difficultyButton.destroy()
  difficultyText.destroy()
  startGame();
}

function active() {
    var randomInteger = getRandomInteger(0,4);
    var notUsed = [0,1,2,3]
    notUsed.splice(randomInteger, 1)
    var secondRandomInteger = notUsed[getRandomInteger(0,3)];
    createArrow(randomInteger);
}

function createArrow(direction) {
    // creates an arrow outside the screen
    direction = ['left', 'up', 'down', 'right'][direction];
    height = -60;
    arrows[direction].push(createSprite(height, direction, 'arrow'));
}

function updateScore(amount) {
  // adds the given amount to the score and updates the score text
  score = Math.max(score + amount, 0);
  updateDrill()
  scoreText.setText("Pisteet " + score)
}

function updateDrill() {
    var maxScore = gameLength*10
    drillPos = drillStartPos + score/maxScore*(drillEndPos - drillStartPos)
    drill.y = drillPos;
}

function drawThermometer() {
  var graphics = game.add.graphics(50, 100);
  for (var i=3; i <= 483; i+=20) {
    graphics.lineStyle(5, Phaser.Color.getColor(120+i/4,0,240-i/2), 1);
    graphics.moveTo(3,i);
    graphics.lineTo(30,i);
  }
}

function update() {

    if (!gameOver) {
        ground.tilePosition.y -= 2;
    }

  for (direction in arrows) {
    for ( var i=0; i < arrows[direction].length; i++ ) {
      arrows[direction][i].y += arrowSpeed;
      // if arrow has passed the target, it is considered dead
      if (arrows[direction][i].y >= targetHeight + hitMargin) {
        deadArrows.push(arrows[direction].splice(i, 1)[0]);
        updateScore(-10)
      }
    }
  }
  // keep dead arrows moving until they are no longer visible
  for ( var i=0; i < deadArrows.length; i++ ) {
    deadArrows[i].y += arrowSpeed;
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
  } else { // if player missed the arrow
    targets[direction].loadTexture('miss');
    updateScore(-10)
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
