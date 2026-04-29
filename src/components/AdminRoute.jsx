// src/components/AdminRoute.jsx
// Protegeix rutes que requereixen rol "admin"
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
