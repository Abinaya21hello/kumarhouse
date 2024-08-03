// contactActions.js

import {
  CONTACT_REQUEST,
  CONTACT_SUCCESS,
  CONTACT_FAILURE,
  GET_CONTACT_REQUEST,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
  DELETE_CONTACT_REQUEST,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAILURE,
} from './types.js';
import axiosInstance from '../../api/axiosInstance'
export const createContact = (contactData) => async (dispatch) => {
  try {
    dispatch({ type: CONTACT_REQUEST });

    const response = await axiosInstance.post('api/contact', contactData); // Adjust the API endpoint as per your backend setup

    dispatch({
      type: CONTACT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CONTACT_FAILURE,
      payload: error.response.data.errors, // Assuming your backend sends errors in a specific format
    });
  }
};

export const getContacts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CONTACT_REQUEST });

    const response = await axiosInstance.get('api/getcontact'); // Adjust the API endpoint as per your backend setup

    dispatch({
      type: GET_CONTACT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_CONTACT_FAILURE,
      payload: error.response.data.errors, // Assuming your backend sends errors in a specific format
    });
  }
};

export const deleteContact = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CONTACT_REQUEST });

    await axiosInstance.delete(`api/contact/${id}`); // Adjust the API endpoint as per your backend setup

    dispatch({
      type: DELETE_CONTACT_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CONTACT_FAILURE,
      payload: error.response.data.errors, // Assuming your backend sends errors in a specific format
    });
  }
};