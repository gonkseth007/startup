import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  const navigate = useNavigate();

  return (
    <main className="container-fluid text-center body-primary">
        <div>
            {authState !== AuthState.Unknown && <h1 id="welcome">Welcome to Pokemon Battleship!</h1>}
            {authState === AuthState.Authenticated && (
                <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
            )}
            {authState === AuthState.Unauthenticated && (
                <Unauthenticated
                    userName={userName}
                    onLogin={(loginUserName) => {
                    onAuthChange(loginUserName, AuthState.Authenticated);
                    }}
                />
            )}
        </div>
    </main>
  );
}