import {GameNight} from '../models/game-night.model';
import {StoreActions} from '../constants/storeActions';

export const myGameNights = (state: GameNight[] = new Array<GameNight>(), {type, payload}) => {
  switch (type) {
    case "MY_GAME_NIGHTS_POPULATE":
      return payload;
    case "MY_GAME_NIGHTS_CREATE":
      return [...state, payload];
    case StoreActions.OTHER_GAME_NIGHTS_JOIN:
      return [...state, payload];
    case StoreActions.MY_GAME_NIGHTS_DELETE:
      return state.filter(n => n.GameNightId != payload);
    default:
      return state;
  }
};