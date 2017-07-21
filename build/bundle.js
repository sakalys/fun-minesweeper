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

var Cell = __webpack_require__(1);

var cells = [],
    rows = 10,
    cols = 15,
    mineCount = 20,
    w = 40;

window.setup = function() {
    //noinspection JSUnresolvedFunction
    createCanvas(601, 401);
    background(0, 0, 0);

    var mineLocations = makeMineLocations(rows, cols, mineCount);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            cells.push(new Cell(j * w, i * w, w, mineLocations.indexOf(getIndex(i, j)) > -1));
        }
    }

    cells.forEach(function (cell) {
        cell.setMinesAround(countMinesAround(cell));
    });

    cells.forEach(function (cell) {
        cell.setNeighbours(getNeighbours(cell));
    });
};

function makeMineLocations(rows, cols, howMany) {

  var incrementingArray = [];
  for (var nr = 0; nr < rows * cols; nr++) {
      incrementingArray.push(nr);
  }

  //noinspection JSUnresolvedFunction
  var randomNumbers = shuffle(incrementingArray);

  randomNumbers.splice(howMany);

  return randomNumbers;
}


window.draw = function() {

    cells.forEach(function (cell) {
        cell.draw();
    });

};

window.mouseClicked = function() {
    //noinspection JSUnresolvedVariable
    var row = (mouseY - (mouseY % w)) / w;
    //noinspection JSUnresolvedVariable
    var col = (mouseX - (mouseX % w)) / w;

    var cell = getCell(row, col);

    if (!cell) {
        return;
    }

    fullReveal(cell);
}

function getIndex(row, col) {
  if (row >= rows || col >= cols) {
    return null;
  }

  return cols * row + col;
}

function getCell(row, col) {

    var index = getIndex(row, col);

    if (index === null) {
        return null;
    }

    return cells[index];
}

function countMinesAround(cell) {

    return getNeighbours(cell).reduce(function (count, cell) {
        var number = cell.isMine() ? 1 : 0;
        return number + count;
    }, 0)

}

function fullReveal(cell) {

    if (cell.revealed) {
        return;
    }

    if (!cell.reveal()) {
        return gameOver();
    }

    if (cell.minesAround) {
        return;
    }
    var arr = cell.getNeighbours();

    arr.forEach(function (c) {
        if (!c.revealed) {
            if (!c.minesAround) {
                fullReveal(c);
            } else if (c.minesAround) {
                c.reveal();
            }
        }
    });
}

function getNeighbours(cell) {
    var neighbours = [];

    for (var rowDelta = -1; rowDelta < 2; rowDelta++) {
        var row = rowDelta + (cell.y / cell.w);
        if (row < 0 || row >= rows) {
            continue;
        }
        for (var colDelta = -1; colDelta < 2; colDelta++) {
            var col = colDelta + (cell.x / cell.w);
            if (col < 0 || col >= cols || (rowDelta === 0 && colDelta === 0)) {
                continue;
            }

            neighbours.push(getCell(row, col));
        }
    }

    return neighbours;
}


function gameOver() {
    console.log('Game over');
    cells.forEach(function (cell) {
        cell.reveal();
    });
}



/***/ }),
/* 1 */
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
            var half = this.w /2;

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