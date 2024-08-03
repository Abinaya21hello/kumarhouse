import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE } from '../actions/types';

const initialState = {
    loading: false,
    success: false,
    error: null,
};

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONTACT_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };
        case CONTACT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                error: null,
                // Optionally, you can store data received from the API response
            };
        case CONTACT_FAILURE:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default contactReducer;