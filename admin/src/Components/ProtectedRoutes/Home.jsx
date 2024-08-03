import React, { useState, useEffect } from "react";
import OrdersDetails from "./pages/DashboardOrders/OrdersDetails";
import { Avatar, Typography, Box, Container, Paper, Grid, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';
import OrderChart from "./pages/OrderChart/OrderChart";

const HomeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  padding: theme.spacing(4),
}));

const Header = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: "#acc6aa", // Update to your preferred background color
  color: theme.palette.common.black, // Change font color to black
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: theme.palette.common.black, // Change font color to black
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const DateSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  borderRadius: theme.spacing(1), // Add border radius
  padding: theme.spacing(1), // Add padding
  backgroundColor: "#fff", // Background color for the date section
}));

const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container maxWidth="lg">
      <HomeContainer>
        <Header elevation={3}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" justifyContent="flex-end">
                <Title>Overview</Title>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" justifyContent="center">
                <DateSection>
                  <TodayIcon /> {/* Calendar icon */}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {currentDateTime.toLocaleDateString()}
                  </Typography>
                  <AccessTimeIcon sx={{ ml: 2 }} /> {/* Clock icon */}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {currentDateTime.toLocaleTimeString()}
                  </Typography>
                </DateSection>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                <AvatarSection>
                  <Avatar sx={{ bgcolor: "#ff9800" }}>K</Avatar> {/* Adjust avatar background color */}
                  <Typography variant="body1" sx={{ color: "black" }}>Kumar Herbals</Typography>
                </AvatarSection>
              </Box>
            </Grid>
          </Grid>
        </Header>
        <Content>
          <OrdersDetails />
          <OrderChart/>
       
        </Content>
      </HomeContainer>
    </Container>
  );
}

export default Home;