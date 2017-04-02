export const auth = (state: any = {}, {type, payload}) => {
  switch (type) {
    case "LOGIN_USER":
      return payload;
    case 'LOGOUT_USER':
      return {};
    default:
      return state;
  }
};