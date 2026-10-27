import React from 'react';
import { PlayState } from './playState';

import './board.css';

const rowLabels = "ABCDEFGHIJ".split("");
const columns = Array.from({ length: 10 }, (_, index) => index + 1);

function Board({ onCellClick, boardType = "host", showShips = true, coord1, coord2, board, playState }) {
    // console.log(coord1);
    // const [selectedCell, setSelectedCell] = React.useState(coord1);

    function clickCell(row, column) {
        onCellClick(row, column);
        // setSelectedCell([row, column]);
        // console.log(selectedCell);
        // setGuess(convertNumToGuess(row, column));
    }


    return (
        <table>
            <thead>
                <tr>
                    <th aria-label="Row and column labels"></th>
                    {columns.map((column) => (
                        <th key={column} scope="col">
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {rowLabels.map((rowLabel, rowIndex) => (
                    <tr key={rowLabel}>
                        <th scope="row">{rowLabel}&nbsp;</th>

                        {columns.map((column) => {
                            const cell = board[rowIndex]?.[column - 1];

                            let cellClass = "unguessed";
                            // console.log(coord1?.[0]);
                            // console.log(coord1?.[1]);
                            if ((coord1?.[0] === rowIndex && coord1?.[1] === column - 1) 
                                || (coord2?.[0] === rowIndex && coord2?.[1] === column - 1)) {
                                cellClass = "selected"
                            } else if (cell?.shot === "hit") {
                                cellClass = "hit";
                            } else if (cell?.shot === "miss") {
                                cellClass = "miss";
                            } else if (showShips && cell?.shipId) {
                                cellClass = `ship-${cell.shipId}`;
                            }
                        
                        
                            return (
                                <td key={column}>
                                    <button
                                        type="button"
                                        aria-label={`Square ${rowLabel}${column}`}
                                        onClick={() => clickCell?.(rowIndex, column - 1)}
                                        className={`cell-svg ${cellClass}`}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 100 100"
                                            width="25"
                                            height="25"
                                            // className={`cell-svg ${cellClass}`}
                                        >
                                            {/* <rect x="5" y="5" width="90" height="90" rx="8" /> */}
                                        </svg>
                                    </button>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Board;