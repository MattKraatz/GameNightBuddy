import {GameNight} from '../models/game-night.model';

export const gameNight = (state: GameNight = new GameNight(), {type, payload}) => {
  switch (type) {
    case "POPULATE_NIGHT":
      return payload;
    case 'CREATE_GAME_IN_GAME_NIGHT':
      state.collection.push(payload);
      return state;
    case 'CREATE_MEMBER_IN_GAME_NIGHT':
      state.members.push(payload);
      return state;
    case 'UPDATE_NIGHT':
      return state.id === payload.id ? Object.assign({}, state, payload) : state;
    case 'DELETE_NIGHT':
      return new GameNight();
    default:
      return state;
  }
};