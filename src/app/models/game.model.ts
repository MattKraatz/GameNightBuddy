import {Member} from './member.model';

interface IGame {
  id: string;
  name: string;
  owner: Member;
  minPlayers: number;
  maxPlayers?: number;
}

export class Game {

  public id: string;
  public name: string;
  public owner: Member;
  public minPlayers: number;
  public maxPlayers?: number;

  constructor(obj?: IGame) {
    this.id = obj && obj.id || "";
    this.name = obj && obj.name || "";
    this.owner = obj && obj.owner || new Member();
    this.minPlayers = obj && obj.minPlayers || null;
    this.maxPlayers = obj && obj.maxPlayers || null;
  }
  
}