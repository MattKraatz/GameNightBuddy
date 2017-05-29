import {Game} from '../models/game.model';

export const collection = (state: Game[] = new Array<Game>(), {type, payload}) => {
  switch (type) {
    case "COLLECTION_POPULATE":
      return payload;
    case "COLLECTION_CREATE_GAME":
      return [...state, payload];
    case 'COLLECTION_UPDATE_GAME':
      return state.map(game => {
        return game.GameId === payload.GameId ? Object.assign({}, game, payload) : game;
      });
    case 'COLLECTION_DELETE_GAME':
      return state.filter(game => {
        return game.GameId !== payload.GameId;
      });
    default:
      return state;
  }
};