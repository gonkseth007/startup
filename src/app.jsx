import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Stats_Scores } from './stats_scores/stats_scores';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
            <nav className="navbar navbar-dark" aria-label="Navigation">
                <h4>Pokemon Battleship</h4>
                <menu className="navbar-nav">
                    <li className="nav-item"><NavLink className="nav-link active" to='index'>Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to='play'>Play Game</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to='stats_scores'>Stats & Scores</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to='about'>About</NavLink></li>
                </menu>
                <hr />
            </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login />} exact />
          <Route path='/play' element={<Play />} />
          <Route path='/stats_scores' element={<Stats_Scores />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
            <div>
                <span className="text-reset">Seth Hilton</span>
            </div>
            <a className="text-reset" href="https://github.com/gonkseth007/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}