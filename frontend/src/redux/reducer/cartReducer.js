
import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from '../constant/cartConstants';

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: action.payload.cartItems || [], // Ensure new items are added to cart
      };
    case ADD_TO_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default cartReducer;
