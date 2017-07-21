import {Game} from "./game";

let game;

function newGame() {
  game = new Game(10, 15, 20);
  game.start();
}

window.newGame = newGame;

window.setup = function () {
  newGame();
};


window.draw = function () {
  game.draw();
};

window.mouseClicked = function () {
  //noinspection JSUnresolvedVariable
  game.handleClick(mouseX, mouseY);
};



