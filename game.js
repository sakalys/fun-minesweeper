var cells = [],
    rows = 10,
    cols = 15,
    mineCount = 13,
    w = 40;


function mix(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function setup() {
    createCanvas(601, 401);
    background(0, 0, 0);

    var n = rows * cols;

    var incrementingArray = [];
    for (var y = 0; y < rows; y++) {
        for (var z = 0; z < cols; z++) {
            incrementingArray.push(y * cols + z);
        }
    }


    var randomNumbers = mix(incrementingArray);

    randomNumbers.splice(mineCount);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            cells.push(new Cell(j * w, i * w, w, randomNumbers.indexOf(i*cols + j) > -1));
        }
    }
}

function Cell(x, y, w, mine) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.revealed = false;
    this.mine = mine;

    if (this.mine) {
        console.log(mine);
    }
}

Cell.prototype.draw = function () {
    fill(this.revealed ? 215 : 245);
    this.revealed ? stroke(90) : stroke(200);
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

function draw() {

    cells.forEach(function (cell) {
        cell.draw();
    });

}

function mouseClicked() {
    var rowI = (mouseY - (mouseY % w)) / w;
    var colI = (mouseX - (mouseX % w)) / w;

    if (rowI >= rows || colI >= cols) {
        return;
    }

    var cell = cells[cols * rowI + colI];
    cell.reveal();
}

