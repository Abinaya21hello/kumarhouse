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

import axiosInstance from "../../api/axiosInstance";

const loginUserSuccess = (userData, token) => {
  localStorage.setItem("token", token); // Store token in local storage
  localStorage.setItem("userId", userData.id); // Assuming userData has a property _id for user ID
  localStorage.setItem("userName", userData.name);

  return {
    type: LOGIN_USER_SUCCESS,
    payload: { userData, token },
  };
};

export const loginUser = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_USER_REQUEST });

  try {
    const response = await axiosInstance.post("api/login", { email, password });

    if (response.data.token) {
      const { user, token } = response.data;
      dispatch(loginUserSuccess(user, token));
      localStorage.setItem("token", token);
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    dispatch({
      type: LOGIN_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};

export const registerUser = (userData, navigate) => async (dispatch) => {
  dispatch({ type: REGISTER_USER_REQUEST });

  try {
    const response = await axiosInstance.post("api/register", userData);
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: response.data.data,
    });
    navigate("/signin");
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload:
        error.response && error.response.data.errors
          ? error.response.data.errors.join(", ")
          : error.message,
    });
    throw error;
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");

  dispatch({ type: LOGOUT });
};

const verifyTokenRequest = () => ({
  type: VERIFY_TOKEN_REQUEST,
});

const verifyTokenSuccess = (userData) => ({
  type: VERIFY_TOKEN_SUCCESS,
  payload: userData,
});

const verifyTokenFail = (error) => ({
  type: VERIFY_TOKEN_FAIL,
  payload: error,
});

export const verifyToken = () => async (dispatch) => {
  dispatch(verifyTokenRequest());

  try {
    const response = await axiosInstance.get("api/verify-token");

    const { user } = response.data;
    dispatch(verifyTokenSuccess(user));
  } catch (error) {
    dispatch(
      verifyTokenFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const sendOtp = (userData) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });

  try {
    const response = await axiosInstance.post("api/register", userData);
    dispatch({
      type: SEND_OTP_SUCCESS,
      payload: response.data.message,
    });
  } catch (error) {
    dispatch({
      type: SEND_OTP_FAIL,
      payload:
        error.response && error.response.data.errors
          ? error.response.data.errors.join(", ")
          : error.message,
    });
    throw error;
  }
};

// Verify OTP and Register User
export const verifyOtpAndRegister =
  (userData, otp, navigate) => async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });

    try {
      const response = await axiosInstance.post("api/verifyOtpAndRegister", {
        email: userData.email,
        otp,
        userData,
      });

      dispatch({
        type: VERIFY_OTP_SUCCESS,
        payload: response.data.message,
      });

      navigate("/signin");
    } catch (error) {
      dispatch({
        type: VERIFY_OTP_FAIL,
        payload:
          error.response && error.response.data.errors
            ? error.response.data.errors.join(", ")
            : error.message,
      });
      throw error;
    }
  };
