import React from "react";
import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ButtonLink from "../Dashboard/ButtonLink";

const SideBar = ({ closemenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const is404Page = location.pathname === "*"; // Check if the current path is the 404 page
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <Grid
      container
      height="100%"
      width="100%"
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      sx={{ overflowY: "hidden", paddingTop: "20px" }}
    >
      <Grid
        item
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="25%"
      >
        <img
          src="assets/images/images/WhatsApp Image 2024-06-05 at 6.14.05 PM.jpeg"
          width="60%"
          height="50%"
          style={{ borderRadius: "15px", marginBottom: "10px" }}
        />
      </Grid>
      <Grid
        item
        direction="column"
        height="75%"
        width="100%"
        paddingLeft={1}
        paddingRight={1}
        sx={{ textAlign: "left" }}
      >
        <ButtonLink path="/" text="Dashboard" isDisabled={is404Page} />
        <ButtonLink path="/addprod" text="Add Product" isDisabled={is404Page} />
        <ButtonLink path="/test" text="Get Product" isDisabled={is404Page} />
        <ButtonLink path="/addrevi" text="Add Reviews" isDisabled={is404Page} />
        <ButtonLink path="/addadmin" text="Add Admin" isDisabled={is404Page} />
        <ButtonLink path="/addoffer" text="Add Offer" isDisabled={is404Page} />
        <ButtonLink path="/seecont" text="User Contact" isDisabled={is404Page} />
        <ButtonLink path="/changetopnav" text="Add Topnav" isDisabled={is404Page} />
        <ButtonLink path="/userprofile" text="Order Status" isDisabled={is404Page} />

        <button
          onClick={logout}
          style={{
            display: "block",
            margin: "auto",
            color: "red",
            backgroundColor: "black",
            borderRadius: "5px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </Grid>
    </Grid>
  );
};

export default SideBar;
