// src/redux/reducers/contactReducer.js

import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE } from '../actions/types';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONTACT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
      };
    case CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

export default contactReducer;
