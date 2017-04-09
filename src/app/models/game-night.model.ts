import {Auth} from './auth.model';
import {Game} from './game.model';

interface IGameNight {
  id: string;
  name: string;
  hosts: Auth[];
  members?: Auth[];
  collection?: Game[];
}

export class GameNight {

  public id: string;
  public name: string;
  public hosts: Auth[];
  public members?: Auth[];
  public collection?: Game[];

  constructor(obj?: IGameNight) {
    this.id = obj && obj.id || "";
    this.name = obj && obj.name || "";
    this.hosts = obj && obj.hosts || new Array<Auth>();
    this.members = obj && obj.members || new Array<Auth>();
    this.collection = obj && obj.collection || new Array<Game>();
  }
  
}