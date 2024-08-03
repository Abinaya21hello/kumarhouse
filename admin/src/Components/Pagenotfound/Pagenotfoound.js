// PageNotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f2f2f2', // Light gray background
  color: '#4caf50', // Herbal green color
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const AnimatedHerb = styled('div')({
  animation: `${float} 3s ease-in-out infinite`,
  fontSize: '4rem',
  marginBottom: '20px',
});

const NotFoundText = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '10px',
});

const NotFoundDescription = styled(Typography)({
  fontSize: '1.2rem',
  marginBottom: '20px',
});

const BackHomeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: '#black',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
}));

const PageNotFound = () => {
  return (
    <NotFoundContainer>
      <AnimatedHerb>🌿🌿🌿</AnimatedHerb>
      <NotFoundText variant="h1">404 - Page Not Found</NotFoundText>
      <NotFoundDescription variant="body1">
        Kumar Herbals says, Oops! The page you are looking for does not exist. Please Login
      </NotFoundDescription>
      <BackHomeButton component={Link} to="/login" variant="contained">
        Go Back Login Page
      </BackHomeButton>
    </NotFoundContainer>
  );
};

export default PageNotFound;
