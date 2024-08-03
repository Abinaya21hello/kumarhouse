import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { client } from "../../clientaxios/Client";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import axiosInstance from "../../api/axiosInstance";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    position: "relative",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      padding: "10px",
    },
  },
  inputField: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
    },
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#F8D82D",
    color: "#000",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    "&:hover": {
      backgroundColor: "#e0c942",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
      padding: "12px",
    },
  },
  registeredEmail: {
    marginTop: "10px",
    color: "green",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
    },
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
      top: 5,
      right: 5,
    },
  },
}));

export default function ForgotPasswordForm({ onSubmit }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("api/forgot-password", {
        email,
      });
      setLoading(false);

      if (response.status === 200) {
        alert(response.data.message);
        onSubmit(email); // Pass email to parent component for further handling
        setRegisteredEmail("");

        // Navigate to Sign Up page after a short delay (optional)
        setTimeout(() => {
          navigate("/signup");
        }, 1000); // Adjust delay as needed
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        if (error.response.data && error.response.data.registeredEmail) {
          setRegisteredEmail(error.response.data.registeredEmail);
        }
        alert(`User with email ${email} is not registered`);
      } else {
        console.error("Error sending reset password email:", error.message);
        alert(
          "Failed to send reset password email. Please try again later."
        );
      }
    }
  };

  const handleCloseIconClick = () => {
    navigate("/signup"); // Navigate to Sign Up page when closing the dialog
  };

  return (
    <div className={classes.formContainer}>
      <form onSubmit={handleForgotPassword}>
        <input
          className={classes.inputField}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
        />
        <button className={classes.button} type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
      {registeredEmail && (
        <div className={classes.registeredEmail}>
          Registered email: {registeredEmail}
        </div>
      )}
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={handleCloseIconClick}
      >
        {/* <CloseIcon sx={{ color: 'black' }} /> */}
      </IconButton>
      <ToastContainer /> {/* Container for toast notifications */}
    </div>
  );
}
