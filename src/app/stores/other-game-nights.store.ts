import {GameNight} from '../models/game-night.model';
import {StoreActions} from '../constants/storeActions';

export function otherGameNights(state: GameNight[] = new Array<GameNight>(), {type, payload}) {
  switch (type) {
    case "OTHER_GAME_NIGHTS_POPULATE":
      return payload;
    case StoreActions.OTHER_GAME_NIGHTS_JOIN:
      return state.filter(n => {
        return n.GameNightId != payload.GameNightId
      })
    default:
      return state;
  }
};