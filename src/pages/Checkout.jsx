import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CalendarIcon,
  SwatchIcon,
  LockClosedIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";
import Navbar from "../components/navbar";

// ⚠️ Reemplaza con tu clave pública de Stripe (test)
const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

// ─── Custom Icons ──────────────────────────────────────────────────────────────
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

// ─── Stepper ───────────────────────────────────────────────────────────────────
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
      <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700">
        <img
          src={imgSrc}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

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

// ─── Summary row ──────────────────────────────────────────────────────────────
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

// ─── Shipping form (Step 2) ───────────────────────────────────────────────────
function ShippingForm({ shipping, setShipping, onBack, onNext, errors }) {
  const inputClass =
    "w-full px-4 py-2.5 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/40 transition-all";
  const errorInputClass =
    "w-full px-4 py-2.5 bg-gray-800/60 border border-red-500/60 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500/40 transition-all";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
        <TruckIcon className="w-5 h-5 text-green-400" />
        Datos de envío
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Nombre completo *</label>
          <input
            name="name"
            value={shipping.name}
            onChange={handleChange}
            className={errors.name ? errorInputClass : inputClass}
            placeholder="Juan García López"
            required
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Dirección *</label>
          <input
            name="address"
            value={shipping.address}
            onChange={handleChange}
            className={errors.address ? errorInputClass : inputClass}
            placeholder="Calle Mayor 12, 3º A"
            required
          />
          {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Ciudad *</label>
            <input
              name="city"
              value={shipping.city}
              onChange={handleChange}
              className={errors.city ? errorInputClass : inputClass}
              placeholder="Barcelona"
              required
            />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Código postal *</label>
            <input
              name="postalCode"
              value={shipping.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? errorInputClass : inputClass}
              placeholder="08001"
              required
            />
            {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Teléfono *</label>
          <input
            name="phone"
            value={shipping.phone}
            onChange={handleChange}
            className={errors.phone ? errorInputClass : inputClass}
            placeholder="+34 612 345 678"
            required
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:border-gray-400 transition-colors"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Continuar al resumen
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Order review + Pay (Step 3) ──────────────────────────────────────────────
function OrderReview({ cartItems, shipping, total, subtotal, iva, onBack, onPay, loading }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
        <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400" />
        Resumen de la comanda
      </h2>

      {/* Dirección de envío */}
      <div className="bg-white/5 border border-green-900/40 rounded-lg p-4 mb-5">
        <h3 className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">Dirección de envío</h3>
        <p className="text-white text-sm">{shipping.name}</p>
        <p className="text-gray-400 text-sm">{shipping.address}</p>
        <p className="text-gray-400 text-sm">{shipping.city}, {shipping.postalCode}</p>
        <p className="text-gray-400 text-sm">Tel: {shipping.phone}</p>
      </div>

      {/* Productos */}
      <div className="bg-white/5 border border-green-900/40 rounded-lg p-4 mb-5">
        <h3 className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Vehículos</h3>
        {cartItems.map((item) => {
          const v = item.id_vehiculo || item;
          return (
            <div key={item._id || item.id} className="flex justify-between text-sm py-1.5">
              <span className="text-gray-300 truncate max-w-[65%]">{v.marca} {v.modelo}</span>
              <span className="text-white font-medium">{Number(v.precio).toLocaleString("es-ES")} €</span>
            </div>
          );
        })}
        <div className="border-t border-gray-700/60 mt-3 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">{subtotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">IVA (21%)</span>
            <span className="text-white">{iva.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-gray-700/60">
            <span className="text-white font-semibold">Total</span>
            <span className="text-green-400 font-bold text-xl">{total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span>
          </div>
        </div>
      </div>

      {/* Stripe info */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        Serás redirigido a Stripe para completar el pago de forma segura
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:border-gray-400 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onPay}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Redirigiendo a Stripe...
            </>
          ) : (
            <>
              <LockClosedIcon className="w-4 h-4" />
              Pagar con Stripe
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Checkout component ───────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1); // 1=carret, 2=enviament, 3=resum+pagar
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);

  // Shipping form state
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});

  useEffect(() => {
    if (!userId || !token) { navigate("/login"); return; }
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
      const res = await fetch(`http://localhost:5000/api/carrito/${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      }
    } catch {
      // silent
    } finally {
      setRemoving(null);
    }
  };

  // ── Validate shipping form ──
  const validateShipping = () => {
    const errs = {};
    if (!shipping.name.trim()) errs.name = "El nombre es obligatorio";
    if (!shipping.address.trim()) errs.address = "La dirección es obligatoria";
    if (!shipping.city.trim()) errs.city = "La ciudad es obligatoria";
    if (!shipping.postalCode.trim()) errs.postalCode = "El código postal es obligatorio";
    if (!shipping.phone.trim()) errs.phone = "El teléfono es obligatorio";
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingNext = () => {
    if (validateShipping()) {
      setStep(3);
    }
  };

  // ── Pay with Stripe ──
  const handlePay = async () => {
    setPaying(true);
    setPayError(null);
    try {
      // 1. Crear sesión de checkout en el backend
      const res = await fetch("http://localhost:5000/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: shipping,
        }),
      });

      const data = await res.json();

      if (data.status !== "success" || !data.data?.url) {
        throw new Error(data.message || "No se pudo crear la sesión de pago");
      }

      // 2. Redirigir a Stripe Checkout directamente usando la URL de la sesión
      window.location.href = data.data.url;
    } catch (err) {
      setPayError(err.message || "Error al procesar el pago");
      setPaying(false);
    }
  };

  // ── Derived totals ──
  const subtotal = cartItems.reduce((acc, item) => {
    const v = item.id_vehiculo || item;
    return acc + Number(v.precio || 0);
  }, 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  // ── Render ──
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar variant="authenticated" />

      <div
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/img/bg2.png)" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Finalizar compra
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {step === 1 && "Revisa tu selección antes de continuar"}
              {step === 2 && "Introduce tus datos de envío"}
              {step === 3 && "Confirma tu pedido y procede al pago"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center max-w-md mx-auto mb-10">
            <Step number={1} label="Carrito" active={step === 1} done={step > 1} />
            <StepConnector done={step > 1} />
            <Step number={2} label="Envío" active={step === 2} done={step > 2} />
            <StepConnector done={step > 2} />
            <Step number={3} label="Pago" active={step === 3} done={false} />
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* Left panel */}
            <div className="lg:col-span-2 bg-gray-900/80 backdrop-blur-md border border-green-900/50 rounded-2xl p-6 shadow-2xl">

              {/* Back button */}
              <button
                onClick={() => {
                  if (step === 1) navigate("/home");
                  else setStep(step - 1);
                }}
                className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {step === 1 ? "Seguir comprando" : step === 2 ? "Volver al carrito" : "Volver a envío"}
              </button>

              {/* ─ Step 1: Cart ─ */}
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

                  {loading && (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3" />
                      Cargando carrito...
                    </div>
                  )}

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

              {/* ─ Step 2: Shipping ─ */}
              {step === 2 && (
                <ShippingForm
                  shipping={shipping}
                  setShipping={setShipping}
                  onBack={() => setStep(1)}
                  onNext={handleShippingNext}
                  errors={shippingErrors}
                />
              )}

              {/* ─ Step 3: Review + Pay ─ */}
              {step === 3 && (
                <>
                  <OrderReview
                    cartItems={cartItems}
                    shipping={shipping}
                    total={total}
                    subtotal={subtotal}
                    iva={iva}
                    onBack={() => setStep(2)}
                    onPay={handlePay}
                    loading={paying}
                  />
                  {payError && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm">
                      ⚠️ {payError}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right: Order summary sidebar */}
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
                  { icon: <LockClosedIcon className="w-4 h-4 text-green-500" />, text: "Pago 100% seguro con Stripe" },
                  { icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />, text: "Garantía incluida" },
                  { icon: <TruckIcon className="w-4 h-4 text-green-500" />, text: "Entrega a domicilio" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-gray-400">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA - step 1 only */}
              {step === 1 && !loading && cartItems.length > 0 && (
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
                >
                  Datos de envío
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}

              {/* Stripe badge */}
              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-center gap-2">
                <span className="text-gray-600 text-xs">Powered by</span>
                <svg className="h-5" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10.2c0-.7.6-1 1.5-1 1.4 0 3.1.4 4.5 1.2V6.3C9.5 5.8 8 5.5 6.5 5.5 2.7 5.5 0 7.6 0 11c0 5.3 7.3 4.5 7.3 6.7 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v4.2c1.7.7 3.3 1 4.9 1 3.9 0 6.6-1.9 6.6-5.3-.1-5.7-7.2-4.7-7.2-6.8zM16.2 2.4l-4.7 1V7h4.7V2.4zm0 5.5h-4.7v13.9h4.7V7.9zm5.5 1.5l-.3-1.5h-4.1v13.9h4.7v-9.5c1.1-1.4 3-1.2 3.6-1V6.8c-.6-.2-2.8-.6-3.9 1.1v1.5zm8 -1.5c-1.1 0-1.8.5-2.2 .9l-.2-.7h-4.2v18.8l4.7-1v-4.5c.4.3 1 .7 2 .7 2 0 3.8-1.6 3.8-5.2-.1-3.3-1.9-5-3.9-5zm-.7 7.7c-.7 0-1.1-.2-1.3-.5v-4.2c.3-.4.7-.6 1.3-.6 1 0 1.7 1.1 1.7 2.6 0 1.6-.7 2.7-1.7 2.7zm11.2-7.9c-2.7 0-4.5 2.2-4.5 5.2s1.7 5.1 4.9 5.1c1.4 0 2.5-.3 3.4-.8v-3.4c-.8.4-1.7.7-2.9.7-1.1 0-2.1-.4-2.2-1.8h5.5c0-.2 0-.9 0-1.2-.1-3.1-1.5-4.8-4.2-4.8zm-1.6 4.2c0-1.3.8-1.8 1.5-1.8s1.4.5 1.4 1.8h-2.9z" fill="#6772E5"/>
                </svg>
              </div>
            </div>
          </div>
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
