export const gameNight = (state: any = [], {type, payload}) => {
  switch (type) {
    case "POPULATE_NIGHT":
      return payload;
    case 'UPDATE_NIGHT':
      return state.map(night => {
        return night.id === payload.id ? Object.assign({}, night, payload) : night;
      });
    case 'DELETE_NIGHT':
      return state.filter(night => {
        return night.id !== payload.id;
      });
    default:
      return state;
  }
};