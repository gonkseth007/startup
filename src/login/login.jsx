import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, displayName, authState, onAuthChange }) {
  const navigate = useNavigate();

  return (
    <main className="container-fluid text-center body-primary">
        <div>
            {authState !== AuthState.Unknown && <h1 id="welcome">Welcome to Pokemon Battleship!</h1>}
            {authState === AuthState.Authenticated && (
                <Authenticated userName={userName} displayName={displayName} onLogout={() => onAuthChange(userName, displayName, AuthState.Unauthenticated)} />
            )}
            {authState === AuthState.Unauthenticated && (
                <Unauthenticated
                    userName={userName}
                    displayName={displayName}
                    onLogin={(loginUserName, displayName) => {
                        onAuthChange(loginUserName, displayName, AuthState.Authenticated);
                    }}
                />
            )}
        </div>
    </main>
  );
}