import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import TextField from "@mui/material/TextField";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Button,
  Typography,
  Box,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, verifyToken } from "../../redux/actions/userActions.js";
import ForgotPasswordForm from "../../components/Formdialogue/Formdialogue";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivacyPolicy from "../privacypolicy/PrivacyPolicy.jsx";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(verifyToken()); // Verify token on component mount
    }
  }, [dispatch]);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !privacyChecked) {
      alert(
        "Please fill out all fields and agree to the privacy policy."
      );
      return;
    }

    try {
      await dispatch(loginUser(email, password));
      alert("Login successful!");
      localStorage.setItem("isLogin", true);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response && error.response.data.error
          ? error.response.data.error
          : "An error occurred during login"
      );
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  // Modal transition component
  const Fade = React.forwardRef(function Fade(props, ref) {
    const { children, in: open, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });

    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
  });

  Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
  };

  // Modal styles
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    "@media (max-width: 375px)": {
      width: "90%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

  // Modal style for Privacy Policy with increased width and height
  const privacyPolicyModalStyle = {
    ...modalStyle,
    width: 600,
    height: 600,
    overflowY: "auto",
  };

  const handleForgotPasswordSubmit = (email) => {
    // Handle forgot password logic here (e.g., send reset link to email)
    alert(`Password reset link sent to ${email}`);
    setRegisteredEmail(email);
    setOpenDialog(false);
    navigate("/signIn"); // Navigate to sign-up page after submitting forgot password form
  };

  const handleCloseIconClick = () => {
    setOpenDialog(false);
    setOpenPrivacyPolicy(false);
    // navigate("/signup"); // Navigate to sign-up page when modal is closed
  };

  return (
    <>
      <section className="signIn mb-5">
        <div className="breadcrumbWrapper">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>Sign In</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <Backdrop
              sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <h3 className="text-center">Sign In</h3>
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="form-group mb-4 w-100">
                <TextField
                  style={{ fontSize: "20px" }}
                  id="email"
                  type="email"
                  name="email"
                  label="Email"
                  className="w-100"
                  onChange={onChangeField}
                  value={email}
                  error={Boolean(emailError)}
                  helperText={emailError}
                />
              </div>
              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    style={{ fontSize: "20px" }}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    label="Password"
                    className="w-100"
                    onChange={onChangeField}
                    // value={password}
                    error={Boolean(passwordError)}
                    helperText={passwordError}
                  />
                  <IconButton
                    className="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </IconButton>
                </div>
              </div>

              <div className="form-group mb-3 w-100">
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ fontSize: "32px", padding: "8px" }}
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                      name="privacyPolicy"
                      color="primary"
                    />
                  }
                  label={
                    <Typography style={{ fontSize: "22px" }}>
                      I agree to the{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "blue",
                        }}
                        onClick={() => setOpenPrivacyPolicy(true)}
                      >
                        Terms & condition / Privacy Policy
                      </span>
                    </Typography>
                  }
                />
              </div>

              <div className="form-group mt-2 mb-2 w-100">
                <Button
                  className="btn btn-g btn-lg w-100"
                  type="submit"
                  // disabled={!privacyChecked}
                >
                  Sign In
                </Button>
              </div>

              <div className="form-group mt-3 mb-2 w-100 signInOr">
                <p className="text-center">OR</p>
              </div>

              <p className="text-center">
                Don't have an account?
                <b>
                  <Link to="/signup"> Sign Up</Link>
                </b>
              </p>

              <Typography
                className="text-center h6"
                style={{
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "30px",
                  fontFamily: "initial",
                  color: "#3BB77E",
                }}
                onClick={() => setOpenDialog(true)}
              >
                Forgot Password?
              </Typography>
            </form>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropComponent={Backdrop}
      >
        <Box sx={modalStyle}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center w-100"
            >
              Forgot Password
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseIconClick}
              className="closeIcon"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            defaultEmail={registeredEmail}
          />
        </Box>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        open={openPrivacyPolicy}
        onClose={() => setOpenPrivacyPolicy(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropComponent={Backdrop}
      >
        <Box sx={privacyPolicyModalStyle}>
          <div className="d-flex align-items-center justify-content-between bg-light p-1 position-sticky top-0 mb-3">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="w-100"
            >
              Privacy Policy
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseIconClick}
              className="closeIcon"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <PrivacyPolicy />
        </Box>
      </Modal>

      {/* Toast Container for Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default SignIn;
