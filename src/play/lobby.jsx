import React from 'react';
import Button from 'react-bootstrap/Button';

import './lobby.css';
import { createGame, joinGame } from './game.js'

const columns = Array.from({ length: 10 }, (_, index) => index + 1);

function Lobby(props) {
    const savedGames = JSON.parse(localStorage.getItem("games")) ?? [];
    if (savedGames.length === 0) {
        localStorage.setItem('games', JSON.stringify([createGame("My Dope Game!", {userName: "agent007@gmail.com", displayName: "Agent007"}), createGame("Coolio Game", {userName: "coolguy123@gmail.com", displayName: "Cool Guy"})]));
        savedGames = JSON.parse(localStorage.getItem("games"));
    }
    const [games, setGames] = React.useState(savedGames);
    const [gameName, setGameName] = React.useState('');
    const [makeNewGame, setMakeNewGame] = React.useState(false);

    const userName = localStorage.getItem("userName");
    const displayName = localStorage.getItem("displayName");

    function handleJoin(gameID) {
        // const game = joinGame(game, { userName: userName, displayName: displayName });
        const gameToJoin = games.find((game) => game.id === gameID);
        if (!gameToJoin) return;

        const joinedGame = joinGame(gameToJoin, { userName: userName, displayName: displayName });
        setGames((previousGames) =>
            previousGames.map((game) =>
                game.id === gameID ? joinedGame : game
            )
        );

        props.onPlayGame(joinedGame);
    }

    function handleCreate(gameName) {
        const newGame = createGame(gameName, {
            userName: userName,
            displayName: displayName
        });

        const updatedGames = [...games, newGame];
        setGames(updatedGames);
        localStorage.setItem('games', JSON.stringify(updatedGames));
        props.onPlayGame(newGame);
    }

    function cancelNewGame() {
        setGameName('');
        setMakeNewGame(false);
    }

    function handleOffline() {
        const newGame = createGame("Offline Game", {
            userName: userName,
            displayName: displayName
        });

        newGame.mode = "offline";
        newGame.otherPlayer = {
            userName: "bot",
            displayName: "Bot",
        };
        props.onPlayGame(newGame);
    }

    return (
        <div>
            <h3 className="my-2">Available Games</h3>
            <table>
                <thead>
                    <tr className="table-row-alt">
                        <th className="game-table-block">Game Name</th>
                        <th className="game-table-block">Host Player</th>
                        <th className="game-table-block">Join Game</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game, index) => (
                        <tr
                            key={game.id}
                            className={index % 2 === 0 ? "table-row" : "table-row-alt"}
                        >
                        <td className="game-table-block">{game.name}</td>
                        <td className="game-table-block">{game.hostPlayer.displayName}</td>
                        <td className="game-table-block">
                            <Button
                                variant="primary"
                                onClick={() => handleJoin(game.id)}
                            >
                            Join
                            </Button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {makeNewGame === true && (
                <div className="input-group my-3 justify-center">
                    <span className="input-group-text">Game Name:</span>
                    <input className="form-control rounded-end" type="text" placeholder="My Game !" value={gameName} onChange={(e) => setGameName(e.target.value)} />
                </div>
            )}
            <div>
                {makeNewGame === true && (
                    <div className="create-button-group">
                        <Button variant='primary' onClick={() => handleCreate(gameName)}>Finish Creating Game</Button>
                        <Button variant='primary' onClick={() => cancelNewGame()}>Cancel</Button>
                    </div>
                )}
                {makeNewGame === false && (
                    <div className="create-button-group">
                        <Button variant='primary' onClick={() => setMakeNewGame(true)}>Create Online Game</Button>
                        <Button variant='primary' onClick={() => handleOffline()}>Play Offline</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Lobby;