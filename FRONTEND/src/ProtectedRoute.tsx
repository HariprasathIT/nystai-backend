import { Navigate } from "react-router";

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const role = localStorage.getItem('userRole');

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
