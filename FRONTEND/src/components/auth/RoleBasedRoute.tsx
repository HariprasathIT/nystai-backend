// src/components/auth/RoleBasedRoute.tsx
import { Navigate, Outlet } from "react-router";

type RoleBasedRouteProps = {
  allowedRoles: string[];
};

const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const role = localStorage.getItem("role"); // Store this at login time
  return allowedRoles.includes(role ?? "") ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default RoleBasedRoute;
