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
/***/ (function(module, exports, __webpack_require__) {

var Game = __webpack_require__(1);

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Cell = __webpack_require__(2);

module.exports = Game;

function Game(rows, cols, cellWidth, mineCount) {
  this._rows = rows;
  this._cols = cols;
  this._cellWidth = cellWidth;
  this._mineCount = mineCount;
  this._cells = [];
}

Game.prototype.start = function () {
  var _this = this;

  //noinspection JSUnresolvedFunction
  createCanvas(601, 401);
  background(0, 0, 0);

  var mineLocations = this._makeMineLocations(),
      w = this.getCellWidth();

  for (var i = 0; i < this.getRowCount(); i++) {
    for (var j = 0; j < this.getColCount(); j++) {
      this._cells.push(new Cell(j * w, i * w, w, mineLocations.indexOf(this._getIndex(i, j)) > -1));
    }
  }

  this._cells.forEach(function (cell) {
    cell.setMinesAround(_this._countMinesAround(cell));
  });

  this._cells.forEach(function (cell) {
    cell.setNeighbours(_this._getNeighbours(cell));
  });
};

Game.prototype._getNeighbours = function (cell) {
  var neighbours = [];

  for (var rowDelta = -1; rowDelta < 2; rowDelta++) {
    var row = rowDelta + cell.y / cell.w;
    if (row < 0 || row >= this.getRowCount()) {
      continue;
    }

    for (var colDelta = -1; colDelta < 2; colDelta++) {
      var col = colDelta + cell.x / cell.w;
      if (col < 0 || col >= this.getColCount() || rowDelta === 0 && colDelta === 0) {
        continue;
      }

      neighbours.push(this._getCell(row, col));
    }
  }

  return neighbours;
};

Game.prototype._countMinesAround = function (cell) {
  return this._getNeighbours(cell).reduce(function (count, cell) {
    var number = cell.isMine() ? 1 : 0;
    return number + count;
  }, 0);
};

Game.prototype._getCell = function (row, col) {
  var index = this._getIndex(row, col);

  if (index === null) {
    return null;
  }

  return this._cells[index];
};

Game.prototype._getIndex = function (row, col) {
  var rows = this.getRowCount(),
      cols = this.getColCount();

  if (row >= rows || col >= cols) {
    return null;
  }

  return cols * row + col;
};

Game.prototype.getRowCount = function () {
  return this._rows;
};

Game.prototype.getColCount = function () {
  return this._cols;
};

Game.prototype.getCellWidth = function () {
  return this._cellWidth;
};

Game.prototype.getMineCount = function () {
  return this._mineCount;
};

Game.prototype._makeMineLocations = function () {

  var incrementingArray = [];
  for (var nr = 0; nr < this.getRowCount() * this.getColCount(); nr++) {
    incrementingArray.push(nr);
  }

  //noinspection JSUnresolvedFunction
  var randomNumbers = shuffle(incrementingArray);

  randomNumbers.splice(this.getMineCount());

  return randomNumbers;
};

Game.prototype.draw = function () {
  this._cells.forEach(function (cell) {
    cell.draw();
  });
};

Game.prototype.gameOver = function () {
  console.log('Game over');
  this._cells.forEach(function (cell) {
    cell.reveal();
  });
};

Game.prototype.handleClick = function (x, y) {

  var w = this.getCellWidth();

  var row = (y - y % w) / w,
      col = (x - x % w) / w;

  var cell = this._getCell(row, col);

  if (!cell) {
    return;
  }

  this._fullReveal(cell);
};

Game.prototype._fullReveal = function (cell) {

  var _this = this;

  if (cell.revealed) {
    return;
  }

  if (!cell.reveal()) {
    return this.gameOver();
  }

  if (cell.minesAround) {
    return;
  }
  var arr = cell.getNeighbours();

  arr.forEach(function (c) {
    if (!c.revealed) {
      if (!c.minesAround) {
        _this._fullReveal(c);
      } else if (c.minesAround) {
        c.reveal();
      }
    }
  });
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = Cell;

function Cell(x, y, w, mine) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.revealed = false;
  this.mine = mine;
  this.minesAround = 0;
}

Cell.prototype.draw = function () {
  fill(this.revealed ? 215 : 245);
  this.revealed ? stroke(140) : stroke(200);
  rect(this.x, this.y, this.w, this.w);

  if (this.revealed) {

    if (this.mine) {
      fill(200, 30, 40);
      var half = this.w / 2;

      ellipse(this.x + half, this.y + half, half, half);
    } else if (this.minesAround) {
      textAlign(CENTER);
      fill(100, 90, 190);
      textSize(20);
      text(this.minesAround, this.x + 3, this.y + this.w / 2 - 11, this.w, this.w);
    }
  }
};

Cell.prototype.setNeighbours = function (arr) {
  this.neighbours = arr;
};

Cell.prototype.getNeighbours = function () {
  return this.neighbours;
};

Cell.prototype.reveal = function () {
  this.revealed = true;

  return !this.mine;
};

Cell.prototype.setMinesAround = function (count) {
  this.minesAround = count;
};

Cell.prototype.isMine = function () {
  return this.mine;
};

/***/ })
/******/ ]);