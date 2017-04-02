import {Member} from '../models/member.model';
import {Game} from '../models/game.model';
import {Match} from '../models/match.model';

export interface AppStore {
  members: Member[],
  collection: Game[],
  matches: Match[]
}