// src/components/ProtectedRoute.jsx
// Protegeix rutes que requereixen autenticació (qualsevol usuari loguejat)
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
