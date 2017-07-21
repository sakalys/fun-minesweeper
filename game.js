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
            cells.push(new Cell(j * w, i * w, w, randomNumbers.indexOf(i * cols + j) > -1));
        }
    }

    cells.forEach(function (cell) {
        cell.setMinesAround(countMinesAround(cell));
    });
}


function draw() {

    cells.forEach(function (cell) {
        cell.draw();
    });

}

function mouseClicked() {
    var rowI = (mouseY - (mouseY % w)) / w;
    var colI = (mouseX - (mouseX % w)) / w;

    var cell = getCell(rowI, colI);

    if (!cell) {
        return;
    }

    fullReveal(cell);
}

function getCell(rowI, colI) {
    if (rowI >= rows || colI >= cols) {
        return null;
    }

    return cells[cols * rowI + colI];
}

function countMinesAround(cell) {
    return getNeighbours(cell).reduce(function (count, cell) {
        var number = cell.isMine() ? 1 : 0;
        return number + count;
    }, 0)
}

function fullReveal(cell) {

    if (!cell.reveal()) {
        return gameOver();
    }

    getNeighbours(cell).forEach(function (c) {
        // if (countMinesAround(c)) {
        //
        // }
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

