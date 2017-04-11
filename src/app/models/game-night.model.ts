import {Member} from './member.model';
import {Auth} from './auth.model';
import {Game} from './game.model';

interface IGameNight {
  id: string;
  name: string;
  hosts: Auth[];
  members?: Member[];
  collection?: Game[];
}

export class GameNight {

  public id: string;
  public name: string;
  public hosts: Auth[];
  public members?: Member[];
  public collection?: Game[];

  constructor(obj?: IGameNight) {
    this.id = obj && obj.id || "";
    this.name = obj && obj.name || "";
    this.hosts = obj && obj.hosts || new Array<Auth>();
    this.members = obj && obj.members || new Array<Member>();
    this.collection = obj && obj.collection || new Array<Game>();
  }
  
}