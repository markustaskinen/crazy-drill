var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'crazy-drill', { preload: preload, create: create, update: update, render: render });

function preload() {

    //kuva alarivillä näkyville nuolille joita kohteet lähestyvät(liian isot atm)
    //joku resize tehtävä
    game.load.image('arrow', 'assets/arrow.png');
    game.load.image('target', 'assets/target.png');
    game.load.image('hit', 'assets/hit.png');
}

var timer = 0;
var randomInteger = 0;

var leftArrow;
var upArrow;
var downArrow;
var rightArrow;

var leftTarget;
var upTarget;
var downTarget;
var rightTarget;

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
    leftArrow.rotation += 4.7;

    upArrow = game.add.sprite(350, 510, 'arrow');
    upArrow.scale.setTo(0.2, 0.2);
    //upArrow.pivot.y = 100;

    downArrow = game.add.sprite(550, 570, 'arrow');
    downArrow.scale.setTo(0.2, 0.2);
    downArrow.rotation += 3.1;

    rightArrow = game.add.sprite(700, 510, 'arrow');
    rightArrow.scale.setTo(0.2, 0.2);
    rightArrow.rotation += 1.5;
    
    targets()
}

function targets() {
    
    //tähän pitäis suunnitella vielä random logiikka
    //joku array tehtävä jossa säilöö ja poistaa näkyviä kohteita?
    leftTarget = game.add.sprite(200, 0, 'target');
    leftTarget.scale.setTo(0.2, 0.2);
    leftTarget.rotation += 4.7;
    
    upTarget = game.add.sprite(350, -60, 'target');
    upTarget.scale.setTo(0.2, 0.2);
    
    downTarget = game.add.sprite(550, 0, 'target');
    downTarget.scale.setTo(0.2, 0.2);
    downTarget.rotation += 3.1;
    
    rightTarget = game.add.sprite(700, -60, 'target');
    rightTarget.scale.setTo(0.2, 0.2);
    rightTarget.rotation += 1.5;
}

function update() {

    leftTarget.y += 1;
    upTarget.y += 1;
    downTarget.y += 1;
    rightTarget.y += 1;

}

function render() {
    
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: 
            leftArrow = game.add.sprite(200, 570, 'hit');
            leftArrow.scale.setTo(0.2, 0.2);
            leftArrow.rotation += 4.7;
        break;

        case 38: 
            upArrow = game.add.sprite(350, 510, 'hit');
            upArrow.scale.setTo(0.2, 0.2);
        break;

        case 39:
            rightArrow = game.add.sprite(700, 510, 'hit');
            rightArrow.scale.setTo(0.2, 0.2);
            rightArrow.rotation += 1.5;
        break;

        case 40: 
            downArrow = game.add.sprite(550, 570, 'hit');
            downArrow.scale.setTo(0.2, 0.2);
            downArrow.rotation += 3.1;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function(e) {
    switch(e.which) {
        case 37: // left
        leftArrow = game.add.sprite(200, 570, 'arrow');
        leftArrow.scale.setTo(0.2, 0.2);
        leftArrow.rotation += 4.7;
        break;

        case 38:
            upArrow = game.add.sprite(350, 510, 'arrow');
            upArrow.scale.setTo(0.2, 0.2);
        break;

        case 39:
            rightArrow = game.add.sprite(700, 510, 'arrow');
            rightArrow.scale.setTo(0.2, 0.2);
            rightArrow.rotation += 1.5;
        break;

        case 40: 
            downArrow = game.add.sprite(550, 570, 'arrow');
            downArrow.scale.setTo(0.2, 0.2);
            downArrow.rotation += 3.1;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
