import {Auth} from './auth.model';

interface IGame {
  id: string;
  name: string;
  owner: Auth;
  minPlayers: number;
  maxPlayers?: number;
}

export class Game {

  public id: string;
  public name: string;
  public owner: Auth;
  public minPlayers: number;
  public maxPlayers?: number;

  constructor(obj?: IGame) {
    this.id = obj && obj.id || "";
    this.name = obj && obj.name || "";
    this.owner = obj && obj.owner || new Auth();
    this.minPlayers = obj && obj.minPlayers || null;
    this.maxPlayers = obj && obj.maxPlayers || null;
  }
  
}