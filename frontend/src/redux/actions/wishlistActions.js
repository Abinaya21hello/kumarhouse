import axiosInstance from "../../api/axiosInstance";
import {
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAIL,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAIL,
} from "../constant/wishlistConstants";

export const addToWishlist =
  (userId, productId, modelId, subProductId, qty) => async (dispatch) => {
    if (!userId) {
      userId = localStorage.getItem("userId");
    }

    if (!userId) {
      return dispatch({
        type: ADD_TO_WISHLIST_FAIL,
        payload: "User ID is required",
      });
    }

    try {
      dispatch({ type: ADD_TO_WISHLIST_REQUEST });

      const response = await axiosInstance.post(
        `api/add/wishlist/${productId}/models/${modelId}/subProduct/${subProductId}`,
        {
          userId,
          qty,
        }
      );

      const wishlistItem = {
        ...response.data.Wishlist,
        subProductId,
        qty,
      };

      dispatch({
        type: ADD_TO_WISHLIST_SUCCESS,
        payload: wishlistItem,
      });

      return response.data.message; // Return the success message
    } catch (error) {
      dispatch({
        type: ADD_TO_WISHLIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      throw new Error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

export const removeFromWishlist =
  (userId, subProductId) => async (dispatch) => {
    try {
      dispatch({ type: REMOVE_FROM_WISHLIST_REQUEST });

      const response = await axiosInstance.delete(
        `api/remove/wishlist/${subProductId}`,
        {
          data: { userId },
        }
      );

      dispatch({
        type: REMOVE_FROM_WISHLIST_SUCCESS,
        payload: subProductId,
      });

      return response.data.message; // Return the success message
    } catch (error) {
      dispatch({
        type: REMOVE_FROM_WISHLIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      throw new Error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };
