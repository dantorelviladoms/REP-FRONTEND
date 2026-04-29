// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Guardar tokens y datos básicos del usuario
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        localStorage.setItem("userId", payload.id);
        localStorage.setItem("userRole", payload.rol || payload.role || "cliente");

        // Redirigir según el rol
        if (payload.rol === "admin" || payload.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    // Contenidor principal amb fons d'imatge
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/img/bglogin.png)' }}
    >
      {/* Overlay opcional */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Formulari centrat */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-900 backdrop-blur-sm rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-white">Iniciar sesión</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-green-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500 text-white"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500 text-white"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-500"
          >
            Entrar
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
