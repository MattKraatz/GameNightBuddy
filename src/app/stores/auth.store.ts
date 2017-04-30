import {Auth} from '../models/auth.model';

export const auth = (state: Auth = new Auth(), {type, payload}) => {
  switch (type) {
    case "LOGIN_USER":
      return payload;
    case 'LOGOUT_USER':
      return new Auth();
    default:
      return state;
  }
};