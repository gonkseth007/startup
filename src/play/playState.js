export class PlayState {
  static Unknown = new PlayState('unknown');
  static InLobby = new PlayState('inLobby');
  static Setup = new PlayState('setup');
  static PlayingGame = new PlayState('playingGame');

  constructor(name) {
    this.name = name;
  }
}
