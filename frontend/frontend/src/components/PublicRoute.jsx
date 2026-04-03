import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const lastLogout = localStorage.getItem("lockoutTime");
  const now = Date.now();

  if (lastLogout && now - lastLogout < 10 * 1000) {
    return <Navigate to="/" replace />; // atau tampilkan toast
  }

  return children;
}

export default PublicRoute;