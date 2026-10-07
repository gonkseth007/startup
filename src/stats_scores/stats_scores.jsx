import React from 'react';
import './stats_scores.css';

export function Stats_Scores() {
  return (
    <main className="container-fluid body-primary">
      <div>
          <h3>My Stats</h3>
          <table>
              <tr className="table-row-alt">
                  <th className="table-cell">Rank</th>
                  <th className="table-cell">Wins</th>
                  <th className="table-cell">Losses</th>
                  <th className="table-cell">Score</th>
              </tr>
              <tr className="table-row">
                  <td className="table-cell">11</td>
                  <td className="table-cell">3</td>
                  <td className="table-cell">1</td>
                  <td className="table-cell">3100</td>
              </tr>
          </table>
      </div>
      
      <div>
          <h3>Top Scores</h3>
          <table>
              <tr className="table-row-alt">
                  <th className="table-cell">Rank</th>
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Wins</th>
                  <th className="table-cell">Losses</th>
                  <th className="table-cell">Score</th>
              </tr>
              <tr className="table-row">
                  <td className="table-cell">1</td>
                  <td className="table-cell">John Cena</td>
                  <td className="table-cell">11</td>
                  <td className="table-cell">3</td>
                  <td className="table-cell">10900</td>
              </tr>
              <tr className="table-row-alt">
                  <td className="table-cell">2</td>
                  <td className="table-cell">Rick Astley</td>
                  <td className="table-cell">11</td>
                  <td className="table-cell">5</td>
                  <td className="table-cell">10200</td>
              </tr>
              <tr className="table-row">
                  <td className="table-cell">3</td>
                  <td className="table-cell">Phil Swift</td>
                  <td className="table-cell">8</td>
                  <td className="table-cell">3</td>
                  <td className="table-cell">9700</td>
              </tr>
          </table>
      </div>
  </main>
  );
}