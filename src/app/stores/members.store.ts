export const members = (state: any = [], {type, payload}) => {
  switch (type) {
    case "POPULATE_MEMBERS":
      return payload;
    case "CREATE_MEMBER":
      return [...state, payload];
    case 'UPDATE_MEMBER':
      return state.map(member => {
        return member.id === payload.id ? Object.assign({}, member, payload) : member;
      });
    case 'DELETE_MEMBER':
      return state.filter(member => {
        return member.id !== payload.id;
      });
    default:
      return state;
  }
};