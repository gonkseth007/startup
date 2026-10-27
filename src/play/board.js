export function createEmptyBoard() {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => ({
            shipID: null,
            shot: null,
        }))
    );
}

export function parseCoordinate(value) {
  const match = /^([A-J])(10|[1-9])$/i.exec(value.trim());
  if (!match) return null;

  return {
    row: match[1].toUpperCase().charCodeAt(0) - 65,
    col: Number(match[2]) - 1,
  };
}

export function formatCoordinate({ row, col }) {
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

export function getValidPlacements(board, ship, start) {
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];

  return directions.flatMap(([rowStep, colStep]) => {
    const cells = Array.from({ length: ship.size }, (_, i) => ({
      row: start.row + rowStep * i,
      col: start.col + colStep * i,
    }));

    const fits = cells.every(
      ({ row, col }) =>
        row >= 0 &&
        row < board.length &&
        col >= 0 &&
        col < board[row].length &&
        board[row][col].shipId === null
    );

    return fits
      ? [{ end: cells[cells.length - 1], cells }]
      : [];
  });
}

export function placeShip(board, ship, cells) {
  const nextBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  cells.forEach(({ row, col }) => {
    nextBoard[row][col].shipId = ship.id;
  });

  return nextBoard;
}