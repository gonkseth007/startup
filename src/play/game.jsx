import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Board from './board.jsx';
import { PlayState } from './playState';
import { parseCoordinate, getValidPlacements, formatCoordinate, placeShip } from './board.js';
import { shipTypes } from './ships.js';

export function Game({playState, onSetupDone}) {
    const [game, setGame] = useState(() =>
        JSON.parse(localStorage.getItem("currentGame"))
    );

    // const shipTypes = shipTypes;

    const board = game?.boards?.host ?? createEmptyBoard();
    const [guess, setGuess] = React.useState('');
    const [coord1, setCoord1] = React.useState([]);
    const [coord2, setCoord2] = React.useState([]);

    const [shipIndex, setShipIndex] = useState(0);
    const selectedShip = shipTypes[shipIndex] ?? null;

    const [startText, setStartText] = React.useState("");
    const [endText, setEndText] = React.useState("");
    const [message, setMessage] = React.useState("");

    const start = parseCoordinate(startText);
    const placements =
    start && selectedShip
        ? getValidPlacements(board, selectedShip, start)
        : [];

    console.log(playState);

    const validEndTexts = placements.map(({ end }) => formatCoordinate(end));

    const selectedPlacement = placements.find(
        ({ end }) => formatCoordinate(end) === endText
    );

    const previewCells = selectedPlacement?.cells ?? [];

    function handlePlaceShip() {
        if (!selectedShip || !selectedPlacement) return;

        const updatedBoard = placeShip(
            board,
            selectedShip,
            selectedPlacement.cells
        );

        // Update the game with updatedBoard here.
        setShipIndex((index) => index + 1);
        setStartText("");
        setEndText("");
        console.log(shipIndex);
        if (shipIndex === shipTypes.length) {
            onSetupDone();
        }
    }

    function convertCoordToNum(currGuess) {
        if (!currGuess?.trim()) {
            return [];
        }
        // console.log(currGuess);
        const normalized = currGuess.trim().toUpperCase();
        const row = normalized.charCodeAt(0) - 65;
        const column = Number(normalized.slice(1)) - 1;

        // console.log(row);
        // console.log(column);

        return [row, column];
    }

    function convertNumToCoord(row, column) {
        let convertedGuess = String.fromCharCode(65 + row);
        convertedGuess += String(column + 1);
        return convertedGuess;
    }
    
    function setNewGuess(row, column) {
        const newGuess = convertNumToCoord(row, column);
        setGuess(newGuess);
        setCoord1([row, column]);
        // console.log(newGuess);
    }

    const handleChange1 = (e) => {
        const rawValue = e.target.value.toUpperCase();
        const regex = /^[A-J]?(?:10|[1-9]?)?$/;

        if (regex.test(rawValue)) {
            setGuess(rawValue);
            setCoord1(convertCoordToNum(rawValue));
            // console.log(rawValue);
        } else {
            setGuess('');
            setCoord1([]);
        }
    }

    const handleChange2 = (e) => {
        const rawValue = e.target.value.toUpperCase();
        const regex = /^[A-J]?(?:10|[1-9]?)?$/;

        if (regex.test(rawValue)) {
            setGuess(rawValue);
            setCoord2(convertCoordToNum(rawValue));
            // console.log(rawValue);
        } else {
            setGuess('');
            setCoord2([]);
        }
    }

    // const updatedBoard = placeShip(board, selectedShip, selectedPlacement.cells);
    // setGame((previous) => {
    //     const next = {
    //         ...previous,
    //         boards: { ...previous.boards, host: updatedBoard },
    //     };

    //     localStorage.setItem("currentGame", JSON.stringify(next));
    //     return next;
    // });

    return (
        <div>
            {playState === PlayState.PlayingGame && (
                <div>
                    <div>Opponent: MisterMan</div>
                    <br />
                    <div>
                        <span className="mx-3">Your Score: 0000</span>
                        <span>Opponent's Score: 0000</span>
                    </div>
                    <br />

                    <div>Turn: Yours (GoldenGonk007)</div>
                    <hr />
                </div>
            )}

            <div>
                {/* 3rd Party API Call Implemented With Pokemon Images As Boats */}
                <Board 
                    onCellClick={(row, column) => setNewGuess(row, column)} 
                    boardType="host" showShips={true} 
                    coord1={coord1} 
                    board={board}
                    playState={playState}
                />
            </div>

            {/*  Websocket placeholder  */}
            {playState === PlayState.PlayingGame && (
                <div>
                    <br />
                    <div>It is MisterMan's turn.</div>
                    <div>MisterMan guessed E6 - Miss!</div>
                    <div>It is GoldenGonk007's turn.</div>
                    <br />

                    <div className="mb-3 guess">
                        <div className="input-group m-3">
                            <span className="input-group-text">Guess:</span>
                            <input 
                                className="form-control rounded-end" 
                                type="text" placeholder="e.g. &quot;E10&quot;" 
                                value={guess} onChange={handleChange1} 
                                maxLength={3} />
                        </div>
                        <Button variant='primary' className="m-3 mx-2">Make Guess</Button>
                        <Button variant='primary' className="m-3 mx-2">Surrender</Button>
                    </div>
                </div>
            )}
            {playState === PlayState.Setup && (
                <div>
                    <div className="input-group m-3">
                        <span className="input-group-text">Start:</span>
                        <input
                            value={startText}
                            className="form-control rounded-end margin-right-input" 
                            type="text" placeholder="e.g. &quot;E10&quot;" 
                            onChange={(event) => {
                                const value = event.target.value.trim().toUpperCase();

                                if (/^(?:[A-J](?:10|[1-9])?)?$/.test(value)) {
                                setStartText(value);
                                setEndText("");
                                }
                            }}
                        />
                        <span className="input-group-text">End:</span>
                        <input
                            value={endText}
                            className="form-control rounded-end margin-right-input" 
                            type="text" placeholder="e.g. &quot;E10&quot;" 
                            onChange={(event) => {
                                const value = event.target.value.trim().toUpperCase();

                                if (
                                value === "" ||
                                validEndTexts.some((endpoint) => endpoint.startsWith(value))
                                ) {
                                setEndText(value);
                                }
                            }}
                        />
                    </div>
                    <Button variant='primary'
                        disabled={!selectedPlacement}
                        onClick={() => {handlePlaceShip}}
                    >
                        Place ship
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Game;