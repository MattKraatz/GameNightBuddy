import {User} from '../models/user.model';
import {StoreActions} from '../constants/storeActions';

export function user (state: User = new User(), {type, payload}) {
  switch (type) {
    case StoreActions.LOGIN_USER:
      return payload;
    case 'LOGOUT_USER':
      return new User();
    case 'USER_UPDATE':
      return Object.assign({}, state, payload)
    default:
      return state;
  }
};