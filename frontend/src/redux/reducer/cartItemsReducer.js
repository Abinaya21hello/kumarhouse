// reducers.js
import {
  FETCH_CART_ITEMS,
  FETCH_WISH_ITEMS,
  UPDATE_CART_ITEMS,
  UPDATE_WISH_ITEMS,
} from '../constant/cartConstants';

const initialState = {
  cartItems: [],
  wishItems: [],
};

const cartItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_ITEMS:
      return { ...state, cartItems: action.payload };
    case FETCH_WISH_ITEMS:
      return { ...state, wishItems: action.payload };
    case UPDATE_CART_ITEMS:
      return { ...state, cartItems: action.payload };
    case UPDATE_WISH_ITEMS:
      return { ...state, wishItems: action.payload };
    default:
      return state;
  }
};

export default cartItemReducer;
