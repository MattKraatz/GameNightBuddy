import {User} from '../models/user.model';

export const user = (state: User = new User(), {type, payload}) => {
  switch (type) {
    case "LOGIN_USER":
      return payload;
    case 'LOGOUT_USER':
      return new User();
    default:
      return state;
  }
};