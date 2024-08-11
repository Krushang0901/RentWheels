import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export const withAdminCheck = (WrappedComponent) => {
  return (props) => {
    const { isAdmin } = useAuth();

    if (!isAdmin()) {
      return <Navigate to="/profile" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export const withUserCheck = (WrappedComponent) => {
  return (props) => {
    const { user, isAdmin } = useAuth();

    if (!user || isAdmin()) {
      return <Navigate to="/Admin" />;
    }

    return <WrappedComponent {...props} />;
  };
};
