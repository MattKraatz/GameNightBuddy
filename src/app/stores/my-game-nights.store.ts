export const myGameNights = (state: any = [], {type, payload}) => {
  switch (type) {
    case "POPULATE_NIGHTS":
      return payload;
    case "CREATE_NIGHT":
      return [...state, payload];
    default:
      return state;
  }
};