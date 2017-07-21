import {Game} from "./game";

let game;

window.setup = function () {
  game = new Game(10, 15, 40, 20);
  game.start();
};


window.draw = function () {
  game.draw();
};

window.mouseClicked = function () {
  //noinspection JSUnresolvedVariable
  game.handleClick(mouseX, mouseY);
};



