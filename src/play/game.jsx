import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Board from './board.jsx';
import { PlayState } from './playState';
import { parseCoordinate, getValidPlacements, formatCoordinate, placeShip } from './board.js';
import { shipTypes } from './ships.js';

export function Game({playState, onSetupDone}) {
    const [game, setGame] = useState(() => JSON.parse(localStorage.getItem("currentGame")));

    const board = game?.boards?.host;
    const [guess, setGuess] = React.useState('');
    const [coordToSelect, setCoordToSelect] = useState("start");
    const [coord1, setCoord1] = React.useState([]);
    const [coord2, setCoord2] = React.useState([]);

    const [shipIndex, setShipIndex] = useState(() => getNextShipIndex(game));
    const selectedShip = shipTypes[shipIndex] ?? null;

    const [startText, setStartText] = React.useState("");
    const [endText, setEndText] = React.useState("");

    const start = parseCoordinate(startText);
    const placements =
    start && selectedShip
        ? getValidPlacements(board, selectedShip, start)
        : [];

    const validEndTexts = placements.map(({ end }) => formatCoordinate(end));

    const selectedPlacement = placements.find(({ end }) => formatCoordinate(end) === endText);

    const previewCells = selectedPlacement?.cells ?? [];

    const [turnPhase, setTurnPhase] = useState("player");
    const [lastMove, setLastMove] = useState(null);
    const opponentName =
        game?.mode === "offline" ? "Bot" : "MisterMan";

    const showingHostBoard =
        playState === PlayState.Setup ||
        turnPhase === "opponent-thinking" ||
        turnPhase === "opponent-result";

    const visibleBoard = showingHostBoard
        ? game.boards.host
        : game.boards.guest;

    const showShips =
        playState === PlayState.Setup || showingHostBoard;

    function getNextShipIndex(game) {
        const board = game?.boards?.host ?? [];

        const placedShipIDs = new Set(
            board.flatMap((row) => row.map((cell) => cell.shipID))
            .filter((shipID) => shipID != null)
        );

        const nextIndex = shipTypes.findIndex(
            (ship) => !placedShipIDs.has(ship.id)
        );

        // All ships placed
        if (nextIndex === -1) {
            onSetupDone();
            setCoordToSelect("start");
        }
        return nextIndex === -1 ? shipTypes.length : nextIndex;
    }

    function handlePlaceShip() {
        if (!selectedShip || !selectedPlacement) return;

        const updatedBoard = placeShip(
            board,
            selectedShip,
            selectedPlacement.cells
        );

        // Update the game with updatedBoard
        const updatedGame = {
            ...game,
            boards: {
                ...game.boards,
                host: updatedBoard,
            },
        };

        setStartText("");
        setEndText("");
        setCoord1([]);
        setCoord2([]);

        setGame(updatedGame);
        localStorage.setItem("currentGame", JSON.stringify(updatedGame));

        if (shipIndex === shipTypes.length - 1) {
            onSetupDone();
            setCoordToSelect("start");
        } else {
            setShipIndex((index) => index + 1);
            if (coordToSelect != "start") {
                setCoordToSelect("start");
            }
        }
    }

    function handleBoardCellClick(row, column) {
        const coordinate = convertNumToCoord(row, column);

        if (playState == PlayState.Setup) {
            if (coordToSelect === "start") {
                setStartText(coordinate);
                setCoord1([row, column]);
                setEndText("");
                setCoord2([]);
                return;
            }

            if (validEndTexts.includes(coordinate)) {
                setEndText(coordinate);
                setCoord2([row, column]);
            }
        } else {
            if (turnPhase !== "player") return;
            if (game.boards.guest[row][col].shot !== null) return;
            setNewGuess(row, column);
        }
    }

    function handleSubmitGuess() {
        if (turnPhase !== "player" || coord1.length !== 2) return;

        const [row, col] = coord1;
        const { board: updatedOpponentBoard, result } = applyShot(
            game.boards.guest,
            { row, col }
        );

        if (!result) return;

        const updatedGame = {
            ...game,
            boards: {
            ...game.boards,
            guest: updatedOpponentBoard,
            },
        };

        setGame(updatedGame);
        localStorage.setItem("currentGame", JSON.stringify(updatedGame));

        setLastMove({
            player: "You",
            coordinate: formatCoordinate({ row, col }),
            result,
        });

        setCoord1([]);
        setGuess("");
        setTurnPhase("player-result");
    }

    function toggleCoordToSelect() {
        if (coordToSelect === "start") {
            setCoordToSelect("end");
        } else {
            setCoordToSelect("start");
        }
    }

    function convertCoordToNum(currGuess) {
        if (!currGuess?.trim()) {
            return [];
        }
        const normalized = currGuess.trim().toUpperCase();
        const row = normalized.charCodeAt(0) - 65;
        const column = Number(normalized.slice(1)) - 1;

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
    }

    const handleChange1 = (e) => {
        if (turnPhase !== "player") return;
        if (game.boards.guest[row][col].shot !== null) return;
        const rawValue = e.target.value.toUpperCase();
        const regex = /^[A-J]?(?:10|[1-9]?)?$/;

        if (regex.test(rawValue)) {
            setGuess(rawValue);
            setCoord1(convertCoordToNum(rawValue));
        } else {
            setGuess('');
            setCoord1([]);
        }
    }

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

            {playState === PlayState.Setup && (
                <div>
                    <div>Place Ship: {selectedShip?.name} ({selectedShip?.size})</div>
                </div>
            )}

            <div>
                {/* 3rd Party API Call Implemented With Pokemon Images As Boats */}
                <Board 
                    onCellClick={handleBoardCellClick} 
                    boardType="host" showShips={showShips} 
                    coord1={coord1}
                    coord2={coord2}
                    board={visibleBoard}
                    previewCells={previewCells}
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
                                maxLength={3} 
                            />
                        </div>
                        <Button 
                            variant='primary' 
                            className="m-3 mx-2" 
                            disabled={turnPhase !== "player" || coord1.length !== 2}
                            onClick={handleSubmitGuess}
                        >Make Guess</Button>
                        <Button variant='primary' className="m-3 mx-2">Surrender</Button>
                    </div>
                </div>
            )}
            {playState === PlayState.Setup && (
                <div>
                    <div className="input-row">
                        <div className="input-group my-3">
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
                                        
                                        const parsed = parseCoordinate(value);
                                        setCoord1(parsed ? [parsed.row, parsed.col] : []);
                                        setCoord2([]);
                                    }
                                }}
                            />
                        </div>
                        <div className="input-group my-3">
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
                                        const parsed = parseCoordinate(value);
                                        setCoord2(parsed ? [parsed.row, parsed.col] : []);
                                        // setCoord2([]);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <Button variant='primary'
                            disabled={!selectedPlacement}
                            onClick={handlePlaceShip}
                        >
                            Place ship
                        </Button>
                        <Button variant="primary" onClick={toggleCoordToSelect}>
                            Toggle position selected: {coordToSelect}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;