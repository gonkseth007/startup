import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Board from './board.jsx';
import { PlayState } from './playState';
import { parseCoordinate, getValidPlacements, formatCoordinate, placeShip, applyShot, createRandomFleetBoard, hasFleetBeenSunk } from './board.js';
import { shipTypes } from './ships.js';
import { chooseRandomGuess } from './ai.js';

export function Game({playState, onSetupDone, onReturnToLobby }) {
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

    const [turnPhase, setTurnPhase] = useState(() => game?.status === "finished" ? "game-over" : "player");
    const [lastMove, setLastMove] = useState(null);
    const displayName = localStorage.getItem('displayName');
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

    const [turnMessages, setTurnMessages] = useState([]);
    const MAX_TURN_MESSAGES = 6;

    const [gameOver, setGameOver] = useState(() => game?.status === "finished");

    const [gameResult, setGameResult] = useState(() => game?.result ?? null);

    const gameEndedRef = React.useRef(game?.status === "finished");

    useEffect(() => {
        if (playState !== PlayState.PlayingGame || gameOver) return;

        let timer;

        if (turnPhase === "player-result") {
            addTurnMessage(`${opponentName}'s turn.`);
            timer = setTimeout(() => {
            setTurnPhase("opponent-thinking");
            }, 3000);
        }

        if (turnPhase === "opponent-thinking") {
            const delay =
            game.mode === "offline"
                ? 1000 + Math.random() * 500
                : 2500 + Math.random() * 1000;

            timer = setTimeout(() => {
            const aiGuess = chooseRandomGuess(game.boards.host);

            if (!aiGuess) {
                setTurnPhase("player");
                return;
            }

            const { board: updatedHostBoard, result } = applyShot(
                game.boards.host,
                aiGuess
            );

            if (!result) {
                setTurnPhase("player");
                return;
            }

            const updatedGame = {
                ...game,
                boards: {
                ...game.boards,
                host: updatedHostBoard,
                },
            };

            saveGame(updatedGame);

            if (hasFleetBeenSunk(updatedHostBoard)) {
                finishGame("loss", updatedGame);
                localStorage.removeItem("currentGame");
                return;
            }

            setLastMove({
                player: opponentName,
                coordinate: formatCoordinate(aiGuess),
                result,
            });

            addTurnMessage(`${opponentName} guessed ${formatCoordinate(aiGuess)} — ${result}!`);
            setTurnPhase("opponent-result");
            }, delay);
        }

        if (turnPhase === "opponent-result") {
            addTurnMessage("Your turn.");
            timer = setTimeout(() => {
            setTurnPhase("player");
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [playState, turnPhase, game, opponentName]);

    function addTurnMessage(text) {
        setTurnMessages((previous) => [
            { id: crypto.randomUUID(), text },
            ...previous,
        ].slice(0, MAX_TURN_MESSAGES));
    }

    function finishGame(outcome, finalGame = game) {
        if (gameEndedRef.current || finalGame?.status === "finished") return;

        gameEndedRef.current = true;

        const finishedGame = {
            ...finalGame,
            status: "finished",
            result: outcome,
        };

        saveGame(finishedGame);
        removeGameFromLobby(finishedGame.id);
        setGameOver(true);
        setTurnPhase("game-over");
        setGameResult(outcome);

        addTurnMessage(
            outcome === "win" ? "You won!" : `${opponentName} won!`
        );

        recordPlayerResult(outcome);
    }

    function recordPlayerResult(outcome) {
        const userName =
            localStorage.getItem("userName") ||
            game?.hostPlayer?.userName ||
            "local-player";

        const allStats = JSON.parse(localStorage.getItem("playerStats") || "[]");

        const playerStats = allStats.find((player) => player.userName === userName) ?? { userName: userName, displayName: displayName, wins: 0, losses: 0 };

        const updatedStats = {
            ...playerStats,
            wins: playerStats.wins + (outcome === "win" ? 1 : 0),
            losses: playerStats.losses + (outcome === "loss" ? 1 : 0),
        };

        const updatedAllStats = allStats.some((player) => player.userName === userName)
            ? allStats.map((player) => player.userName === userName ? updatedStats : player)
            : [...allStats, updatedStats]
        localStorage.setItem("playerStats", JSON.stringify(updatedAllStats));
    }

    function saveGame(updatedGame) {
        setGame(updatedGame);
        localStorage.setItem("currentGame", JSON.stringify(updatedGame));
    }

    function removeGameFromLobby(gameId) {
        const games = JSON.parse(localStorage.getItem("games") || "[]");
        const remainingGames = games.filter((savedGame) => savedGame.id !== gameId);

        localStorage.setItem("games", JSON.stringify(remainingGames));
    }
    
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

        if (shipIndex === shipTypes.length - 1) {
            updatedGame.boards.guest = createRandomFleetBoard(shipTypes);
        }

        saveGame(updatedGame);

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

    function handleBoardCellClick(row, col) {
        const coordinate = formatCoordinate({ row, col });

        if (playState == PlayState.Setup) {
            if (coordToSelect === "start") {
                setStartText(coordinate);
                setCoord1([row, col]);
                setEndText("");
                setCoord2([]);
                return;
            }

            if (validEndTexts.includes(coordinate)) {
                setEndText(coordinate);
                setCoord2([row, col]);
            }
        } else {
            if (turnPhase !== "player") return;
            if (game.boards.guest[row][col].shot !== null) return;
            setNewGuess(row, col);
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

        saveGame(updatedGame);
        if (hasFleetBeenSunk(updatedOpponentBoard)) {
            finishGame("win", updatedGame);
            localStorage.removeItem("currentGame");
            return;
        }

        setLastMove({
            player: "You",
            coordinate: formatCoordinate({ row, col }),
            result,
        });

        addTurnMessage(`You guessed ${guess} — ${result}!`);
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
    
    function setNewGuess(row, col) {
        const newGuess = formatCoordinate({ row, col });
        setGuess(newGuess);
        setCoord1([row, col]);
    }

    const handleChange1 = (e) => {
        if (turnPhase !== "player") return;
        if (game.boards.guest[row][col].shot !== null) return;
        const rawValue = e.target.value.toUpperCase();
        const regex = /^[A-J]?(?:10|[1-9]?)?$/;

        if (regex.test(rawValue)) {
            const coord = convertCoordToNum(rawValue);
            if (game.boards.guest[coord[0]][coord[1]].shot !== null) return;
            setGuess(rawValue);
            setCoord1(coord);
            
        } else {
            setGuess('');
            setCoord1([]);
        }
    }

    return (
        <div>
            {playState === PlayState.PlayingGame && (
                <div>
                    <div>Opponent: {opponentName}</div>
                    <br />

                    {!gameOver && (<div>Turn: Yours ({displayName})</div>)}
                    {gameOver && (<div>Game Ended...</div>)}
                    <hr />
                </div>
            )}

            {playState === PlayState.Setup && (
                <div>
                    <div>Place Ship: {selectedShip?.name} ({selectedShip?.size})</div>
                </div>
            )}

            <div>
                {/* 3rd Party API Call To Be Implemented With Pokemon Images As Boats */}
                <Board 
                    onCellClick={handleBoardCellClick} 
                    boardType="host" showShips={showShips} 
                    coord1={coord1}
                    coord2={coord2}
                    board={visibleBoard}
                    previewCells={previewCells}
                    interactive={playState === PlayState.Setup || turnPhase === "player"}
                    rejectShotCells={playState === PlayState.PlayingGame}
                />
            </div>

            {/*  Websocket placeholder  */}
            {(!gameOver && playState === PlayState.PlayingGame) && (
                <div>
                    <br />
                    <div id="turn-messages" aria-live="polite">
                        {turnMessages.map(({ id, text }) => (
                            <div key={id}>{text}</div>
                        ))}
                    </div>
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
                        <Button
                            variant="primary"
                            className="m-3 mx-2"
                            disabled={gameOver}
                            onClick={() => finishGame("loss")}
                        >Surrender</Button>
                    </div>
                </div>
            )}
            {gameOver && (
                <div>
                    <div className="my-4">
                        {gameResult === "win" ? "You won!" : "You lost."}
                    </div>
                    <Button variant="primary" onClick={onReturnToLobby}>
                        Return to Lobby
                    </Button>
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