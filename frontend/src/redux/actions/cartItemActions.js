// cartActions.js

import { getCartItems, getwishItems } from "../../api/axiosInstance";
import { FETCH_CART_ITEMS, FETCH_WISH_ITEMS, UPDATE_CART_ITEMS, UPDATE_WISH_ITEMS } from '../constant/cartConstants';

export const fetchCartItems = (userId) => async (dispatch) => {
  try {
    const items = await getCartItems(userId);
    dispatch({ type: FETCH_CART_ITEMS, payload: items });
    localStorage.setItem('cartItemCount', items.length);
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};

export const fetchWishItems = (userId) => async (dispatch) => {
  try {
    const items = await getwishItems(userId); // Corrected function name
    dispatch({ type: FETCH_WISH_ITEMS, payload: items });
    localStorage.setItem('wishItemCount', items.length);
  } catch (error) {
    console.error('Error fetching wish items:', error);
  }
};

export const updateCartItems = (items) => ({
  type: UPDATE_CART_ITEMS,
  payload: items,
});

export const updateWishItems = (items) => ({
  type: UPDATE_WISH_ITEMS,
  payload: items,
});
