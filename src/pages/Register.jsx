// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Registro exitoso, redirigir a login
        navigate("/login");
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal con fondo de imagen (igual que en Login)
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/img/bglogin.png)' }}
    >
      {/* Overlay negro más oscuro */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Formulario centrado, con mismo estilo que login */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-900 backdrop-blur-sm rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-white">Crear cuenta</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="usuario123"
              required
              minLength={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
