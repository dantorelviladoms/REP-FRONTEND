// src/components/navbar.jsx
import React, { useState, useEffect } from "react";
import { UserIcon, ShoppingCartIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Catálogo", href: "/home" },
  { name: "Nuestra Historia", href: "/historia" },
  { name: "Financiamiento", href: "#" },
  { name: "Contacto", href: "#" },
];

/**
 * Navbar component
 * @param {Object} props
 * @param {"public" | "authenticated"} props.variant - "public" muestra login, "authenticated" muestra carrito
 */
export default function Navbar({ variant = "public" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (variant === "authenticated" && userId) {
      fetchCartItems();
    }
  }, [variant, userId]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/carrito/usuario/${userId}`);
      const data = await response.json();
      if (data.status === "success") {
        // Formatear los datos para que coincidan con la estructura esperada por el UI
        const formattedItems = data.data.map(item => ({
          id: item._id,
          vehiculoId: item.id_vehiculo._id,
          name: `${item.id_vehiculo.marca} ${item.id_vehiculo.modelo}`,
          price: `${item.id_vehiculo.precio}€`,
          imageFile: item.id_vehiculo.imageFile && item.id_vehiculo.imageFile.length > 0
            ? item.id_vehiculo.imageFile[0]
            : "default-car.jpg",
          cantidad: item.cantidad
        }));
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/carrito/${itemId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.status === "success") {
        // Actualizar la lista local
        setCartItems(cartItems.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <header className="bg-transparent absolute w-full z-20">
      <nav
        className="flex items-center justify-between h-16 px-0 lg:px-6"
        aria-label="Global"
      >
        {/* Logo: pegado a la izquierda */}
        <a href="/" className="flex-shrink-0">
          <img
            src="/img/logoDTLPC3.png"
            alt="DTL PREMIUM CAR"
            className="h-30 w-auto object-contain"
          />
        </a>

        {/* Menú centrado */}
        <div className="hidden lg:flex flex-1 justify-center gap-x-10">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-white hover:text-green-500 transition"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Sección derecha: Login o Carrito según estado */}
        <div className="hidden lg:flex flex-shrink-0 items-center gap-4">
          {token ? (
            <>
              {/* Botón de perfil (Dashboard Admin / User) */}
              <a
                href={userRole === "admin" ? "/admin" : "/dashboard"}
                className="text-sm font-semibold text-white flex items-center gap-2 hover:text-green-400 bg-gray-900/50 backdrop-blur-sm border border-green-500/30 px-4 py-2 rounded-full transition-all"
                title="Ir a mi panel"
              >
                <UserIcon className="w-5 h-5" aria-hidden="true" />
                Mi Perfil
              </a>

              {/* Mostrar carrito si NO estamos en public (es decir, en el catálogo o similares) */}
              {variant !== "public" && (
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="text-white hover:text-green-300 transition flex items-center gap-2"
                  >
                    <ShoppingCartIcon className="w-6 h-6" aria-hidden="true" />
                    <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  </button>

                  {/* Dropdown del carrito */}
                  {isCartOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-green-700/50 overflow-hidden z-50">
                      {/* Header del carrito */}
                      <div className="flex items-center justify-between px-4 py-3 bg-green-900/50 border-b border-green-700/50">
                        <h3 className="text-sm font-semibold text-white">
                          Mi Carrito ({cartItems.length})
                        </h3>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="text-gray-400 hover:text-white transition"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Items del carrito */}
                      <div className="max-h-72 overflow-y-auto">
                        {cartItems.length > 0 ? (
                          cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition border-b border-gray-700/50 last:border-b-0"
                            >
                              <img
                                src={`/img/${item.imageFile}`}
                                alt={item.name}
                                className="w-16 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {item.name}
                                </p>
                                <p className="text-sm font-bold text-green-400">
                                  {item.price}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-300 transition p-1"
                                title="Eliminar del carrito"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-400 text-sm">
                            Tu carrito está vacío
                          </div>
                        )}
                      </div>

                      {/* Footer del carrito */}
                      <div className="px-4 py-3 bg-gray-800/50 border-t border-green-700/50">
                        <a
                          href="/checkout"
                          className="block w-full text-center bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-md transition"
                        >
                          Ver Carrito Completo
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-gray-300 hover:text-white transition ml-2 border-l border-gray-600 pl-4"
              >
                Salir
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-sm font-semibold text-white flex items-center gap-1 hover:text-green-300"
            >
              Iniciar sesión
              <UserIcon className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}