// src/redux/actions/reviewActions.js
import axiosInstance from '../../api/axiosInstance';
import {
  FETCH_REVIEWS_REQUEST,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILURE,
} from '../constant/reviewConstant';

export const fetchReviews = () => async (dispatch) => {
  dispatch({ type: FETCH_REVIEWS_REQUEST });
  try {
    const response = await axiosInstance.get('api/reviews');
    dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: response.data.reviews });
  } catch (error) {
    dispatch({ type: FETCH_REVIEWS_FAILURE, payload: error.message });
  }
};
