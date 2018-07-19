export class Cell {

  constructor(x, y, w) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._mined = false;
    this._flaged = false;
    this._revealed = false;
    this._minesAround = 0;
  }

  mine() {
    this._mined = true;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  draw(p) {
    p.fill(this._revealed ? 215 : 245);
    this._revealed ? p.stroke(140) : p.stroke(200);
    p.rect(this._x, this._y, this._w, this._w);

    if (this._flaged) {
      p.textAlign(p.CENTER);
      p.fill(240, 40, 90);
      p.textSize(30);
      p.text('F', this._x + 5, this._y + this._w / 2 - 16, this._w, this._w);
    } else if (this._revealed) {

      if (this._mined) {
        p.fill(200, 30, 40);
        let half = this._w / 2;

        p.ellipse(this._x + half, this._y + half, half, half);

      } else if (this._minesAround) {
        p.textAlign(p.CENTER);
        p.fill(100, 90, 190);
        p.textSize(20);
        p.text(this._minesAround, this._x + 3, this._y + this._w / 2 - 11, this._w, this._w);
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
    this._flaged = false;

    return !this._mined;
  }

  isRevealed() {
    return this._revealed;
  }

  setMinesAround(count) {
    this._minesAround = count;
  }

  isMine() {
    return this._mined;
  }

  toggleFlag() {
    this._flaged = !this._flaged;
  }

  isFlagged() {
    return this._flaged;
  }
}

