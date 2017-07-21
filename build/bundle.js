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

window.setup = function () {
  game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* Game */](10, 15, 20);
  game.start();
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
    this._cellWidth = 40;
    this._mineCount = mineCount;
    this._cells = [];
  }

  start() {

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
  }

  _findNeighbours(cell) {
    const neighbours = [];

    for (let rowDelta = -1; rowDelta < 2; rowDelta++) {
      const row = rowDelta + cell.y / cell.w;
      if (row < 0 || row >= this.getRowCount()) {
        continue;
      }

      for (let colDelta = -1; colDelta < 2; colDelta++) {
        const col = colDelta + cell.x / cell.w;
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

    if (cell.revealed) {
      return;
    }

    if (!cell.reveal()) {
      return this.gameOver();
    }

    if (cell.minesAround) {
      return;
    }

    const arr = cell.getNeighbours();

    arr.forEach(c => {
      if (!c.revealed) {
        if (!c.minesAround) {
          this._fullReveal(c);
        } else if (c.minesAround) {
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
    this.x = x;
    this.y = y;
    this.w = w;
    this.revealed = false;
    this.mine = mine;
    this.minesAround = 0;
  }

  draw() {
    fill(this.revealed ? 215 : 245);
    this.revealed ? stroke(140) : stroke(200);
    rect(this.x, this.y, this.w, this.w);

    if (this.revealed) {

      if (this.mine) {
        fill(200, 30, 40);
        let half = this.w / 2;

        ellipse(this.x + half, this.y + half, half, half);
      } else if (this.minesAround) {
        textAlign(CENTER);
        fill(100, 90, 190);
        textSize(20);
        text(this.minesAround, this.x + 3, this.y + this.w / 2 - 11, this.w, this.w);
      }
    }
  }

  setNeighbours(arr) {
    this.neighbours = arr;
  }

  getNeighbours() {
    return this.neighbours;
  }

  reveal() {
    this.revealed = true;

    return !this.mine;
  }

  setMinesAround(count) {
    this.minesAround = count;
  }

  isMine() {
    return this.mine;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Cell;


/***/ })
/******/ ]);