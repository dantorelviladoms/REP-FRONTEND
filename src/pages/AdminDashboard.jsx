// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  ChartBarIcon,
  PresentationChartLineIcon,
  UsersIcon,
  ArchiveBoxIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  CurrencyEuroIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const API = "http://localhost:5000/api";
function getAuthHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" };
}

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagada",
  cancelled: "Cancelada",
  refunded: "Reembolsada",
};
const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  paid: "bg-green-500/20 text-green-300 border-green-500/40",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/40",
  refunded: "bg-blue-500/20 text-blue-300 border-blue-500/40",
};

const ROLE_COLORS = { admin: "text-purple-400", cliente: "text-green-400", vendedor: "text-blue-400" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [userActionMsg, setUserActionMsg] = useState("");

  // Estado para el formulario de nuevo vehículo
  const [vehicleForm, setVehicleForm] = useState({
    vin: "", marca: "", modelo: "", version: "", ano: new Date().getFullYear(),
    kilometraje: 0, combustible: "gasolina", transmision: "manual",
    potencia: 0, plazas: 5, color: "", estado: "nuevo", precio: 0, garantia: "sí"
  });
  const [vehicleImages, setVehicleImages] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    if (!token || role !== "admin") { navigate("/login"); return; }

    Promise.all([
      fetch(`${API}/orders/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API}/user`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API}/orders?limit=50`, { headers: getAuthHeaders() }).then(r => r.json()),
    ]).then(([statsData, usersData, ordersData]) => {
      if (statsData.status === "success") setStats(statsData.data);
      if (usersData.status === "success") setUsers(usersData.data);
      if (ordersData.status === "success") setOrders(ordersData.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [navigate]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ rol: newRole }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, rol: newRole } : u));
        setUserActionMsg("Rol actualizado correctamente ✓");
        setTimeout(() => setUserActionMsg(""), 3000);
      }
    } catch { setUserActionMsg("Error al cambiar el rol"); }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: newStatus }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, estado: newStatus } : u));
        setUserActionMsg("Estado actualizado correctamente ✓");
        setTimeout(() => setUserActionMsg(""), 3000);
      }
    } catch { }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setVehicleStatus({ loading: true, error: "", success: "" });

    try {
      let imageUrls = [];

      // Si hay imágenes, las subimos primero
      if (vehicleImages && vehicleImages.length > 0) {
        const formData = new FormData();
        Array.from(vehicleImages).forEach(file => {
          formData.append("images", file);
        });

        const uploadRes = await fetch(`${API}/vehiculos/upload-images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadData.status === "success") {
          imageUrls = uploadData.data;
        } else {
          throw new Error(uploadData.message || "Error subiendo imágenes");
        }
      }

      // Preparamos los datos del vehículo
      const vehicleData = {
        ...vehicleForm,
        ano: Number(vehicleForm.ano),
        kilometraje: Number(vehicleForm.kilometraje),
        potencia: Number(vehicleForm.potencia),
        plazas: Number(vehicleForm.plazas),
        precio: Number(vehicleForm.precio),
        imageFile: imageUrls
      };

      // Guardamos el vehículo
      const res = await fetch(`${API}/vehiculos`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });

      const data = await res.json();
      if (data.status === "success") {
        setVehicleStatus({ loading: false, error: "", success: "Vehículo publicado correctamente en el catálogo ✓" });
        // Limpiar formulario
        setVehicleForm({
          vin: "", marca: "", modelo: "", version: "", ano: new Date().getFullYear(),
          kilometraje: 0, combustible: "gasolina", transmision: "manual",
          potencia: 0, plazas: 5, color: "", estado: "nuevo", precio: 0, garantia: "sí"
        });
        setVehicleImages(null);
        document.getElementById("imageInput").value = "";
      } else {
        throw new Error(data.message || "Error al crear el vehículo");
      }
    } catch (err) {
      setVehicleStatus({ loading: false, error: err.message, success: "" });
    }
  };

  // ── CHART DATA ──────────────────────────────────────────────────────────────
  const byMonthData = (() => {
    if (!stats?.byMonth?.length) return null;
    const labels = stats.byMonth.map(m => `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`);
    return {
      labels,
      datasets: [
        {
          label: "Pedidos",
          data: stats.byMonth.map(m => m.count),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.10)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#22c55e",
        },
      ],
    };
  })();

  const revenueData = (() => {
    if (!stats?.byMonth?.length) return null;
    const labels = stats.byMonth.map(m => `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`);
    return {
      labels,
      datasets: [
        {
          label: "Ingresos (€)",
          data: stats.byMonth.map(m => Math.round(m.revenue || 0)),
          backgroundColor: "rgba(34,197,94,0.7)",
          borderColor: "#16a34a",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  })();

  const statusData = (() => {
    if (!stats?.byStatus?.length) return null;
    return {
      labels: stats.byStatus.map(s => STATUS_LABELS[s._id] || s._id),
      datasets: [{
        data: stats.byStatus.map(s => s.count),
        backgroundColor: ["#eab308", "#22c55e", "#ef4444", "#3b82f6"],
        borderColor: ["#713f12", "#14532d", "#7f1d1d", "#1e3a5f"],
        borderWidth: 2,
      }],
    };
  })();

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { labels: { color: "#9ca3af", font: { size: 12 } } },
      title: { display: false },
      tooltip: { backgroundColor: "#1f2937", titleColor: "#f9fafb", bodyColor: "#d1d5db" },
    },
    scales: {
      x: { ticks: { color: "#6b7280" }, grid: { color: "#1f2937" } },
      y: { ticks: { color: "#6b7280" }, grid: { color: "#1f2937" } },
    },
  });

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#9ca3af", padding: 16, font: { size: 12 } } },
      tooltip: { backgroundColor: "#1f2937", titleColor: "#f9fafb", bodyColor: "#d1d5db" },
    },
  };

  const filteredOrders = orderFilter ? orders.filter(o => o.status === orderFilter) : orders;

  const kpis = stats ? [
    { icon: <UsersIcon className="w-8 h-8 text-purple-400" />, label: "Total Usuarios", value: stats.totalUsers, sub: "registrados", color: "from-purple-900/50 to-purple-800/20 border-purple-700/40" },
    { icon: <ArchiveBoxIcon className="w-8 h-8 text-blue-400" />, label: "Total Pedidos", value: stats.totals?.totalOrders ?? 0, sub: "creados", color: "from-blue-900/50 to-blue-800/20 border-blue-700/40" },
    { icon: <CheckCircleIcon className="w-8 h-8 text-green-400" />, label: "Pedidos Pagados", value: stats.totals?.paidOrders ?? 0, sub: "confirmados", color: "from-green-900/50 to-green-800/20 border-green-700/40" },
    { icon: <CurrencyEuroIcon className="w-8 h-8 text-yellow-400" />, label: "Ingresos Totales", value: (stats.totals?.paidRevenue ?? 0).toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), sub: "pedidos pagados", color: "from-yellow-900/50 to-yellow-800/20 border-yellow-700/40" },
  ] : [];

  const tabs = [
    { id: "overview", label: "Resumen", icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: "charts", label: "Gráficos", icon: <PresentationChartLineIcon className="w-5 h-5" /> },
    { id: "users", label: "Usuarios", icon: <UsersIcon className="w-5 h-5" /> },
    { id: "orders", label: "Pedidos", icon: <ArchiveBoxIcon className="w-5 h-5" /> },
    { id: "add-vehicle", label: "Añadir Vehículo", icon: <PlusCircleIcon className="w-5 h-5" /> },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur border-b border-green-900/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/img/logoDTLPC3.png" alt="DTL Premium Car" className="h-16 w-auto" /></a>
            <span className="text-gray-500">›</span>
            <span className="text-green-400 font-semibold text-sm">Dashboard Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/home" className="text-sm text-gray-400 hover:text-white transition-colors">← Catálogo</a>
            <button
              onClick={() => { localStorage.clear(); navigate("/login"); }}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-800/50 hover:border-red-600/60 px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? "bg-green-700/80 text-white shadow-lg shadow-green-900/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/60"}`}
            >
              <span className={activeTab === tab.id ? "text-white" : "text-green-500"}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-green-500" /> Resumen general
            </h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {kpis.map(kpi => (
                <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} border rounded-2xl p-6`}>
                  <div className="mb-3">{kpi.icon}</div>
                  <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
                  <p className="text-sm font-medium text-gray-300">{kpi.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Últimos pedidos */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
                <ArchiveBoxIcon className="w-5 h-5 text-green-500" />
                <h2 className="text-base font-semibold text-white">Últimos pedidos</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-6 py-3">ID</th>
                      <th className="text-left px-6 py-3">Cliente</th>
                      <th className="text-left px-6 py-3">Total</th>
                      <th className="text-left px-6 py-3">Estado</th>
                      <th className="text-left px-6 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 8).map(o => {
                      const sc = STATUS_COLORS[o.status] || "bg-gray-700 text-gray-300 border-gray-600";
                      return (
                        <tr key={o._id} className="border-t border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-3 text-gray-400 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-3 text-white">{o.user?.nombre} {o.user?.apellido}</td>
                          <td className="px-6 py-3 text-green-400 font-semibold">{o.total?.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                          <td className="px-6 py-3"><span className={`text-xs border px-2 py-0.5 rounded-full ${sc}`}>{STATUS_LABELS[o.status] || o.status}</span></td>
                          <td className="px-6 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString("es-ES")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: GRÁFICOS ── */}
        {activeTab === "charts" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PresentationChartLineIcon className="w-6 h-6 text-green-500" /> Gráficos y estadísticas
            </h1>
            {(!stats?.byMonth?.length && !stats?.byStatus?.length) ? (
              <div className="text-center py-24 text-gray-500">
                <PresentationChartLineIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p>Todavía no hay suficientes datos para generar gráficos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line chart: orders per month */}
                {byMonthData && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Pedidos por mes</h2>
                    <Line data={byMonthData} options={chartOptions("Pedidos por mes")} />
                  </div>
                )}

                {/* Doughnut: orders by status */}
                {statusData && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Pedidos por estado</h2>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-64 h-64">
                        <Doughnut data={statusData} options={doughnutOptions} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bar chart: revenue per month */}
                {revenueData && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Ingresos por mes (€)</h2>
                    <Bar data={revenueData} options={chartOptions("Ingresos por mes")} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: USUARIOS ── */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-green-500" /> Gestión de usuarios
              </h1>
              <span className="text-sm text-gray-400">{users.length} usuarios registrados</span>
            </div>
            {userActionMsg && (
              <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-xl">
                {userActionMsg}
              </div>
            )}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider bg-gray-800/50">
                      <th className="text-left px-6 py-3">Usuario</th>
                      <th className="text-left px-6 py-3">Email</th>
                      <th className="text-left px-6 py-3">Rol</th>
                      <th className="text-left px-6 py-3">Estado</th>
                      <th className="text-left px-6 py-3">Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t border-gray-800/60 hover:bg-gray-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-xs font-bold shrink-0">
                              {u.nombre?.charAt(0)}{u.apellido?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{u.nombre} {u.apellido}</p>
                              <p className="text-gray-500 text-xs">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.rol}
                            onChange={e => handleRoleChange(u._id, e.target.value)}
                            className={`bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-green-500 cursor-pointer ${ROLE_COLORS[u.rol] || "text-gray-300"}`}
                          >
                            <option value="cliente">cliente</option>
                            <option value="admin">admin</option>
                            <option value="vendedor">vendedor</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleStatusChange(u._id, u.estado === "activo" ? "inactivo" : "activo")}
                            className={`text-xs border px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer
                              ${u.estado === "activo"
                                ? "bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"}`}
                          >
                            {u.estado}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(u.fechaRegistro || u.createdAt).toLocaleDateString("es-ES")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PEDIDOS ── */}
        {activeTab === "orders" && (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ArchiveBoxIcon className="w-6 h-6 text-green-500" /> Gestión de pedidos
              </h1>
              <div className="flex gap-2">
                {["", "pending", "paid", "cancelled", "refunded"].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all
                      ${orderFilter === st
                        ? "bg-green-700/70 border-green-600 text-white"
                        : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"}`}
                  >
                    {st === "" ? "Todos" : STATUS_LABELS[st]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider bg-gray-800/50">
                      <th className="text-left px-6 py-3">ID</th>
                      <th className="text-left px-6 py-3">Cliente</th>
                      <th className="text-left px-6 py-3">Vehículos</th>
                      <th className="text-left px-6 py-3">Total</th>
                      <th className="text-left px-6 py-3">Estado</th>
                      <th className="text-left px-6 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => {
                      const sc = STATUS_COLORS[o.status] || "bg-gray-700 text-gray-300 border-gray-600";
                      return (
                        <tr key={o._id} className="border-t border-gray-800/60 hover:bg-gray-800/20 transition-colors">
                          <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <p className="text-white">{o.user?.nombre} {o.user?.apellido}</p>
                            <p className="text-gray-500 text-xs">{o.user?.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-0.5">
                              {o.products?.map((p, i) => (
                                <p key={i} className="text-xs text-gray-300">{p.name}</p>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-green-400 font-semibold">{o.total?.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                          <td className="px-6 py-4"><span className={`text-xs border px-2 py-0.5 rounded-full ${sc}`}>{STATUS_LABELS[o.status] || o.status}</span></td>
                          <td className="px-6 py-4 text-gray-400">{new Date(o.createdAt).toLocaleDateString("es-ES")}</td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No hay pedidos con este filtro</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: AÑADIR VEHÍCULO ── */}
        {activeTab === "add-vehicle" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircleIcon className="w-6 h-6 text-green-500" /> Publicar nuevo vehículo
            </h1>

            {vehicleStatus.success && (
              <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6" /> {vehicleStatus.success}
              </div>
            )}
            {vehicleStatus.error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
                {vehicleStatus.error}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* VIN */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">VIN (Bastidor) *</label>
                  <input
                    type="text" required maxLength="17"
                    value={vehicleForm.vin} onChange={e => setVehicleForm({ ...vehicleForm, vin: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500 uppercase"
                    placeholder="17 caracteres"
                  />
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Marca *</label>
                  <input
                    type="text" required
                    value={vehicleForm.marca} onChange={e => setVehicleForm({ ...vehicleForm, marca: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                    placeholder="Ej. BMW"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Modelo *</label>
                  <input
                    type="text" required
                    value={vehicleForm.modelo} onChange={e => setVehicleForm({ ...vehicleForm, modelo: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                    placeholder="Ej. Serie 3"
                  />
                </div>

                {/* Versión */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Versión / Acabado</label>
                  <input
                    type="text"
                    value={vehicleForm.version} onChange={e => setVehicleForm({ ...vehicleForm, version: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                    placeholder="Ej. 320d M Sport"
                  />
                </div>

                {/* Año */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Año *</label>
                  <input
                    type="number" required min="1900" max={new Date().getFullYear() + 1}
                    value={vehicleForm.ano} onChange={e => setVehicleForm({ ...vehicleForm, ano: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Kilometraje */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Kilometraje *</label>
                  <input
                    type="number" required min="0"
                    value={vehicleForm.kilometraje} onChange={e => setVehicleForm({ ...vehicleForm, kilometraje: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Combustible */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Combustible *</label>
                  <select
                    value={vehicleForm.combustible} onChange={e => setVehicleForm({ ...vehicleForm, combustible: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="gasolina">Gasolina</option>
                    <option value="diesel">Diésel</option>
                    <option value="híbrido">Híbrido</option>
                    <option value="eléctrico">Eléctrico</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Transmisión */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Transmisión *</label>
                  <select
                    value={vehicleForm.transmision} onChange={e => setVehicleForm({ ...vehicleForm, transmision: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="automática">Automática</option>
                    <option value="semiautomática">Semiautomática</option>
                  </select>
                </div>

                {/* Potencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Potencia (CV) *</label>
                  <input
                    type="number" required min="0"
                    value={vehicleForm.potencia} onChange={e => setVehicleForm({ ...vehicleForm, potencia: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Plazas */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Plazas *</label>
                  <input
                    type="number" required min="1" max="9"
                    value={vehicleForm.plazas} onChange={e => setVehicleForm({ ...vehicleForm, plazas: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Color exterior</label>
                  <input
                    type="text"
                    value={vehicleForm.color} onChange={e => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Estado (nuevo/usado) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Estado vehículo *</label>
                  <select
                    value={vehicleForm.estado} onChange={e => setVehicleForm({ ...vehicleForm, estado: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                    <option value="seminuevo">Seminuevo</option>
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Precio (€) *</label>
                  <input
                    type="number" required min="0" step="0.01"
                    value={vehicleForm.precio} onChange={e => setVehicleForm({ ...vehicleForm, precio: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-lg font-semibold text-green-400 focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Garantía */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Garantía *</label>
                  <select
                    value={vehicleForm.garantia} onChange={e => setVehicleForm({ ...vehicleForm, garantia: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="sí">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Imágenes (Subida) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Imágenes del vehículo (Opcional)</label>
                  <input
                    type="file"
                    id="imageInput"
                    multiple
                    accept="image/*"
                    onChange={e => setVehicleImages(e.target.files)}
                    className="w-full text-sm text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-600 file:text-white
                      hover:file:bg-green-500 cursor-pointer border border-gray-700 rounded-xl p-2 bg-gray-800"
                  />
                  {vehicleImages && vehicleImages.length > 0 && (
                    <p className="mt-2 text-sm text-green-400">{vehicleImages.length} imagen(es) seleccionada(s)</p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                <button
                  type="submit"
                  disabled={vehicleStatus.loading}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-green-900/40 transition-all"
                >
                  {vehicleStatus.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="w-6 h-6" />
                      Publicar Vehículo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
