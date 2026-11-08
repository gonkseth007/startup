
import React from 'react';
import './stats.css';

export function Stats() {
  const [stats, setStats] = React.useState([]);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error(response.status === 401
            ? 'Your login has expired. Please log in again.'
            : 'Could not load stats.');
        }

        const result = await response.json();
        if (!cancelled) setStats(result);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => { cancelled = true; };
  }, []);

  const sortedPlayers = [...stats].sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  const userName = localStorage.getItem('userName');
  const userStats = sortedPlayers.find((player) => player.userName === userName);
  const userIndex = sortedPlayers.findIndex((player) => player.userName === userName);
  const userRank = userIndex >= 0 ? userIndex + 1 : 'Unranked';
  const topPlayers = sortedPlayers.slice(0, 10);

  return (
    <main className="container-fluid body-primary">
      <div>
        <h3>My Stats</h3>
        {loading && <p>Loading stats…</p>}
        {error && <p role="alert">{error}</p>}
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
              <td className="table-cell">{userStats?.wins ?? 0}</td>
              <td className="table-cell">{userStats?.losses ?? 0}</td>
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
          <tbody>
            {topPlayers.map((stat, index) => (
              <tr className={index % 2 === 0 ? 'table-row' : 'table-row-alt'} key={stat.userName}>
                <td className="table-cell">{index + 1}</td>
                <td className="table-cell">{stat.displayName}</td>
                <td className="table-cell">{stat.wins}</td>
                <td className="table-cell">{stat.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}