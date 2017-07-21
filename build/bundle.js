/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(1);


let game;

function newGame() {
  game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* Game */](10, 15, 20);
  game.boot();
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

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cell__ = __webpack_require__(2);


class Game {
  constructor(rows, cols, mineCount) {
    this._rows = rows;
    this._cols = cols;
    this._mineCount = mineCount;

    this._cellWidth = 40;
    this._cells = [];
    this._booted = false;
  }

  boot() {

    //noinspection JSUnresolvedFunction
    createCanvas(601, 401);
    background(0, 0, 0);

    const mineLocations = this._makeMineLocations(),
          w = this.getCellWidth();

    for (let i = 0; i < this.getRowCount(); i++) {
      for (let j = 0; j < this.getColCount(); j++) {
        let isMined = mineLocations.indexOf(this._getIndex(i, j)) > -1;

        this._cells.push(new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](j * w, i * w, w, isMined));
      }
    }

    this._cells.forEach(cell => {
      cell.setMinesAround(this._countMinesAround(cell));
    });

    this._cells.forEach(cell => {
      cell.setNeighbours(this._findNeighbours(cell));
    });

    this._booted = true;
  }

  isBooted() {
    return this._booted;
  }

  _findNeighbours(cell) {
    const neighbours = [];

    for (let rowDelta = -1; rowDelta < 2; rowDelta++) {
      let w = this.getCellWidth();
      let x = cell.x;
      let y = cell.y;

      const row = rowDelta + y / w;
      if (row < 0 || row >= this.getRowCount()) {
        continue;
      }

      for (let colDelta = -1; colDelta < 2; colDelta++) {
        const col = colDelta + x / w;
        if (col < 0 || col >= this.getColCount() || rowDelta === 0 && colDelta === 0) {
          continue;
        }

        neighbours.push(this._getCell(row, col));
      }
    }

    return neighbours;
  }

  _countMinesAround(cell) {
    return this._findNeighbours(cell).reduce(function (count, cell) {
      const number = cell.isMine() ? 1 : 0;
      return number + count;
    }, 0);
  }

  _getCell(row, col) {
    const index = this._getIndex(row, col);

    if (index === null) {
      return null;
    }

    return this._cells[index];
  }

  _getIndex(row, col) {
    const rows = this.getRowCount(),
          cols = this.getColCount();

    if (row >= rows || col >= cols) {
      return null;
    }

    return cols * row + col;
  }

  getRowCount() {
    return this._rows;
  }

  getColCount() {
    return this._cols;
  }

  getCellWidth() {
    return this._cellWidth;
  }

  getMineCount() {
    return this._mineCount;
  }

  _makeMineLocations() {

    const incrementingArray = [];
    for (let nr = 0; nr < this.getRowCount() * this.getColCount(); nr++) {
      incrementingArray.push(nr);
    }

    //noinspection JSUnresolvedFunction
    const randomNumbers = shuffle(incrementingArray);

    randomNumbers.splice(this.getMineCount());

    return randomNumbers;
  }

  draw() {
    this._cells.forEach(function (cell) {
      cell.draw();
    });
  }

  gameOver() {
    console.log('Game over');
    this._cells.forEach(function (cell) {
      cell.reveal();
    });
  }

  handleClick(x, y) {

    const w = this.getCellWidth(),
          row = (y - y % w) / w,
          col = (x - x % w) / w,
          cell = this._getCell(row, col);

    if (!cell) {
      return;
    }

    this._fullReveal(cell);
  }

  _fullReveal(cell) {

    if (cell.isRevealed()) {
      return;
    }

    if (!cell.reveal()) {
      return this.gameOver();
    }

    if (cell.getMinesAroundCount()) {
      return;
    }

    const arr = cell.getNeighbours();

    arr.forEach(c => {

      if (!c.isRevealed()) {

        const minesAround = c.getMinesAroundCount();

        if (!minesAround) {
          this._fullReveal(c);
        } else {
          c.reveal();
        }
      }
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Cell {

  constructor(x, y, w, mine) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._mine = mine;
    this._revealed = false;
    this._minesAround = 0;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  draw() {
    fill(this._revealed ? 215 : 245);
    this._revealed ? stroke(140) : stroke(200);
    rect(this._x, this._y, this._w, this._w);

    if (this._revealed) {

      if (this._mine) {
        fill(200, 30, 40);
        let half = this._w / 2;

        ellipse(this._x + half, this._y + half, half, half);
      } else if (this._minesAround) {
        textAlign(CENTER);
        fill(100, 90, 190);
        textSize(20);
        text(this._minesAround, this._x + 3, this._y + this._w / 2 - 11, this._w, this._w);
      }
    }
  }

  getMinesAroundCount() {
    return this._minesAround;
  }

  setNeighbours(arr) {
    this._neighbours = arr;
  }

  getNeighbours() {
    return this._neighbours;
  }

  reveal() {
    this._revealed = true;

    return !this._mine;
  }

  isRevealed() {
    return this._revealed;
  }

  setMinesAround(count) {
    this._minesAround = count;
  }

  isMine() {
    return this._mine;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Cell;


/***/ })
/******/ ]);