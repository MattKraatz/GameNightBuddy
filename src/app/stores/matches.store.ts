export const matches = (state: any = [], {type, payload}) => {
  switch (type) {
    case "POPULATE_MATCHES":
      return payload;
    case "CREATE_MATCH":
      return [...state, payload];
    case 'UPDATE_MATCH':
      return state.map(match => {
        return match.id === payload.id ? Object.assign({}, match, payload) : match;
      });
    case 'DELETE_MATCH':
      return state.filter(match => {
        return match.id !== payload.id;
      });
    default:
      return state;
  }
};