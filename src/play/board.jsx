import React from 'react';
import { PlayState } from './playState';

import './board.css';

const rowLabels = "ABCDEFGHIJ".split("");
const columns = Array.from({ length: 10 }, (_, index) => index + 1);

function Board({ onCellClick, boardType = "host", showShips = true, coord1, coord2, board, previewCells, playState }) {

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

                            const isEndpoint =
                                (coord1?.[0] === rowIndex && coord1?.[1] === column - 1) ||
                                (coord2?.[0] === rowIndex && coord2?.[1] === column - 1);

                            const isPreview = previewCells.some(
                                (previewCell) => previewCell.row === rowIndex && previewCell.col === column - 1
                            );



                            let cellClass = "unguessed";
                            if (isEndpoint || isPreview) {
                                cellClass = "selected"
                            } else if (isPreview) {
                                cellClass = "preview"
                            } else if (cell?.shot === "hit") {
                                cellClass = "hit";
                            } else if (cell?.shot === "miss") {
                                cellClass = "miss";
                            } else if (showShips && cell?.shipID) {
                                cellClass = `ship-${cell.shipID}`;
                            }
                        
                        
                            return (
                                <td key={column}>
                                    <button
                                        type="button"
                                        aria-label={`Square ${rowLabel}${column}`}
                                        onClick={() => onCellClick(rowIndex, column - 1)}
                                        className={`cell-svg ${cellClass}`}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 100 100"
                                            width="25"
                                            height="25"
                                        >
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