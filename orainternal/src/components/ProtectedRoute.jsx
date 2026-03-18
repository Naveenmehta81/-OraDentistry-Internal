import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass current path so login can redirect back after success
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
