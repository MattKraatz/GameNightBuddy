import {GameNight} from '../models/game-night.model';

export const gameNight = (state: GameNight = new GameNight(), {type, payload}) => {
  switch (type) {
    case "GAME_NIGHT_POPULATE_NIGHT":
      return payload;
    case 'GAME_NIGHT_CREATE_GAME':
      state.Games.push(payload);
      return state;
    case 'GAME_NIGHT_DELETE_GAME':
      return state.Games.filter(g => {
        return g.GameId != payload.GameId;
      });
    case 'GAME_NIGHT_CREATE_MEMBER':
      state.Members.push(payload);
      return state;
    case 'GAME_NIGHT_DELETE_MEMBER':
      return state.Members.filter(m => {
        return m.UserId != payload.UserId;
      });
    case 'GAME_NIGHT_CREATE_MATCH':
      state.Matches.push(payload);
      return state;
    case 'GAME_NIGHT_UPDATE_MATCH':
      return state.Matches.map(m => {
        return m.MatchId == payload.MatchId ? Object.assign({}, m, payload) : m;
      });
    case 'GAME_NIGHT_DELETE_MATCH':
      return state.Matches.filter(m => {
        return m.MatchId != payload.MatchId;
      });
    case 'GAME_NIGHT_UPDATE':
      return state.GameNightId === payload.GameNightId ? Object.assign({}, state, payload) : state;
    case 'GAME_NIGHT_DELETE':
      return new GameNight();
    default:
      return state;
  }
};