import {Member} from './member.model';

export class Player {
  constructor(
    public id: string,
    public member: Member,
    public firstTime: boolean,
    public score?: number,
    public team?: string
  ) {  }
}