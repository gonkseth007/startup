export function chooseRandomGuess(board) {
    const availableGuesses = [];

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell.shot === null) {
                availableGuesses.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    const index = Math.floor(Math.random() * availableGuesses.length);
    return availableGuesses[index];
}

export function chooseShipPlacement(board, size, shipType) {
    while (true) {
        placedShip = false;
        const x = Math.floor(Math.random() * 10) + 1;
        const y = Math.floor(Math.random() * 10) + 1;
        const dir = Math.floor(Math.random * 4);

        switch (dir) {
            case 0:
                if (x + size < board.board[0].length) {
                    canPlace = true;
                    for (i = x; i < x + size; i++) {
                        if (board.board[y][i] != null) {
                            canPlace = false;
                            break
                        }
                    }
                    if (canPlace) {
                        board.placeShip(x, y, x + size - 1, y, shipType);
                        placedShip = true;
                        break;
                    }
                }
                break;
            case 1:
                if (x - size > 0) {
                    canPlace = true;
                    for (i = x - size; i < x; i++) {
                        if (board.board[y][i] != null) {
                            canPlace = false;
                            break
                        }
                    }
                    if (canPlace) {
                        board.placeShip(x - size, y, x - 1, y, shipType);
                        placedShip = true;
                        break;
                    }
                }
                break;
            case 2:
                if (y + size < board.board.length) {
                    canPlace = true;
                    for (i = y; i < y + size; i++) {
                        if (board.board[i][x] != null) {
                            canPlace = false;
                            break
                        }
                    }
                    if (canPlace) {
                        board.placeShip(x, y, x, y + size - 1, shipType);
                        placedShip = true;
                        break;
                    }
                }
                break;
            case 3:
                if (y - size > 0) {
                    canPlace = true;
                    for (i = y - size; i < y; i++) {
                        if (board.board[i][x] != null) {
                            canPlace = false;
                            break
                        }
                    }
                    if (canPlace) {
                        board.placeShip(x, y - size, x, y - 1, shipType);
                        placedShip = true;
                        break;
                    }
                }
                break;
            default:
                break;
        }
        if (placedShip) {
            break;
        }
    }
}