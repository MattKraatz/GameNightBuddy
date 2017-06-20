import {GameNight} from '../models/game-night.model';
import {StoreActions} from '../constants/storeActions';

export const gameNight = (state: GameNight = new GameNight(), {type, payload}) => {
  switch (type) {
    case "GAME_NIGHT_POPULATE_NIGHT":
      return payload;
    case 'GAME_NIGHT_CREATE_GAME':
      state.Games.push(payload);
      return state;
    case 'GAME_NIGHT_DELETE_GAME':
      state.Games = state.Games.filter(g => {
        return g.GameId != payload.GameId;
      });
      return state;
    case StoreActions.GAME_NIGHT_CREATE_MEMBER:
      state.Members.push(payload);
      return state;
    case 'GAME_NIGHT_DELETE_MEMBER':
      state.Members = state.Members.filter(m => {
        return m.UserId != payload.UserId;
      });
      return state;
    case 'GAME_NIGHT_CREATE_MATCH':
      state.Matches.push(payload);
      return state;
    case StoreActions.GAME_NIGHT_UPDATE_MATCH:
      state.Matches = state.Matches.map(m => {
        return m.MatchId == payload.MatchId ? payload : m;
      });
      return state;
    case 'GAME_NIGHT_DELETE_MATCH':
      state.Matches = state.Matches.filter(m => {
        return m.MatchId != payload.MatchId;
      });
      return state;
    case 'GAME_NIGHT_UPDATE':
      return state.GameNightId === payload.GameNightId ? Object.assign({}, state, payload) : state;
    case 'GAME_NIGHT_DELETE':
      return new GameNight();
    default:
      return state;
  }
};