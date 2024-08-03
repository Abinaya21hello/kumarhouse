import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Button } from "@mui/material";

const Newsletter = () => {
  const navigate = useNavigate();
  const handleToContactButton = () => {
    navigate("/contact");
  };
  const StyleContact = {
    backgroundColor: "#3bb77e",
    color: "#fff",
    width: "35%",
    padding: "20px",
    fontSize: "20px",
    borderRadius: "10px",
    fontWeight: "bold,",
    letterSpacing: "2px",
  };
  return (
    <>
      {/* <div className="newsLetterBanner">
        <SendOutlinedIcon />
        <input type="text" placeholder="Your email address" />
        <Button className="bg-g">Subscribe</Button>
      </div> */}
      <Button style={StyleContact} onClick={handleToContactButton}>
        Contact
      </Button>
    </>
  );
};

export default Newsletter;
