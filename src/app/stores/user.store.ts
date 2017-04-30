import {User} from '../models/user.model';

export const user = (state: User = new User(), {type, payload}) => {
  switch (type) {
    case "POPULATE_USER_PROFILE":
      return payload;
    case 'LOGOUT_USER':
      return new User();
    default:
      return state;
  }
};