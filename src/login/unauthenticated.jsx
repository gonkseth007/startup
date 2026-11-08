import React from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';
// import './../app.css';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [displayName, setDisplayName] = React.useState(props.displayName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  function completeLogin(user) {
    localStorage.setItem('userName', user.email);
    localStorage.setItem('displayName', user.displayName);
    props.onLogin(user.email, user.displayName);
  }

  async function loginUser() {
    setDisplayError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userName, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        setDisplayError(
          response.status === 401
            ? 'Incorrect username or password.'
            : body.msg || 'Login failed.'
        );
        return;
      }

      completeLogin(body);
    } catch {
      setDisplayError('Could not connect to the server.');
    } finally {
      setSubmitting(false);
    }
  }

  async function createUser() {
    setDisplayError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userName,
          displayName,
          password,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setDisplayError(
          response.status === 409
            ? 'That username already exists.'
            : body.msg || 'Registration failed.'
        );
        return;
      }

      completeLogin(body);
    } catch (_error) {
      setDisplayError('Could not connect to the server.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={(event) => event.preventDefault()}>
        <h3>Login or Register</h3>
        <div className="input-group my-3">
            <span className="input-group-text">Username:</span>
            <input className="form-control rounded-end" type="text" placeholder="your@email.com" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div className="input-group my-3">
            <span className="input-group-text">Display Name:</span>
            <input className="form-control rounded-end" type="text" placeholder="John Hancock" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Password:&nbsp;</span>
            <input className="form-control rounded-end" type="password" placeholder="mypassword123" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button variant="primary" onClick={() => loginUser()} disabled={!userName || !password || submitting}>Login</Button>
        <Button variant="primary" onClick={() => createUser()} disabled={!userName || !displayName || !password || submitting}>Register</Button>
        {/* <div>
          <div className='input-group mb-3'>
            <span className='input-group-text'>@</span>
            <input className='form-control' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='your@email.com' />
          </div>
          <div className='input-group mb-3'>
            <span className='input-group-text'>🔒</span>
            <input className='form-control' type='password' onChange={(e) => setPassword(e.target.value)} placeholder='password' />
          </div>
          <Button variant='primary' onClick={() => loginUser()} disabled={!userName || !password}>
            Login
          </Button>
          <Button variant='secondary' onClick={() => createUser()} disabled={!userName || !password}>
            Create
          </Button>
        </div> */}

        <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
      </form>
    </>
  );
}
