import { createEmptyBoard } from "./board.js";

export class Game {

  constructor(name, hostPlayer) {
    this.name = name;
    this.hostPlayer = hostPlayer;
  }
}

export function createGame(name, hostPlayer) {
    return {
        id: crypto.randomUUID(),
        name,
        hostPlayer,
        otherPlayer: null,
        status: "waiting",
        currentTurn: "host",
        mode: "online",
        boards: {
            host: createEmptyBoard(),
            guest: createEmptyBoard(),
        }
    };
}

export function joinGame(game, player) {
//   if (game.status !== "waiting" || player.userName === game.hostPlayer.userName) {
//     return game;
//   }

  return {
    ...game,
    otherPlayer: player,
    status: "in-progress",
  };
}