import React from "react";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const token = localStorage.getItem("token");

  if (!isConnected || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
