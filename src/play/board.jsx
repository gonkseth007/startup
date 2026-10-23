import React from 'react';

const rowLabels = "ABCDEFGHIJ".split("");
const columns = Array.from({ length: 10 }, (_, index) => index + 1);

function Board({ onCellClick }) {
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
                <th scope="row">{rowLabel}</th>

                {columns.map((column) => (
                <td key={column}>
                    <button
                    type="button"
                    aria-label={`Square ${rowLabel}${column}`}
                    onClick={() => onCellClick?.(rowIndex, column - 1)}
                    >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 100 100"
                        width="25"
                        height="25"
                    />
                    </button>
                </td>
                ))}
            </tr>
            ))}
        </tbody>
    </table>
  );
}

export default Board;