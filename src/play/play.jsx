import React, { useState } from 'react';
import './play.css';

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
    localStorage.setItem('inGame', false);

    function joinGame(game) {
        setPlayState(PlayState.Setup);
        localStorage.setItem('gameState', 'setup');
        localStorage.setItem('currentGame', JSON.stringify(game));
    }

    function startGame() {
        console.log('in startGame');
        setPlayState(PlayState.PlayingGame); 
        localStorage.setItem('gameState', 'play');
    }
    
    return (
        <main className="container-fluid text-center body-primary">
            {/* {playState !== PlayState.Unknown && <h1 id="welcome">Welcome to Pokemon Battleship!</h1>} */}
            {playState === PlayState.InLobby && (
                <Lobby
                    onPlayGame={(game = null) => {joinGame(game)}}
                />
            )}
            {(playState === PlayState.Setup || playState === PlayState.PlayingGame) && (
                <Game playState={playState} onSetupDone={startGame} />
            )}    
        </main>
    );
}