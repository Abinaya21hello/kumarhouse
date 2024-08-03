import axiosInstance from '../../api/axiosInstance';

import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  SUBPRODUCT_LIST_REQUEST,
  SUBPRODUCT_LIST_SUCCESS,
  SUBPRODUCT_LIST_FAIL,
} from '../constant/productConstants';


export const listProducts = (categoryName) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const response = await axiosInstance.get(`api/getProducts?category=${categoryName}`);
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const listSubProducts = (productId, modelId, subProductId) => async (dispatch) => {
  try {
    dispatch({ type: SUBPRODUCT_LIST_REQUEST });
    const { data } = await axiosInstance.get(`api/sub-product/${productId}/models/${modelId}/sub/${subProductId}`);
    dispatch({ type: SUBPRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBPRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
