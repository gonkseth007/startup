import React from 'react';
import Button from 'react-bootstrap/Button';

import './lobby.css';

function Lobby({ onJoinGame }) {
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
                <tr className="table-row">
                    <td className="game-table-block">My Game</td>
                    <td className="game-table-block">John</td>
                    <td className="game-table-block"><Button variant='primary'>Join</Button></td>
                </tr>
                <tr className="table-row-alt">
                    <td className="game-table-block">Coolio Game</td>
                    <td className="game-table-block">Cool Guy</td>
                    <td className="game-table-block"><Button variant='primary'>Join</Button></td>
                </tr>
            </tbody>
        </table>

        <div className="create-button-group">
            <Button variant='primary'>Create Online Game</Button>
            <Button variant='primary'>Play Offline</Button>
        </div>
    </div>
  );
}

export default Lobby;