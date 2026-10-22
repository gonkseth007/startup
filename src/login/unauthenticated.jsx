import React from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';
import './../app.css';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [displayName, setDisplayName] = React.useState(props.displayName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    localStorage.setItem('userName', userName);
    localStorage.setItem('displayName', displayName);
    props.onLogin(userName, displayName);
  }

  async function createUser() {
    localStorage.setItem('userName', userName);
    localStorage.setItem('displayName', displayName);
    props.onLogin(userName, displayName);
  }

  return (
    <>
      <form>
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
        <Button variant="primary" onClick={() => loginUser()} disabled={!userName || !displayName || !password}>Login</Button>
        <Button variant="primary" onClick={() => createUser()} disabled={!userName || !displayName || !password}>Register</Button>
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
