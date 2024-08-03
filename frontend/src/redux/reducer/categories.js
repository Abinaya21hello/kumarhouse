import { FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from '../actions/types';

const initialState = {
    categories: [],
    error: null
};

const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload,
                error: null
            };
        case FETCH_CATEGORIES_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default categoriesReducer;
// git remote add origin https://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@github.com/dhanuhellotech/ecom-herbal.git 

// git remote add origin https://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@github.com/dhanuhellotech/kumarher.git
