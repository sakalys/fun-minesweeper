import {Cell} from "./cell";

export class Game {
  constructor(rows, cols, cellWidth, mineCount) {
    this._rows = rows;
    this._cols = cols;
    this._cellWidth = cellWidth;
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
        this._cells.push(new Cell(j * w, i * w, w, mineLocations.indexOf(this._getIndex(i, j)) > -1));
      }
    }

    this._cells.forEach((cell) => {
      cell.setMinesAround(this._countMinesAround(cell));
    });

    this._cells.forEach((cell) => {
      cell.setNeighbours(this._getNeighbours(cell));
    });
  }

  _getNeighbours(cell) {
    const neighbours = [];

    for (let rowDelta = -1; rowDelta < 2; rowDelta++) {
      const row = rowDelta + (cell.y / cell.w);
      if (row < 0 || row >= this.getRowCount()) {
        continue;
      }

      for (let colDelta = -1; colDelta < 2; colDelta++) {
        const col = colDelta + (cell.x / cell.w);
        if (col < 0 || col >= this.getColCount() || (rowDelta === 0 && colDelta === 0)) {
          continue;
        }

        neighbours.push(this._getCell(row, col));
      }
    }

    return neighbours;

  }

  _countMinesAround(cell) {
    return this._getNeighbours(cell).reduce(function (count, cell) {
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
    return this._mineCount
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
      row = (y - (y % w)) / w,
      col = (x - (x % w)) / w,
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

    arr.forEach((c) => {
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