export class Game {

  constructor(
    public id: number,
    public name: string,
    public owner: string,
    public minPlayers: number,
    public maxPlayers?: number
  ) {  }

}