import React, { useState } from 'react';
import './play.css';

// import  Game  from './game.jsx';
import  Lobby  from './lobby.jsx';
import Board from './board.jsx';
import { PlayState } from './playState';

const rowLabels = "ABCDEFGHIJ".split("");
const columns = Array.from({ length: 10 }, (_, index) => index + 1);

export function Play(props) {
    const userName = props.userName;

    const [gameState, setInGame] = React.useState(localStorage.getItem('gameState') || 'lobby');
    const [guess, setGuess] = React.useState('');
    const currentPlayState = gameState == 'lobby' ? PlayState.InLobby : (gameState == 'setup' ? PlayState.Setup : PlayState.PlayingGame);
    const [playState, setPlayState] = React.useState(currentPlayState);
    localStorage.setItem('inGame', false);

    const handleChange = (e) => {
        const rawValue = e.target.value.toUpperCase();
        const regex = /^[A-J]?(?:10|[1-9]?)?$/;

        if (regex.test(rawValue)) {
            setGuess(rawValue);
        }
    }

    function joinGame(game) {
        setPlayState(PlayState.Setup);
        localStorage.setItem('gameState', 'setup');
        localStorage.setItem('currentGame', JSON.stringify(game));
    }
    
    return (
        <main className="container-fluid text-center body-primary">
            {/* {playState !== PlayState.Unknown && <h1 id="welcome">Welcome to Pokemon Battleship!</h1>} */}
            {playState === PlayState.InLobby && (
                <Lobby
                    // onJoinGame={(gameID, opponentName, displayName) => {
                    //     onJoinGame(gameID, opponentName, displayName, PlayState.Setup);
                    // }}
                    // onCreateGame={(gameName, displayName) => {
                    //     onCreateGame(gameName, displayName, PlayState.Setup);
                    // }}
                    // onPlayOffline={(displayName) => {
                    //     onPlayOffline(displayName, PlayState.Setup);
                    // }}
                    onPlayGame={(game = null) => {joinGame(game)}}
                />
                // <Authenticated userName={userName} displayName={displayName} onLogout={() => onAuthChange(userName, displayName, PlayState.Unauthenticated)} />
            )}
            {playState === PlayState.Setup && (
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

                    <div>
                        {/* 3rd Party API Call Implemented With Pokemon Images As Boats */}
                        <Board onCellClick={(row, column) => console.log(row, column)} />
                    </div>

                    {/*  Websocket placeholder  */}
                    <br />
                    <div>It is MisterMan's turn.</div>
                    <div>MisterMan guessed E6 - Miss!</div>
                    <div>It is GoldenGonk007's turn.</div>
                    <br />

                    <div className="mb-3 guess">
                        <div className="input-group m-3">
                            <span className="input-group-text">Guess:</span>
                            <input className="form-control rounded-end" type="text" placeholder="e.g. &quot;E10&quot;" value={guess} onChange={handleChange} maxLength={3} />
                        </div>
                        <button className="btn btn-primary m-3 mx-2">Make Guess</button>
                        <button className="btn btn-primary m-3 mx-2">Surrender</button>
                    </div>
                </div>
                // <Unauthenticated
                //     userName={userName}
                //     displayName={displayName}
                //     onLogin={(loginUserName, displayName) => {
                //         onAuthChange(loginUserName, displayName, AuthState.Authenticated);
                //     }}
                // />
            )}
            {playState === PlayState.PlayingGame && (
                <Unauthenticated
                    userName={userName}
                    displayName={displayName}
                    onLogin={(loginUserName, displayName) => {
                        onAuthChange(loginUserName, displayName, AuthState.Authenticated);
                    }}
                />
            )}
            
        </main>
    );
}