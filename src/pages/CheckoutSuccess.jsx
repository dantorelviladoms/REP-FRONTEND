import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon, TruckIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/navbar";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  // Poll para esperar confirmación del webhook (puede tardar unos segundos)
  useEffect(() => {
    if (!order || order.status === "paid" || pollCount >= 10) return;

    const timer = setTimeout(() => {
      fetchOrder();
      setPollCount((c) => c + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [order, pollCount]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/checkout/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setOrder(data.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const isPaid = order?.status === "paid";

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar variant="authenticated" />

      <div
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/img/bg2.png)" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-lg px-4 pt-36 pb-16 sm:px-6">
          <div className="bg-gray-900/80 backdrop-blur-md border border-green-900/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center animate-fadeIn">
              {/* Animated check */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-green-600/30 border-2 border-green-500 flex items-center justify-center">
                  <CheckCircleIcon className="w-12 h-12 text-green-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                {isPaid ? "¡Pago confirmado!" : "¡Pedido recibido!"}
              </h1>
              <p className="text-gray-400 text-sm mb-1">
                {isPaid
                  ? "Tu pago ha sido procesado correctamente."
                  : "Estamos confirmando tu pago con Stripe..."}
              </p>

              {orderId && (
                <p className="text-gray-500 text-xs mb-6">
                  Nº de pedido:{" "}
                  <span className="font-mono text-green-400 font-semibold">
                    {orderId.slice(-8).toUpperCase()}
                  </span>
                </p>
              )}

              {/* Loading indicator while waiting for webhook */}
              {!isPaid && !loading && pollCount < 10 && (
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-6">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500" />
                  Confirmando pago...
                </div>
              )}

              {/* Order details */}
              {order && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-400 mb-8 text-left space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Recibirás un email de confirmación
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Nuestro equipo se pondrá en contacto
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Entrega estimada en 7-14 días laborables
                  </p>
                  {order.shippingAddress && (
                    <div className="pt-2 mt-2 border-t border-gray-700">
                      <p className="flex items-center gap-2 text-gray-500">
                        <TruckIcon className="w-4 h-4" />
                        Envío a: {order.shippingAddress.address}, {order.shippingAddress.city}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status badge */}
              {order && (
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                    ${isPaid
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isPaid ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
                    {isPaid ? "Pagado" : "Pendiente de confirmación"}
                  </span>
                </div>
              )}

              <button
                onClick={() => navigate("/home")}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
              >
                Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      </div>

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
