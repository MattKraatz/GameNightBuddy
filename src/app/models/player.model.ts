import {Member, IMember} from './member.model';

interface IPlayer extends IMember {
  firstTime: boolean;
  score?: number;
  team?: string;
}

export class Player extends Member {

  public firstTime: boolean;
  public score?: number;
  public team?: string;

  constructor(obj?: IPlayer) {
    super(obj)
    this.firstTime = obj && obj.firstTime || false;
    this.score = obj && obj.score || null;
    this.team = obj && obj.team || "";
  }

}