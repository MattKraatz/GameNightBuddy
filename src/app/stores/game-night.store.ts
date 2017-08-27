import {GameNight} from '../models/game-night.model';
import {StoreActions} from '../constants/storeActions';
import {Activity} from '../models/activity.model';

export const gameNight = (state: GameNight = new GameNight(), {type, payload}) => {
  switch (type) {
    case "GAME_NIGHT_POPULATE_NIGHT":
      return payload;
    case 'GAME_NIGHT_CREATE_GAME':
      state.Games.unshift(payload);
      return state;
    case StoreActions.GAME_NIGHT_DELETE_GAME:
      state.Games = state.Games.filter(g => {
        // payload is GameId only
        return g.GameId != payload;
      });
      return Object.assign({}, state);
    case StoreActions.UPDATE_GAME:
      state.Games = state.Games.map(game => {
        return game.GameId === payload.GameId ? Object.assign({}, game, payload) : game;
      })
      return state;
    case StoreActions.GAME_NIGHT_CREATE_MEMBER:
      state.Members.unshift(payload);
      return state;
    case StoreActions.GAME_NIGHT_DELETE_MEMBER:
      state.Members = state.Members.filter(m => {
        // payload is MemberId only  
        return m.MemberId != payload;
      });
      return Object.assign({}, state);
    case 'GAME_NIGHT_CREATE_MATCH':
      state.Matches.unshift(payload);
      return state;
    case StoreActions.GAME_NIGHT_UPDATE_MATCH:
      state.Matches = state.Matches.map(m => {
        return m.MatchId == payload.MatchId ? payload : m;
      });
      return state;
    case StoreActions.GAME_NIGHT_DELETE_MATCH:
      state.Matches = state.Matches.filter(m => {
        return m.MatchId != payload;
      });
      return Object.assign({}, state);
    case 'GAME_NIGHT_UPDATE':
      return state.GameNightId === payload.GameNightId ? Object.assign({}, state, payload) : state;
    case 'GAME_NIGHT_DELETE':
      return new GameNight();
    case StoreActions.GAME_NIGHT_POPULATE_NOTIFICATIONS:
      state.Notifications = payload;
      return Object.assign({}, state);
    default:
      return state;
  }
};