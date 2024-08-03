
import axiosInstance from '../../api/axiosInstance';
import {
  FETCH_CART_ITEMS_REQUEST,
  FETCH_CART_ITEMS_SUCCESS,
  FETCH_CART_ITEMS_FAIL,
} from '../constant/cartConstants';

export const fetchCartItems = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CART_ITEMS_REQUEST });

    const response = await axiosInstance.get(`get-cart-product/${userId}`);

    dispatch({
      type: FETCH_CART_ITEMS_SUCCESS,
      payload: response.data.cartItems,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CART_ITEMS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
