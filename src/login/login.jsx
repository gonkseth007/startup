import React from 'react';

export function Login() {
  return (
    <main className="container-fluid text-center body-primary">
        <div>
            <h1 id="welcome">Welcome to Pokemon Battleship!</h1>
            <form method="get" action="play.html">
                <h3>Login or Register</h3>
                <div className="input-group my-3">
                    <span className="input-group-text">Username:</span>
                    <input className="form-control rounded-end" type="text" placeholder="your@email.com" />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Password:&nbsp;</span>
                    <input className="form-control rounded-end" type="password" placeholder="mypassword123" />
                </div>
                <button className="btn btn-primary" type="submit">Login</button>
                <button className="btn btn-primary" type="submit">Register</button>
            </form>
        </div>
    </main>
  );
}