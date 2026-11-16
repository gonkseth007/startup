const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('pokemonBattleship');
const userCollection = db.collection('user');

async function connect() {
  await client.connect();
  await db.command({ ping: 1 });
  console.log('Connect to database');
}

function getUser(email) {
  return userCollection.findOne({ email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

function addUser(user) {
  return userCollection.insertOne(user);
}

function updateUser(user) {
  return userCollection.updateOne(
    { _id: user._id },
    { $set: { token: user.token } },
  );
}

function updateUserRemoveAuth(user) {
  return userCollection.updateOne(
    { _id: user._id },
    { $unset: { token: '' } },
  );
}

async function incrementStat(userId, outcome) {
  const statField = outcome === 'win' ? 'wins' : 'losses';
  await userCollection.updateOne(
    { _id: userId },
    { $inc: { [statField]: 1 } },
  );
  return userCollection.findOne({ _id: userId });
}

async function getStats() {
  const users = await userCollection
    .find({}, { projection: { _id: 0, email: 1, displayName: 1, wins: 1, losses: 1 } })
    .toArray();

  return users.map(({ email, displayName, wins, losses }) => ({
    userName: email,
    displayName,
    wins,
    losses,
  }));
}

module.exports = {
  connect,
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  incrementStat,
  getStats,
};
