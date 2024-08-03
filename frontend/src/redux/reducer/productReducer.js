import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    SUBPRODUCT_LIST_REQUEST,
    SUBPRODUCT_LIST_SUCCESS,
    SUBPRODUCT_LIST_FAIL,
  } from '../constant/productConstants';
  
 // redux/reducer/productReducer.js

 const initialState = {
  products: [],
  loading: false,
  error: null,
};
export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      // console.log("Handling PRODUCT_LIST_REQUEST");
      return { ...state, loading: true };
    case PRODUCT_LIST_SUCCESS:
      // console.log("Handling PRODUCT_LIST_SUCCESS", action.payload);
      return { ...state, loading: false, products: action.payload };
    case PRODUCT_LIST_FAIL:
      // console.log("Handling PRODUCT_LIST_FAIL", action.payload);
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

  
  
  export const subProductListReducer = (state = { subProducts: [] }, action) => {
    switch (action.type) {
      case SUBPRODUCT_LIST_REQUEST:
        return { loading: true, subProducts: [] };
      case SUBPRODUCT_LIST_SUCCESS:
        return { loading: false, subProducts: action.payload };
      case SUBPRODUCT_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  