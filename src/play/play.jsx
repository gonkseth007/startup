import React, { useState } from 'react';
import './play.css';

// import  Game  from './game.jsx';
import  Lobby  from './lobby.jsx';
import Game from './game.jsx';
import { PlayState } from './playState';

const rowLabels = "ABCDEFGHIJ".split("");
const columns = Array.from({ length: 10 }, (_, index) => index + 1);

export function Play(props) {
    const userName = props.userName;

    const [gameState, setInGame] = React.useState(localStorage.getItem('gameState') || 'lobby');
    const [guess, setGuess] = React.useState('');
    const currentPlayState = gameState == 'lobby' ? PlayState.InLobby : (gameState == 'setup' ? PlayState.Setup : PlayState.PlayingGame);
    const [playState, setPlayState] = React.useState(currentPlayState);
    console.log(playState);
    localStorage.setItem('inGame', false);

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
            {(playState === PlayState.Setup || playState === PlayState.PlayingGame) && (
                <Game playState={playState} onSetupDone={() => {setPlayState(PlayState.PlayingGame)}} />
                // <Unauthenticated
                //     userName={userName}
                //     displayName={displayName}
                //     onLogin={(loginUserName, displayName) => {
                //         onAuthChange(loginUserName, displayName, AuthState.Authenticated);
                //     }}
                // />
            )}
            {/* {playState === PlayState.PlayingGame && (
                <Unauthenticated
                    userName={userName}
                    displayName={displayName}
                    onLogin={(loginUserName, displayName) => {
                        onAuthChange(loginUserName, displayName, AuthState.Authenticated);
                    }}
                />
            )} */}
            
        </main>
    );
}