import {Member} from './member.model';
import {Auth} from './auth.model';
import {Game} from './game.model';
import {Match} from './match.model';

interface IGameNight {
  id: string;
  name: string;
  hosts: Auth[];
  members?: Member[];
  collection?: Game[];
  matches?: Match[];
}

export class GameNight {

  public id: string;
  public name: string;
  public hosts: Auth[];
  public members?: Member[];
  public collection?: Game[];
  public matches?: Match[];

  constructor(obj?: IGameNight) {
    this.id = obj && obj.id || "";
    this.name = obj && obj.name || "";
    this.hosts = obj && obj.hosts || new Array<Auth>();
    this.members = obj && obj.members || new Array<Member>();
    this.collection = obj && obj.collection || new Array<Game>();
    this.matches = obj && obj.matches || new Array<Match>();
  }
  
}