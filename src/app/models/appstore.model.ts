import {Game} from '../models/game.model';
import {Match} from '../models/match.model';
import {Auth} from '../models/auth.model';
import {GameNight} from '../models/game-night.model';

export interface AppStore {
  collection: Game[],
  matches: Match[],
  user: Auth,
  gameNight: GameNight,
  myGameNights: GameNight[]
}

export interface IStoreAction {
  type: string,
  payload: {}
}