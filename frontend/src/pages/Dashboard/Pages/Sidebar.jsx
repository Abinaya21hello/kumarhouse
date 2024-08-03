import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  IconButton,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import "./Sidebar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/actions/userActions";

const Sidebar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get("api/user-logout");
      dispatch(logout());
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
      // Show an error notification if needed
    }
  };

  const drawerContent = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "16px 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#4CAF50",
            width: isSmallScreen ? 40 : 56,
            height: isSmallScreen ? 40 : 56,
          }}
        >
          KH
        </Avatar>
        {!isSmallScreen && (
          <Typography variant="h6" noWrap sx={{ mt: 2 }}>
            Kumar Herbals
          </Typography>
        )}
      </Toolbar>
      <Divider
        sx={{ width: "100%", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      />
      <List sx={{ width: "100%", flexGrow: 1 }}>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, link: "/dash" },
          { text: "Home", icon: <HomeIcon />, link: "/" },
          { text: "Orders", icon: <ShoppingCartIcon />, link: "/orders" },
          { text: "Change Password", icon: <PersonIcon />, link: "/changepassword" },
        ].map(({ text, icon, link }, index) => (
          <ListItem
            button
            component={Link}
            to={link}
            sx={{
              justifyContent: "center",
              padding: "12px 0",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 7, // Add margin bottom for spacing between items
            }}
            key={index}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40, justifyContent: "center", display: "flex", marginBottom: '8px' }}>{icon}</ListItemIcon>
            {!isSmallScreen && <ListItemText primary={text} sx={{ textAlign: "center" }} />}
          </ListItem>
        ))}
      </List>
      <Divider
        sx={{ width: "100%", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{
          margin: "10px 15px",
          width: "50%",
          alignSelf: "center",
          backgroundColor: "green",
          color: "white",
        }}
      >
        Logout
      </Button>
      <Typography
        variant="body2"
        sx={{ color: "yellow", textAlign: "center", py: 1 }}
      >
        © 2024 Kumar Herbals. All rights reserved.
      </Typography>
    </div>
  );
  

  return (
    <div>
      {isSmallScreen && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          sx={{
            marginRight: 2,
            color: "#4CAF50",
            top: 8,
            left: 10,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? drawerOpen : true}
        onClose={toggleDrawer(false)}
        sx={{
          width: isSmallScreen ? "80vw" : 400,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isSmallScreen ? "80vw" : 400,
            backgroundColor: "#1f3222",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0",
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default Sidebar;
