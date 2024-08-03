import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  CLEAR_ERRORS,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAIL,
  LOGOUT,
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAIL,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
} from "../constant/userConstants";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  userId: localStorage.getItem("userId"),
  error: null,
  otpSent: false,
  otpVerified: false,
  message: null,
};

const registerUserSuccess = (state, action) => {
  return {
    ...state,
    loading: false,
    isAuthenticated: true,
    user: action.payload,
    error: null,
  };
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
    case REGISTER_USER_REQUEST:
    case VERIFY_TOKEN_REQUEST:
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_USER_SUCCESS:
    case VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        userId: action.payload.userData._id,
        userName: action.payload.userData.name,
        error: null,
      };
    case REGISTER_USER_SUCCESS:
      return registerUserSuccess(state, action);
    case LOGIN_USER_FAIL:
    case REGISTER_USER_FAIL:
    case VERIFY_TOKEN_FAIL:
    case SEND_OTP_FAIL:
    case VERIFY_OTP_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        userId: null,
        error: action.payload,
      };
    case SEND_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        otpSent: true,
        message: action.payload,
        error: null,
      };
    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        otpVerified: true,
        message: action.payload,
        error: null,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userId: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default userReducer;
