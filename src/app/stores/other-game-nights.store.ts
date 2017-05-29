import {GameNight} from '../models/game-night.model';

export const otherGameNights = (state: GameNight[] = new Array<GameNight>(), {type, payload}) => {
  switch (type) {
    case "OTHER_GAME_NIGHTS_POPULATE":
      return payload;
    default:
      return state;
  }
};