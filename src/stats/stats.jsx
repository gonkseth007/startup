import React from 'react';
import './stats.css';
import { initializeStats } from './stats.js';

export function Stats() {
    React.useEffect(() => { initializeStats();}, []);
    const stats = JSON.parse(localStorage.getItem("playerStats"));
    const sortedPlayers = [...stats].sort((a, b) => b.wins - a.wins || a.losses - b.losses);

    const userName = localStorage.getItem("userName"); 
    const userStats = sortedPlayers.find((player) => player.userName === userName);
    const userRank = sortedPlayers.findIndex(person => person.userName === userName) + 1;

    const topPlayers = sortedPlayers.slice(0, 10);

    const statsRows = [];
    for (const [i, stat] of topPlayers.entries()) {
        statsRows.push(
            <tr className={i % 2 === 0 ? "table-row" : "table-row-alt"} key={i}>
                <td className="table-cell">{i+1}</td>
                <td className="table-cell">{stat.displayName}</td>
                <td className="table-cell">{stat.wins}</td>
                <td className="table-cell">{stat.losses}</td>
            </tr>
        );
    }
    return (
        <main className="container-fluid body-primary">
            <div>
                <h3>My Stats</h3>
                <table>
                    <thead>
                        <tr className="table-row-alt">
                            <th className="table-cell">Rank</th>
                            <th className="table-cell">Wins</th>
                            <th className="table-cell">Losses</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-row">
                            <td className="table-cell">{userRank}</td>
                            <td className="table-cell">{userStats.wins}</td>
                            <td className="table-cell">{userStats.losses}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        
            <div>
                <h3>Top 10 Players</h3>
                <table>
                    <thead>
                        <tr className="table-row-alt">
                            <th className="table-cell">Rank</th>
                            <th className="table-cell">Name</th>
                            <th className="table-cell">Wins</th>
                            <th className="table-cell">Losses</th>
                        </tr>
                    </thead>
                    <tbody>{statsRows}</tbody>
                </table>
            </div>
    </main>
    );
}