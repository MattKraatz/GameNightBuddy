import {Member} from '../models/member.model';
import {Game} from '../models/game.model';
import {Match} from '../models/match.model';
import {User} from '../models/user.model';

export interface AppStore {
  members: Member[],
  collection: Game[],
  matches: Match[],
  user: User
}