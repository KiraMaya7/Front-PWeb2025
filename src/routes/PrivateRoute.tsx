import { Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from '../auth/authHelpers';
import React from 'react';


interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: number[];
}


const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole!)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
