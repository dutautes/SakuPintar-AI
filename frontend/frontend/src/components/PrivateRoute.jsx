import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // ✅ FIX DI SINI

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

export default PrivateRoute;