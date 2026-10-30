export function chooseRandomGuess(board) {
    const availableGuesses = [];

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
        if (cell.shot === null) {
            availableGuesses.push({ row: rowIndex, col: colIndex });
        }
        });
    });

    if (availableGuesses.length === 0) return null;

    return availableGuesses[Math.floor(Math.random() * availableGuesses.length)];
}