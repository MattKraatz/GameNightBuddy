import {Member} from './member.model';

export class Game {
  constructor(
    public id: string,
    public name: string,
    public owner: Member,
    public minPlayers: number,
    public maxPlayers?: number
  ) {  }
}