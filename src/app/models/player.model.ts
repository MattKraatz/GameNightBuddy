import {Member} from './member.model';

interface IPlayer {
  id: string;
  member: Member;
  firstTime: boolean;
  score?: number;
  team?: string;
}

export class Player {

    public id: string;
    public member: Member;
    public firstTime: boolean;
    public score?: number;
    public team?: string;

  constructor(obj?: IPlayer) {
    this.id = obj && obj.id || "";
    this.member = obj && obj.member || new Member();
    this.firstTime = obj && obj.firstTime || false;
    this.score = obj && obj.score || null;
    this.team = obj && obj.team || "";
  }
}