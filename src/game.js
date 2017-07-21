var Cell = require('./cell');

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
    var row = rowDelta + (cell.y / cell.w);
    if (row < 0 || row >= this.getRowCount()) {
      continue;
    }

    for (var colDelta = -1; colDelta < 2; colDelta++) {
      var col = colDelta + (cell.x / cell.w);
      if (col < 0 || col >= this.getColCount() || (rowDelta === 0 && colDelta === 0)) {
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
  return this._mineCount
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

  var row = (y - (y % w)) / w,
    col = (x - (x % w)) / w;

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
