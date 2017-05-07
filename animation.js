var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'crazy-drill', { preload: preload, create: create, update: update, render: render });

function preload() {

    //kuva alarivillä näkyville nuolille joita kohteet lähestyvät(liian isot atm)
    //joku resize tehtävä
    game.load.image('arrow', 'assets/arrow.png');
    game.load.image('target', 'assets/target.png');
    game.load.image('hit', 'assets/hit.png');
    game.load.image('miss', 'assets/miss.png');
}

var timer = 0;
var randomInteger = 0;
var tau = Math.PI*2

var t = 150;
var left = 250;
var leftColumn = 250;
var hitMargin = 30;
var targetHeight = 540;


var leftArrow;
var upArrow;
var downArrow;
var rightArrow;

var targets = {};
var arrows = { up:[], down:[], left:[], right:[] };

var leftActive = false;
var upActive = false;
var downActive = false;
var rightActive = false;

function getRandomInteger(min, max) {
    randomInteger = Math.floor((Math.random() * max) + min);
}

function createSprite(height, direction, sprite) {
  x = { left:leftColumn, up:leftColumn+t, down:leftColumn+t*2, right: leftColumn+t*3 }[direction];
  rotation = { up:0, down:tau/2, left:tau*3/4, right: tau/4 }[direction];
  sprite = game.add.sprite(x, height, sprite);
  sprite.scale.setTo(0.2, 0.2);
  // pivot kertoo akselin jonka ympäri sprite pyörii, asetetaan se keskelle
  // nuolta
  sprite.pivot.x = 150;
  sprite.pivot.y = 150;
  sprite.rotation += rotation;
  return sprite
}

function create() {

    game.stage.backgroundColor = '#000000';

    targets['left'] = createSprite(targetHeight, 'left', 'arrow');
    targets['up'] = createSprite(targetHeight, 'up', 'arrow');
    targets['down'] = createSprite(targetHeight, 'down', 'arrow');
    targets['right'] = createSprite(targetHeight, 'right', 'arrow')

    game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, active, this);
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
    height = -60;
    arrows[direction].push(createSprite(height, direction, 'target'));
}

function update() {
  for (direction in arrows) {
    for ( var i=0; i < arrows[direction].length; i++ ) {
      arrows[direction][i].y += 1;
    }
  }
}

function render() {

}

function handleKeyPress(direction) {
  arrow = arrows[direction][0]
  // If the arrow is close enough to the target
  if (arrow.y > targetHeight - hitMargin && arrow.y < targetHeight + hitMargin) {
    targets[direction].loadTexture('hit');
    arrow.y = 1000
    arrow.destroy()
    arrows[direction].shift()
  } else { // if player missed the target
    targets[direction].loadTexture('miss');
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
        targets['left'].loadTexture('arrow');
        break;

    case 38:
        targets['up'].loadTexture('arrow');
        break;

    case 39:
        targets['right'].loadTexture('arrow');
        break;

    case 40:
        targets['down'].loadTexture('arrow');
        break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
