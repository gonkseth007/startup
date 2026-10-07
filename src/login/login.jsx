import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  return (
    <main className="container-fluid text-center body-primary">
        <div>
            <h1 id="welcome">Welcome to Pokemon Battleship!</h1>
            <form onSubmit={() => navigate("/play")}>
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