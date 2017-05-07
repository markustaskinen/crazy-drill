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

var leftTarget;
var upTarget;
var downTarget;
var rightTarget;

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


    leftArrow = createSprite(targetHeight, 'left', 'arrow');
    upArrow = createSprite(targetHeight, 'up', 'arrow');
    downArrow = createSprite(targetHeight, 'down', 'arrow');
    rightArrow = createSprite(targetHeight, 'right', 'arrow')

    createTargets();
    game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, active, this);
}

function active() {

    getRandomInteger(0,4);

    switch (randomInteger) {
        case 0:
            leftActive = true;
            break;
        case 1:
            upActive = true;
            break;
        case 2:
            downActive = true;
            break;
        case 3:
            rightActive = true;
            break;
    }
}

function createTargets() {

    //tähän pitäis suunnitella vielä random logiikka
    //joku array tehtävä jossa säilöö ja poistaa näkyviä kohteita?
    height = -60;

    leftTarget = createSprite(height, 'left', 'target');
    upTarget = createSprite(height, 'up', 'target');
    downTarget = createSprite(height, 'down', 'target');
    rightTarget = createSprite(height, 'right', 'target');
}

function update() {

    if (leftActive) {
        leftTarget.y += 1;
    }
    if (upActive) {
        upTarget.y += 1;
    }
    if (downActive) {
        downTarget.y += 1;
    }
    if (rightActive) {
        rightTarget.y += 1;
    }

}

function render() {

}

$(document).keydown(function (e) {
    switch (e.which) {
    case 37:
        if (leftTarget.y > targetHeight - hitMargin && leftTarget.y < targetHeight + hitMargin) {
            leftArrow = createSprite(targetHeight, 'left', 'hit');
            leftTarget.y += 100;
        } else {
            leftArrow = createSprite(targetHeight, 'left', 'miss');
        }
        break;

    case 38:
        if (upTarget.y > targetHeight - hitMargin && upTarget.y < targetHeight + hitMargin) {
            upArrow = createSprite(targetHeight, 'up', 'hit');
            upTarget.y += 100;
        } else {
            upArrow = createSprite(targetHeight, 'up', 'miss');
        }
        break;

    case 39:
        if (rightTarget.y > targetHeight - hitMargin && rightTarget.y < targetHeight + hitMargin) {
            rightArrow = createSprite(targetHeight, 'right', 'hit');
            rightTarget.y += 100;
        } else {
            rightArrow = createSprite(targetHeight, 'right', 'miss');
        }
        break;

    case 40:
        if (downTarget.y > targetHeight - hitMargin && downTarget.y < targetHeight + hitMargin) {
            downArrow = createSprite(targetHeight, 'down', 'hit');
            downTarget.y += 100;
        } else {
            downArrow = createSprite(targetHeight, 'down', 'miss');;
        }
        break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function (e) {
    switch (e.which) {
    case 37: // left
        leftArrow = createSprite(targetHeight, 'left', 'arrow');
        break;

    case 38:
        upArrow = createSprite(targetHeight, 'up', 'arrow');
        break;

    case 39:
        rightArrow = createSprite(targetHeight, 'right', 'arrow');
        break;

    case 40:
        downArrow = createSprite(targetHeight, 'down', 'arrow');
        break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
