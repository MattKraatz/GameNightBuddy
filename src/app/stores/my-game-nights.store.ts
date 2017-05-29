import {GameNight} from '../models/game-night.model';

export const myGameNights = (state: GameNight[] = new Array<GameNight>(), {type, payload}) => {
  switch (type) {
    case "MY_GAME_NIGHTS_POPULATE":
      return payload;
    case "MY_GAME_NIGHTS_CREATE":
      return [...state, payload];
    default:
      return state;
  }
};