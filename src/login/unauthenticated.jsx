import React from 'react';

// import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';
import './../app.css';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  async function createUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  return (
    <>
      <form>
      <h3>Login or Register</h3>
      <div className="input-group my-3">
          <span className="input-group-text">Username:</span>
          <input className="form-control rounded-end" type="text" placeholder="your@email.com" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div className="input-group mb-3">
          <span className="input-group-text">Password:&nbsp;</span>
          <input className="form-control rounded-end" type="password" placeholder="mypassword123" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" type="submit" onClick={() => loginUser()} disabled={!userName || !password}>Login</button>
      <button className="btn btn-primary" type="submit" onClick={() => createUser()} disabled={!userName || !password}>Register</button>
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
