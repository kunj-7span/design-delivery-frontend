import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.user.role);

  if (!token) {
    // Not logged in: redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Logged in but wrong role: redirect to an "Unauthorized" page
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized: render child routes
  return <Outlet />;
};

export default RoleProtectedRoute;
