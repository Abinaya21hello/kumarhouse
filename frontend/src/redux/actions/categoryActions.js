import axiosInstance from '../../api/axiosInstance';
import { FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from './types';

export const fetchCategories = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('api/categories'); // Adjust URL as per your backend setup
        dispatch({
            type: FETCH_CATEGORIES_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_CATEGORIES_FAILURE,
            payload: error.message
        });
    }
};
