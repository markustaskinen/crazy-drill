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

function create() {

    //nurkka josta kuva piirtyy ei ole sama atm = nihkeää
    //>>sijainnin tarkistus on vaikeeta!
    //näiden sijainnit on nyt määritetty tän rotation härön mukaan /:
    game.stage.backgroundColor = '#000000';

    leftArrow = game.add.sprite(200, 570, 'arrow');
    leftArrow.scale.setTo(0.2, 0.2);
    //leftArrow.pivot.x = 300; -- mitä pivot tekee?
    leftArrow.rotation += tau*3/4;

    upArrow = game.add.sprite(350, 510, 'arrow');
    upArrow.scale.setTo(0.2, 0.2);

    downArrow = game.add.sprite(550, 570, 'arrow');
    downArrow.scale.setTo(0.2, 0.2);
    downArrow.rotation += tau/2;

    rightArrow = game.add.sprite(700, 510, 'arrow');
    rightArrow.scale.setTo(0.2, 0.2);
    rightArrow.rotation += tau/4;
    
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
    leftTarget = game.add.sprite(200, 0, 'target');
    leftTarget.scale.setTo(0.2, 0.2);
    leftTarget.rotation += tau*3/4;
    
    upTarget = game.add.sprite(350, -60, 'target');
    upTarget.scale.setTo(0.2, 0.2);
    
    downTarget = game.add.sprite(550, 0, 'target');
    downTarget.scale.setTo(0.2, 0.2);
    downTarget.rotation += tau/2;
    
    rightTarget = game.add.sprite(700, -60, 'target');
    rightTarget.scale.setTo(0.2, 0.2);
    rightTarget.rotation += tau/4;
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
        if (leftTarget.y > 550 && leftTarget.y < 600) {
            leftArrow = game.add.sprite(200, 570, 'hit');
            leftArrow.scale.setTo(0.2, 0.2);
            leftArrow.rotation += tau*3/4;
            leftTarget.y += 100;
        } else {
            leftArrow = game.add.sprite(200, 570, 'miss');
            leftArrow.scale.setTo(0.2, 0.2);
            leftArrow.rotation += tau*3/4;
        }
        break;

    case 38:
        if (upTarget.y > 490 && upTarget.y < 540) {     
            upArrow = game.add.sprite(350, 510, 'hit');
            upArrow.scale.setTo(0.2, 0.2);
            upTarget.y += 100;
        } else {
            upArrow = game.add.sprite(350, 510, 'miss');
            upArrow.scale.setTo(0.2, 0.2); 
        }
        break;

    case 39:
        if (rightTarget.y > 490 && rightTarget.y < 540) {
            rightArrow = game.add.sprite(700, 510, 'hit');
            rightArrow.scale.setTo(0.2, 0.2);
            rightArrow.rotation += tau/4;
            rightTarget.y += 100;
        } else {
            rightArrow = game.add.sprite(700, 510, 'miss');
            rightArrow.scale.setTo(0.2, 0.2);
            rightArrow.rotation += tau/4; 
        }
        break;

    case 40:
        if (downTarget.y > 550 && downTarget.y < 600) {
            downArrow = game.add.sprite(550, 570, 'hit');
            downArrow.scale.setTo(0.2, 0.2);
            downArrow.rotation += tau/2;
            downTarget.y += 100;
        } else {
            downArrow = game.add.sprite(550, 570, 'miss');
            downArrow.scale.setTo(0.2, 0.2);
            downArrow.rotation += tau/2; 
        }
        break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function (e) {
    switch (e.which) {
    case 37: // left
        leftArrow = game.add.sprite(200, 570, 'arrow');
        leftArrow.scale.setTo(0.2, 0.2);
        leftArrow.rotation += tau*3/4;
        break;

    case 38:
        upArrow = game.add.sprite(350, 510, 'arrow');
        upArrow.scale.setTo(0.2, 0.2);
        break;

    case 39:
        rightArrow = game.add.sprite(700, 510, 'arrow');
        rightArrow.scale.setTo(0.2, 0.2);
        rightArrow.rotation += tau*1/4;
        break;

    case 40:
        downArrow = game.add.sprite(550, 570, 'arrow');
        downArrow.scale.setTo(0.2, 0.2);
        downArrow.rotation += tau/2;
        break;

    default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
