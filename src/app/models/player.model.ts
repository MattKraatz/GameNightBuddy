import {Member, IMember} from './member.model';

interface IPlayer extends IMember {
  FirstTime: boolean;
  Winner: boolean;
  Score?: number;
  Team?: string;
}

export class Player extends Member {

  public FirstTime: boolean;
  public Winner: boolean;
  public Score?: number;
  public Team?: string;

  constructor(obj?: IPlayer) {
    super(obj)
    this.FirstTime = obj && obj.FirstTime || false;
    this.Winner = obj && obj.Winner || false;
    this.Score = obj && obj.Score || null;
    this.Team = obj && obj.Team || "";
  }

}