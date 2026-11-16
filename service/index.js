const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const DB = require('./database.js');

const app = express();
const authCookieName = 'token';
const port = process.env.PORT || (process.argv[2] || 4000);

// index.js lives in service/, so a Vite build in the project root is ../dist.
const projectRoot = path.resolve(__dirname, '..');
const frontendDir = [
  path.join(projectRoot, 'dist'),
  path.join(projectRoot, 'build'),
  path.join(__dirname, 'public'),
].find((directory) => fs.existsSync(path.join(directory, 'index.html')))
  || path.join(projectRoot, 'dist');

app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res, next) => {
  try {
    const { email, displayName, password } = req.body;
    if (!email || !displayName || !password) {
      return res.status(400).send({ msg: 'Username, display name, and password are required.' });
    }

    if (await DB.getUser(email)) {
      return res.status(409).send({ msg: 'Existing user' });
    }

    const user = await createUser(email, displayName, password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email, displayName: user.displayName });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ msg: 'Existing user' });
    }
    next(error);
  }
});

apiRouter.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = email ? await DB.getUser(email) : null;
    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }

    user.token = uuid.v4();
    await DB.updateUser(user);
    setAuthCookie(res, user.token);
    res.send({ email: user.email, displayName: user.displayName });
  } catch (error) {
    next(error);
  }
});

apiRouter.delete('/auth/logout', async (req, res, next) => {
  try {
    const user = await findUserByToken(req.cookies[authCookieName]);
    if (user) await DB.updateUserRemoveAuth(user);
    res.clearCookie(authCookieName, cookieOptions());
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

const verifyAuth = async (req, res, next) => {
  try {
    const user = await findUserByToken(req.cookies[authCookieName]);
    if (!user) return res.status(401).send({ msg: 'Unauthorized' });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send({ email: req.user.email, displayName: req.user.displayName });
});

apiRouter.get('/stats', verifyAuth, async (_req, res, next) => {
  try {
    res.send(await DB.getStats());
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/stat', verifyAuth, async (req, res, next) => {
  try {
    const { outcome } = req.body;
    if (outcome !== 'win' && outcome !== 'loss') {
      return res.status(400).send({ msg: 'Outcome must be win or loss' });
    }

    const updatedUser = await DB.incrementStat(req.user._id, outcome);
    res.send({
      userName: updatedUser.email,
      displayName: updatedUser.displayName,
      wins: updatedUser.wins,
      losses: updatedUser.losses,
    });
  } catch (error) {
    next(error);
  }
});

// Serve the built frontend through Express. Run `npm run build` first.
app.use(express.static(frontendDir));
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).send({ msg: 'API endpoint not found' });
  }

  const indexPath = path.join(frontendDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(503).send({ msg: 'Frontend build not found. Run npm run build.' });
  }
  res.sendFile(indexPath);
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).send({ type: error.name, message: 'The service encountered an error.' });
});

async function createUser(email, displayName, password) {
  const user = {
    email,
    displayName,
    password: await bcrypt.hash(password, 10),
    token: uuid.v4(),
    wins: 0,
    losses: 0,
  };
  const result = await DB.addUser(user);
  user._id = result.insertedId;
  return user;
}

function findUserByToken(token) {
  if (!token) return null;
  return DB.getUserByToken(token);
}

function cookieOptions() {
  return {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  };
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, cookieOptions());
}

async function start() {
  console.log('Starting Pokémon Battleship service...');
  await DB.connect();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error(`Unable to start the service: ${error.message}`);
  process.exit(1);
});
