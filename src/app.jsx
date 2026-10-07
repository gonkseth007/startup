import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header className="container-fluid">
          <nav className="navbar navbar-dark" aria-label="Navigation">
              <h4>Pokemon Battleship</h4>
              <menu className="navbar-nav">
                  <li className="nav-item"><a className="nav-link active" href="index.html">Home</a></li>
                  <li className="nav-item"><a className="nav-link" href="play.html">Play Game</a></li>
                  <li className="nav-item"><a className="nav-link" href="stats_scores.html">Stats & Scores</a></li>
                  <li className="nav-item"><a className="nav-link" href="about.html">About</a></li>
              </menu>
              <hr />
          </nav>
      </header>

      <main>App components go here</main>

      <footer>
          <div>
              <span className="text-reset">Seth Hilton</span>
          </div>
          <a className="text-reset" href="https://github.com/gonkseth007/startup">GitHub</a>
      </footer>
    </div>
  );
}