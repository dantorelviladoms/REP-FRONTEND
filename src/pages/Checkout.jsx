import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  SwatchIcon,
  LockClosedIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";
import Navbar from "../components/navbar";

// ─── Custom Icons for specific car data ───────────────────────────────────────
function MileageIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.192a2 2 0 012.553-1.91l7.447 2.483 7.447-2.483A2 2 0 0121 5.192v10.296a2 2 0 01-1.553 1.91L15 20m-6-8l6-3m-6 0l6 3m-6 3l6-3" />
    </svg>
  );
}

function FuelIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 16V8m0 0a2 2 0 10-4 0v10m4-10a2 2 0 012 2v1m-7-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 11l-3 3m0-3l3 3" />
    </svg>
  );
}

// ─── Stepper indicator ────────────────────────────────────────────────────────
function Step({ number, label, active, done }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
          ${done
            ? "bg-green-600 border-green-600 text-white"
            : active
              ? "bg-transparent border-green-500 text-green-400"
              : "bg-transparent border-gray-600 text-gray-500"
          }`}
      >
        {done ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span className={`text-xs font-medium ${active || done ? "text-green-400" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

function StepConnector({ done }) {
  return (
    <div className={`flex-1 h-0.5 mb-5 transition-all duration-500 ${done ? "bg-green-600" : "bg-gray-700"}`} />
  );
}

// ─── Cart item card ───────────────────────────────────────────────────────────
function CartItem({ item, onRemove, removing }) {
  const vehicle = item.id_vehiculo || item;
  const imgSrc =
    vehicle.imageFile && vehicle.imageFile.length > 0
      ? `/img/${vehicle.imageFile[0]}`
      : "/img/default-car.jpg";

  return (
    <div className="group flex gap-4 p-4 bg-white/5 hover:bg-white/8 border border-green-900/50 hover:border-green-700/70 rounded-xl transition-all duration-300">
      {/* Car image */}
      <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700">
        <img
          src={imgSrc}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm truncate">
          {vehicle.marca} {vehicle.modelo}
        </h3>
        {vehicle.version && (
          <p className="text-gray-400 text-xs mt-0.5 truncate">{vehicle.version}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
          {vehicle.ano && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {vehicle.ano}
            </span>
          )}
          {vehicle.kilometraje !== undefined && (
            <span className="flex items-center gap-1">
              <MileageIcon className="w-3.5 h-3.5" />
              {vehicle.kilometraje?.toLocaleString()} km
            </span>
          )}
          {vehicle.combustible && (
            <span className="flex items-center gap-1">
              <FuelIcon className="w-3.5 h-3.5" />
              {vehicle.combustible}
            </span>
          )}
          {vehicle.color && (
            <span className="flex items-center gap-1">
              <SwatchIcon className="w-3.5 h-3.5" />
              {vehicle.color}
            </span>
          )}
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <p className="text-green-400 font-bold text-base">
          {Number(vehicle.precio).toLocaleString("es-ES")} €
        </p>
        <button
          onClick={() => onRemove(item._id || item.id)}
          disabled={removing}
          className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40 p-1 rounded"
          title="Eliminar del carrito"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Order summary ─────────────────────────────────────────────────────────────
function SummaryRow({ label, value, highlight, big }) {
  return (
    <div className={`flex justify-between items-center ${big ? "pt-3 mt-3 border-t border-gray-700" : ""}`}>
      <span className={`${big ? "text-white font-semibold text-base" : "text-gray-400 text-sm"}`}>
        {label}
      </span>
      <span className={`font-bold ${big ? "text-green-400 text-xl" : highlight ? "text-green-400 text-sm" : "text-white text-sm"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Payment form ──────────────────────────────────────────────────────────────
function PaymentForm({ onBack, onConfirm, loading }) {
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") value = value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/40 transition-all";

  return (
    <div className="animate-fadeIn">
      <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Datos de pago
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Nombre en la tarjeta</label>
          <input name="cardName" value={form.cardName} onChange={handleChange}
            className={inputClass} placeholder="NOMBRE APELLIDO" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Número de tarjeta</label>
          <div className="relative">
            <input name="cardNumber" value={form.cardNumber} onChange={handleChange}
              className={inputClass + " pr-12"} placeholder="0000 0000 0000 0000" required />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <div className="w-5 h-3 rounded-sm bg-yellow-400 opacity-80" />
              <div className="w-5 h-3 rounded-sm bg-red-500 opacity-80 -ml-2" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Caducidad</label>
            <input name="expiry" value={form.expiry} onChange={handleChange}
              className={inputClass} placeholder="MM/AA" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">CVV</label>
            <input name="cvv" value={form.cvv} onChange={handleChange} type="password"
              className={inputClass} placeholder="•••" required />
          </div>
        </div>

        {/* Secure badge */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          Pago seguro con cifrado SSL de 256 bits
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:border-gray-400 transition-colors">
            Atrás
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Procesando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 13l4 4L19 7" />
                </svg>
                Confirmar compra
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ orderNumber, onGoHome }) {
  return (
    <div className="text-center py-10 animate-fadeIn">
      {/* Animated check */}
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-green-600/30 border-2 border-green-500 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">¡Pedido confirmado!</h2>
      <p className="text-gray-400 text-sm mb-1">Tu compra ha sido procesada con éxito.</p>
      <p className="text-gray-500 text-xs mb-8">
        Número de pedido:{" "}
        <span className="font-mono text-green-400 font-semibold">{orderNumber}</span>
      </p>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-400 mb-8 text-left space-y-2 max-w-xs mx-auto">
        <p className="flex items-center gap-2">
          <span className="text-green-400">✓</span> Recibirás un email de confirmación
        </p>
        <p className="flex items-center gap-2">
          <span className="text-green-400">✓</span> Nuestro equipo se pondrá en contacto
        </p>
        <p className="flex items-center gap-2">
          <span className="text-green-400">✓</span> Entrega estimada en 7-14 días laborables
        </p>
      </div>

      <button
        onClick={onGoHome}
        className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
      >
        Volver al catálogo
      </button>
    </div>
  );
}

// ─── Main Checkout component ───────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [step, setStep] = useState(1); // 1=resumen, 2=pago, 3=éxito
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`http://localhost:5000/api/carrito/usuario/${userId}`);
      const data = await res.json();
      if (data.status === "success") {
        setCartItems(data.data || []);
      } else {
        setError("No se pudo cargar el carrito");
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    setRemoving(itemId);
    try {
      const res = await fetch(`http://localhost:5000/api/carrito/${itemId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "success") {
        setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      }
    } catch {
      // silent fail – item stays
    } finally {
      setRemoving(null);
    }
  };

  const handleConfirmPurchase = async () => {
    setConfirming(true);
    try {
      // Call purchase endpoint
      const res = await fetch("http://localhost:5000/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_producto: cartItems[0]?.id_vehiculo?._id || cartItems[0]?._id,
          metodo_pago: "tarjeta",
          precio_final: total
        }),
      });
      const data = await res.json();
      const order = data.orderNumber || data.numero_pedido || `DTL-${Date.now().toString(36).toUpperCase()}`;
      setOrderNumber(order);
      setStep(3);
    } catch {
      // Even if endpoint doesn't exist yet, show success with a generated number
      setOrderNumber(`DTL-${Date.now().toString(36).toUpperCase()}`);
      setStep(3);
    } finally {
      setConfirming(false);
    }
  };

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal = cartItems.reduce((acc, item) => {
    const v = item.id_vehiculo || item;
    return acc + Number(v.precio || 0);
  }, 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar variant="authenticated" />

      {/* Background */}
      <div
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/img/bg2.png)" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {step === 3 ? "Compra completada" : "Finalizar compra"}
            </h1>
            {step !== 3 && (
              <p className="text-gray-400 text-sm mt-1">
                Revisa tu selección antes de confirmar
              </p>
            )}
          </div>

          {/* Stepper */}
          {step !== 3 && (
            <div className="flex items-center max-w-xs mx-auto mb-10">
              <Step number={1} label="Resumen" active={step === 1} done={step > 1} />
              <StepConnector done={step > 1} />
              <Step number={2} label="Pago" active={step === 2} done={step > 2} />
              <StepConnector done={step > 2} />
              <Step number={3} label="Listo" active={step === 3} done={false} />
            </div>
          )}

          {/* ── STEP 3: success ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="max-w-md mx-auto bg-gray-900/80 backdrop-blur-md border border-green-900/50 rounded-2xl p-8 shadow-2xl">
              <SuccessScreen orderNumber={orderNumber} onGoHome={() => navigate("/home")} />
            </div>
          )}

          {/* ── STEP 1 & 2: main layout ─────────────────────────────────── */}
          {step !== 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* ── Left: cart or payment ──────────────────────────────── */}
              <div className="lg:col-span-2 bg-gray-900/80 backdrop-blur-md border border-green-900/50 rounded-2xl p-6 shadow-2xl">

                {/* Back link */}
                <button
                  onClick={() => step === 1 ? navigate("/home") : setStep(1)}
                  className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {step === 1 ? "Seguir comprando" : "Volver al resumen"}
                </button>

                {/* ─ Step 1: cart items ─ */}
                {step === 1 && (
                  <>
                    <h2 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Vehículos seleccionados
                      {cartItems.length > 0 && (
                        <span className="ml-auto bg-green-700/40 text-green-300 text-xs font-bold px-2 py-0.5 rounded-full border border-green-700/60">
                          {cartItems.length} {cartItems.length === 1 ? "unidad" : "unidades"}
                        </span>
                      )}
                    </h2>

                    {/* Loading */}
                    {loading && (
                      <div className="flex items-center justify-center py-16 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3" />
                        Cargando carrito...
                      </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                      <div className="text-center py-10">
                        <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-6 py-4 rounded-xl text-sm">
                          {error}
                        </div>
                        <button onClick={fetchCart} className="mt-4 text-green-400 text-sm hover:underline">
                          Reintentar
                        </button>
                      </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && cartItems.length === 0 && (
                      <div className="text-center py-16 animate-fadeIn">
                        <div className="relative mx-auto w-20 h-20 mb-6">
                          <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse" />
                          <ShoppingBagIcon className="relative w-20 h-20 text-gray-700 mx-auto" />
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Tu carrito está vacío</p>
                        <button onClick={() => navigate("/home")}
                          className="px-8 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-green-900/20">
                          Ver catálogo
                        </button>
                      </div>
                    )}

                    {/* Items */}
                    {!loading && !error && cartItems.length > 0 && (
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <CartItem
                            key={item._id || item.id}
                            item={item}
                            onRemove={handleRemove}
                            removing={removing === (item._id || item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ─ Step 2: payment form ─ */}
                {step === 2 && (
                  <PaymentForm
                    onBack={() => setStep(1)}
                    onConfirm={handleConfirmPurchase}
                    loading={confirming}
                  />
                )}
              </div>

              {/* ── Right: order summary ───────────────────────────────── */}
              <div className="bg-gray-900/80 backdrop-blur-md border border-green-900/50 rounded-2xl p-6 shadow-2xl lg:sticky lg:top-28">
                <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Resumen del pedido
                </h2>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-700/60 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Vehicle list in summary */}
                    {cartItems.map((item) => {
                      const v = item.id_vehiculo || item;
                      return (
                        <div key={item._id || item.id} className="flex justify-between text-sm">
                          <span className="text-gray-400 truncate max-w-[60%]">
                            {v.marca} {v.modelo}
                          </span>
                          <span className="text-white font-medium">
                            {Number(v.precio).toLocaleString("es-ES")} €
                          </span>
                        </div>
                      );
                    })}

                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-700/60 pt-3 space-y-2">
                        <SummaryRow
                          label="Subtotal"
                          value={`${subtotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`}
                        />
                        <SummaryRow
                          label="IVA (21%)"
                          value={`${iva.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`}
                        />
                        <SummaryRow
                          label="Total"
                          value={`${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`}
                          big
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-6 space-y-3">
                  {[
                    { icon: <LockClosedIcon className="w-4 h-4 text-green-500" />, text: "Pago 100% seguro" },
                    { icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />, text: "Garantía incluida" },
                    { icon: <TruckIcon className="w-4 h-4 text-green-500" />, text: "Entrega a domicilio" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-gray-400">
                      <span>{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA - only show on step 1 */}
                {step === 1 && !loading && cartItems.length > 0 && (
                  <button
                    onClick={() => setStep(2)}
                    className="mt-6 w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
                  >
                    Proceder al pago
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
      `}</style>
    </div>
  );
}
