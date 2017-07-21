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

