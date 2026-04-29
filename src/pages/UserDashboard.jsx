// src/pages/UserDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserIcon, 
  ShoppingBagIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";

const API = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

const STATUS_LABELS = {
  pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" },
  paid: { label: "Pagada", color: "bg-green-500/20 text-green-300 border-green-500/40" },
  cancelled: { label: "Cancelada", color: "bg-red-500/20 text-red-300 border-red-500/40" },
  refunded: { label: "Reembolsada", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editForm, setEditForm] = useState({ nombre: "", apellido: "", telefono: "" });
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar perfil
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    Promise.all([
      fetch(`${API}/user/me`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API}/orders/my-orders`, { headers: getAuthHeaders() }).then(r => r.json()),
    ]).then(([userData, ordersData]) => {
      if (userData.status === "success") {
        setUser(userData.data);
        setEditForm({
          nombre: userData.data.nombre || "",
          apellido: userData.data.apellido || "",
          telefono: userData.data.telefono || "",
        });
      }
      if (ordersData.status === "success") {
        setOrders(ordersData.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [navigate]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setEditError(""); setEditSuccess("");
    try {
      const res = await fetch(`${API}/user/me`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.status === "success") {
        setUser(data.data);
        setEditSuccess("Perfil actualizado correctamente ✓");
      } else {
        setEditError(data.message || "Error al actualizar");
      }
    } catch { setEditError("Error de conexión"); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: <UserIcon className="w-5 h-5 text-green-500" /> },
    { id: "orders", label: "Compras", icon: <ShoppingBagIcon className="w-5 h-5 text-green-500" /> },
    { id: "settings", label: "Configuración", icon: <Cog6ToothIcon className="w-5 h-5 text-green-500" /> },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-green-900/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <img src="/img/logoDTLPC3.png" alt="DTL Premium Car" className="h-16 w-auto" />
            </a>
            <span className="text-gray-500">›</span>
            <span className="text-green-400 font-semibold text-sm">Dashboard Usuario</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-400">
                Hola, <span className="text-white font-medium">{user.nombre}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-800/50 hover:border-red-600/60 px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          {/* Avatar */}
          <div className="bg-gray-900 border border-green-900/30 rounded-2xl p-6 mb-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center text-3xl font-bold mx-auto mb-3 shadow-lg shadow-green-900/40">
              {user?.nombre?.charAt(0).toUpperCase()}{user?.apellido?.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-white">{user?.nombre} {user?.apellido}</p>
            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-green-900/40 text-green-400 border border-green-700/40 rounded-full capitalize">
              {user?.rol}
            </span>
          </div>

          {/* Nav Tabs */}
          <nav className="bg-gray-900 border border-green-900/30 rounded-2xl overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all border-b border-gray-800/60 last:border-0
                  ${activeTab === tab.id
                    ? "bg-green-600/20 text-green-400 border-l-2 border-l-green-500"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* ── TAB: PERFIL ── */}
          {activeTab === "profile" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-green-500" /> Mi perfil
              </h1>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Nombre", value: user?.nombre },
                  { label: "Apellidos", value: user?.apellido },
                  { label: "Email", value: user?.email },
                  { label: "Teléfono", value: user?.telefono || "—" },
                  { label: "Usuario", value: user?.username },
                  { label: "Miembro desde", value: user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString("es-ES") : "—" },
                ].map(item => (
                  <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-white font-medium truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Edit form */}
              <div className="bg-gray-900 border border-green-900/30 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-5">Editar datos personales</h2>
                {editSuccess && <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-lg">{editSuccess}</div>}
                {editError && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg">{editError}</div>}
                <form onSubmit={handleProfileSave} className="grid grid-cols-2 gap-4">
                  {[
                    { field: "nombre", label: "Nombre" },
                    { field: "apellido", label: "Apellidos" },
                    { field: "telefono", label: "Teléfono" },
                  ].map(({ field, label }) => (
                    <div key={field} className={field === "telefono" ? "col-span-2" : ""}>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={editForm[field]}
                        onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-green-900/30">
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── TAB: COMPRAS ── */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6 text-green-500" /> Historial de compras
              </h1>
              {orders.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Todavía no has hecho ninguna compra</p>
                  <a href="/home" className="inline-block mt-4 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
                    Explorar vehículos
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const st = STATUS_LABELS[order.status] || { label: order.status, color: "bg-gray-700 text-gray-300 border-gray-600" };
                    const isExpanded = expandedOrder === order._id;
                    return (
                      <div key={order._id} className="bg-gray-900 border border-gray-800 hover:border-green-800/50 rounded-2xl overflow-hidden transition-all">
                        <div
                          className="flex items-center justify-between p-5 cursor-pointer"
                          onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        >
                          <div>
                            <p className="text-xs text-gray-500 mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                            <p className="font-semibold text-white">
                              {order.products.length} vehículo{order.products.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-green-400">
                              {order.total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                            </span>
                            <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${st.color}`}>
                              {st.label}
                            </span>
                            <span className="text-gray-500">
                              {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-800 bg-gray-800/30 p-5">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Vehículos del pedido</h3>
                            <div className="space-y-2">
                              {order.products.map((p, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-gray-300">{p.name}</span>
                                  <span className="text-white font-medium">
                                    {p.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })} × {p.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {order.shippingAddress && (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Dirección de envío</p>
                                <p className="text-sm text-gray-300">
                                  {order.shippingAddress.name} · {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: CONFIGURACIÓN ── */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6 text-green-500" /> Configuración de la cuenta
              </h1>
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-base font-semibold text-white mb-2">Estado de la cuenta</h2>
                  <p className="text-sm text-gray-400 mb-4">Tu cuenta está <span className="text-green-400 font-medium capitalize">{user?.estado}</span>.</p>
                </div>
                <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6">
                  <h2 className="text-base font-semibold text-red-300 mb-2">Zona de peligro</h2>
                  <p className="text-sm text-gray-400 mb-4">Cerrar sesión de forma inmediata en este dispositivo.</p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" /> Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
