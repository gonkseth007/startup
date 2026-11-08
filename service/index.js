const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const authCookieName = 'token';
let users = [];
let stats = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const frontendDir = ['dist', 'build', 'public']
  .map((directory) => path.join(__dirname, directory))
  .find((directory) => fs.existsSync(path.join(directory, 'index.html')))
  || path.join(__dirname, 'dist');

// app.use(express.static('public'));

// JSON body parsing using built-in middleware
app.use(express.json());
app.use(cookieParser());

// Serve up the front-end static content hosting
// app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res, next) => {
    try {
        if (await findUser('email', req.body.email)) {
            res.status(409).send({ msg: 'Existing user' });
        } else {
            const user = await createUser(req.body.email, req.body.displayName, req.body.password);

            setAuthCookie(res, user.token);
            res.send({ email: user.email, displayName: user.displayName });
        }
    } catch (error) {
        next(error);
    }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res, next) => {
  try {
    const user = await findUser('email', req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }

    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send({ email: user.email, displayName: user.displayName });
  } catch (error) {
    next(error);
  }
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

apiRouter.get('/auth/me', verifyAuth, (req, res) => {
    res.send({ email: req.user.email, displayName: req.user.displayName });
});

apiRouter.get('/stats', verifyAuth, (_req, res) => {
    const allStats = users.map(({ email, displayName, wins, losses }) => ({
        userName: email,
        displayName,
        wins,
        losses,
    }));
    res.send(allStats);
});
// SubmitScore
apiRouter.post('/stat', verifyAuth, (req, res) => {
    const { outcome } = req.body;

    if (outcome !== 'win' && outcome !== 'loss') {
        return res.status(400).send({ msg: 'Outcome must be win or loss' });
    }

    if (outcome === 'win') {
        req.user.wins += 1;
    } else {
        req.user.losses += 1;
    }

    res.send({
        userName: req.user.email,
        displayName: req.user.displayName,
        wins: req.user.wins,
        losses: req.user.losses,
    });
});

// Default error handler
app.use(function (err, _req, res, _next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use(express.static(frontendDir));
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).send({ msg: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendDir, 'index.html'));
});

async function createUser(email, displayName, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    displayName: displayName,
    password: passwordHash,
    token: uuid.v4(),
    wins: 0,
    losses: 0,
  };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
