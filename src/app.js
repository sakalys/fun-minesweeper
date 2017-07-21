var Game = require('./game');

var game,
  rows = 10,
  cols = 15,
  mineCount = 20,
  w = 40;


window.setup = function () {
  game = new Game(rows, cols, w, mineCount);
  game.start();
};


window.draw = function () {
  game.draw();
};

window.mouseClicked = function () {
  //noinspection JSUnresolvedVariable
  game.handleClick(mouseX, mouseY);
};



