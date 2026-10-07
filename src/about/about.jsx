import React from 'react';
import './about.css';

export function About() {
  return (
    <main class="container-fluid text-center">
        <div>
            <h3 class="mb-3" id="welcome">About Pokemon Battleship!</h3>
            <img src="images/pokemon_cards.jpg" width="450" alt="Pokemon trading cards spread out on the ground" />
            <div>
                Battleship is a two-player game where players place 
                (to hide) their ships and try to find and sink their 
                opponent's fleet of ships. It is considered a strategy 
                guessing game as players will take turns calling shots 
                or making guesses to find their opponent's ships.
            </div>
            <br />
            <div>
                The name Battleship is a registered trademark of Hasbro. 
                Pokemon is a registered trademark of Nintendo.
                Both their uses are solely for non profit educational use.
            </div>
        </div>
    </main>
  );
}