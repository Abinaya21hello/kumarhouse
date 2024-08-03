// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signIn" />
        )
      }
    />
  );
};

export default ProtectedRoute;