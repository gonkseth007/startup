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
        board[row][col].shipID === null
    );

    return fits
      ? [{ end: cells[cells.length - 1], cells }]
      : [];
  });
}

export function placeShip(board, ship, cells) {
  const nextBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  cells.forEach(({ row, col }) => {
    nextBoard[row][col].shipID = ship.id;
  });

  return nextBoard;
}

export function applyShot(board, { row, col }) {
    const cell = board[row]?.[col];

    if (!cell || cell.shot !== null) {
        return { board, result: null };
    }

    const result = cell.shipID !== null ? "hit" : "miss";
    const updatedBoard = board.map((boardRow) =>
        boardRow.map((boardCell) => ({ ...boardCell }))
    );

    updatedBoard[row][col].shot = result;

    return { board: updatedBoard, result };
}

export function createRandomFleetBoard(ships) {
  for (let attempt = 0; attempt < 100; attempt++) {
    let board = createEmptyBoard();
    let failed = false;

    for (const ship of ships) {
      const placements = [];

      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          placements.push(
            ...getValidPlacements(board, ship, { row, col })
          );
        }
      }

      if (placements.length === 0) {
        failed = true;
        break;
      }

      const placement =
        placements[Math.floor(Math.random() * placements.length)];

      board = placeShip(board, ship, placement.cells);
    }

    if (!failed) return board;
  }

  throw new Error("Could not create a random fleet board.");
}

export function hasFleetBeenSunk(board) {
  const shipCells = board.flat().filter((cell) => cell.shipID !== null);

  return shipCells.length > 0 &&
    shipCells.every((cell) => cell.shot === "hit");
}