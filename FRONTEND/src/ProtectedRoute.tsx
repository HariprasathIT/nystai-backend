import { Navigate } from "react-router";
import { ReactNode } from "react";



interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
 const role = localStorage.getItem("userRole");


  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
