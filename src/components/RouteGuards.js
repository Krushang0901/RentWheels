import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export const  withAdminCheck = (WrappedComponent) => {
  return (props) => {
    const { isAdmin } = useAuth();

    if (!isAdmin()) {
      return <Navigate to="/profile" />; // Redirect to user profile if not admin
    }

    return <WrappedComponent {...props} />;
  };
};

export const  withUserCheck = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();

    if (!user || user.isAdmin) {
      return <Navigate to="/Admin" />; // Redirect to admin page if not a regular user
    }

    return <WrappedComponent {...props} />;
  };
};

