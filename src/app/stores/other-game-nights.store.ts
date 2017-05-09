import {GameNight} from '../models/game-night.model';

export const otherGameNights = (state: GameNight[] = new Array<GameNight>(), {type, payload}) => {
  switch (type) {
    case "POPULATE_OTHER_NIGHTS":
      return payload;
    default:
      return state;
  }
};