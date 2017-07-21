var cells = [],
    rows = 10,
    cols = 15,
    mineCount = 13,
    w = 40;



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


    var randomNumbers = shuffle(incrementingArray);

    randomNumbers.splice(mineCount);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            cells.push(new Cell(j * w, i * w, w, randomNumbers.indexOf(i*cols + j) > -1));
        }
    }
}


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

