function Cell(x, y, w, mine) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.revealed = false;
    this.mine = mine;
}

Cell.prototype.draw = function () {
    fill(this.revealed ? 215 : 245);
    this.revealed ? stroke(140) : stroke(200);
    rect(this.x, this.y, this.w, this.w);

    if (this.revealed && this.mine) {
        fill(200, 30, 40);
        var half = this.w /2;

        ellipse(this.x + half, this.y + half, half, half);
    }
};

Cell.prototype.reveal = function () {
    this.revealed = true;
};


