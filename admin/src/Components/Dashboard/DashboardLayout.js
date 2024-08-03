import React, { useEffect, Suspense, lazy } from "react";
import SideBar from "./SideBar";
import { Button, Grid, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import { openMenu, closeMenu } from "../Redux/MenuSlice";

// Lazy load components
const Home = lazy(() => import("../ProtectedRoutes/Home"));
const Postnewjob = lazy(() => import("../ProtectedRoutes/products/Product"));
const Protfolia = lazy(() => import("../ProtectedRoutes/reviews/Reviews"));
const Services = lazy(() => import("../ProtectedRoutes/Contact/Contact"));
const Register = lazy(() => import("../ProtectedRoutes/Appointments/Index"));
const Coursel = lazy(() => import("../ProtectedRoutes/Coursel/Coursel"));
const Topnav = lazy(() => import("../ProtectedRoutes/Topnavbar/Topnav"));
const YourComponent = lazy(() =>
  import("../ProtectedRoutes/GetProducts/YourComponent")
);
const UserProfile = lazy(() =>
  import("../ProtectedRoutes/Orderget/OrderProfile")
);
const Seeallorders = lazy(() =>
  import("../ProtectedRoutes/Seeallordeers/Seeallorders")
);
const LazyPageNotFound = lazy(() =>
  import("../../Components/Pagenotfound/Pagenotfoound")
);

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const displayData = useSelector((state) => state.menu.value.display);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(displayData);
  }, [displayData]);

  // Function to close the sidebar
  const handleCloseMenu = () => {
    dispatch(closeMenu());
  };

  // Check if the current route is a 404 page
  const is404Page = location.pathname === "/404";

  useEffect(() => {
    // Redirect to /404 for any undefined routes
    const validPaths = [
      "/",
      "/addprod",
      "/addrevi",
      "/addadmin",
      "/changetopnav",
      "/addoffer",
      "/seecont",
      "/test",
      "/userprofile",
      "/seeallorders",
    ];
    if (!validPaths.includes(location.pathname)) {
      navigate("/404");
    }
  }, [location, navigate]);

  return (
    <Grid container height="100%">
      {/* Sidebar for smaller screens */}
      <Grid
        item
        xs={12}
        sm={0}
        sx={{
          display: {
            xs: displayData && !is404Page ? "block" : "none",
            sm: "none",
          },
        }}
      >
        <Button onClick={handleCloseMenu} sx={{ position: "absolute" }}>
          <CloseIcon />
        </Button>
        {children}
      </Grid>

      {/* Sidebar for larger screens */}
      <Grid
        item
        xs={0}
        sm={3}
        lg={2}
        sx={{
          display: {
            xs: displayData && !is404Page ? "block" : "none",
            sm: !is404Page ? "block" : "none",
          },
          backgroundColor: "#d2ebcd",
          color: "#163020",
          fontFamily: "Gill Sans MT",
          height: "100vh",
          overflow: "hidden", // Ensure no scrollbars are shown
        }}
      >
        {!is404Page && <SideBar />}
      </Grid>

      {/* Main content area */}
      <Grid
        item
        xs={12}
        sm={9}
        lg={10}
        direction="column"
        sx={{
          display: { xs: displayData ? "none" : "block", sm: "block" },
          overflow: "hidden", // Hide scrollbar
        }}
      >
        <Grid
          item
          sx={{
            height: { xs: "60px", sm: "0px" },
            display: { xs: displayData ? "none" : "block", sm: "none" },
          }}
        >
          <Box width="100%" height="100%" justifyContent="center">
            <Button onClick={() => dispatch(openMenu())}>
              <MenuIcon />
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          p={2}
          height={"100vh"}
          sx={{
            overflow: is404Page ? "hidden" : "auto", // Hide scrollbar for 404 page
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addprod" element={<Postnewjob />} />
              <Route path="/addrevi" element={<Protfolia />} />
              <Route path="/addadmin" element={<Register />} />
              <Route path="/changetopnav" element={<Topnav />} />
              <Route path="/addoffer" element={<Coursel />} />
              <Route path="/seecont" element={<Services />} />
              <Route path="/test" element={<YourComponent />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/seeallorders" element={<Seeallorders />} />
              <Route path="/404" element={<LazyPageNotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </Suspense>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;