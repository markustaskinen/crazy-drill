var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'crazy-drill', { preload: preload, create: create, update: update, render: render });

function preload() {

    //kuva alarivillä näkyville nuolille joita kohteet lähestyvät(liian isot atm)
    //joku resize tehtävä
    game.load.image('arrow', 'assets/arrow.png');

}

var leftArrow;
var upArrow;
var downArrow;
var rightArrow;

function create() {

    
    //nurkka josta kuva piirtyy ei ole sama atm = nihkeää
    game.stage.backgroundColor = '#3e5f96';

    leftArrow = game.add.sprite(100, 400, 'arrow');
    //leftArrow.pivot.x = 300; -- mitä pivot tekee?
    leftArrow.rotation += 4.7;

    upArrow = game.add.sprite(600, 150, 'arrow');
    //upArrow.pivot.y = 100;

    downArrow = game.add.sprite(200, 450, 'arrow');
    downArrow.rotation += 3.1;

    rightArrow = game.add.sprite(600, 100, 'arrow');
    rightArrow.rotation += 1.5;

}

function update() {



}

function render() {
    
}