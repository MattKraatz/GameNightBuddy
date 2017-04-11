import {Game} from '../models/game.model';

export const collection = (state: Game[] = new Array<Game>(), {type, payload}) => {
  switch (type) {
    case "POPULATE_COLLECTION":
      return payload;
    case "CREATE_GAME":
      return [...state, payload];
    case 'UPDATE_GAME':
      return state.map(game => {
        return game.id === payload.id ? Object.assign({}, game, payload) : game;
      });
    case 'DELETE_GAME':
      return state.filter(game => {
        return game.id !== payload.id;
      });
    default:
      return state;
  }
};