import {Match} from '../models/match.model';

export const matches = (state: Match[] = new Array<Match>(), {type, payload}) => {
  switch (type) {
    case "POPULATE_MATCHES":
      return payload;
    case "CREATE_MATCH":
      return [...state, payload];
    case 'UPDATE_MATCH':
      return state.map(match => {
        return match.MatchId === payload.MatchId ? Object.assign({}, match, payload) : match;
      });
    case 'DELETE_MATCH':
      return state.filter(match => {
        return match.MatchId !== payload.MatchId;
      });
    default:
      return state;
  }
};