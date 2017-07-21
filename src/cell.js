export class Cell {

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
  };

  setNeighbours(arr) {
    this.neighbours = arr;
  };

  getNeighbours() {
    return this.neighbours;
  };

  reveal() {
    this.revealed = true;

    return !this.mine;
  };

  setMinesAround(count) {
    this.minesAround = count;
  };

  isMine() {
    return this.mine;
  }
}

