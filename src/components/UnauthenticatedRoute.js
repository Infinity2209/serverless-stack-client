import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

export default function UnauthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return <Route {...rest} element={children} />;
}
