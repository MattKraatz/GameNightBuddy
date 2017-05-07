import {GameNight} from '../models/game-night.model';

export const myGameNights = (state: GameNight[] = new Array<GameNight>(), {type, payload}) => {
  switch (type) {
    case "POPULATE_MY_NIGHTS":
      return payload;
    case "CREATE_NIGHT":
      return [...state, payload];
    default:
      return state;
  }
};