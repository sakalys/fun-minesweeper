export class Cell {

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
    return this._minesAround
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

