import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('displayName');
    props.onLogout();
  }

  return (
    <div>
      <div className='playerName'>Username: {props.userName}</div>
      <div className='playerName'>Display Name: {props.displayName}</div>
      <Button variant='primary' onClick={() => navigate('/play')}>
        Play
      </Button>
      <Button variant='primary' onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
