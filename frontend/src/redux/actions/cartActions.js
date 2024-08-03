import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from "../constant/cartConstants";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

export const addToCart =
  (userId, productId, modelId, subProductId, grams, qty, total) =>
  async (dispatch) => {
    if (!userId) {
      userId = localStorage.getItem("userId");
    }

    if (!userId) {
      return dispatch({
        type: ADD_TO_CART_FAIL,
        payload: "User ID is required",
      });
    }

    try {
      dispatch({ type: ADD_TO_CART_REQUEST });

      const response = await axiosInstance.post(
        `api/add-cart/${productId}/models/${modelId}/subProduct/${subProductId}`,

        {
          userId,
          grams,
          qty,
          total,
        }
      );

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: {
          cartItems: response.data.cartItems,
        },
      });

      return response.data.message || "Product added to cart successfully!";
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({
        type: ADD_TO_CART_FAIL,
        payload: errorMessage,
      });

      throw new Error(errorMessage);
    }
  };
