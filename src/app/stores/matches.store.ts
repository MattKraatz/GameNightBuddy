import {Match} from '../models/match.model';

export const matches = (state: Match[] = new Array<Match>(), {type, payload}) => {
  switch (type) {
    case "MATCHES_POPULATE":
      return payload;
    case "MATCHES_CREATE":
      return [...state, payload];
    case 'MATCHES_UPDATE':
      return state.map(match => {
        return match.MatchId === payload.MatchId ? Object.assign({}, match, payload) : match;
      });
    case 'MATCHES_DELETE':
      return state.filter(match => {
        // Payload is MatchId only
        return match.MatchId !== payload;
      });
    default:
      return state;
  }
};