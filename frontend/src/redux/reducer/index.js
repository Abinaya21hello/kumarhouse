// src/redux/actions/index.js
import { SET_LOGIN, LOGOUT, SET_CART_ITEMS, ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART } from './types';

// Action creators using these constants
export const setLogin = (isLogin) => ({
  type: SET_LOGIN,
  payload: isLogin,
});

// Other action creators...
