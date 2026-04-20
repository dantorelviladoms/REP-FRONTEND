import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/navbar";

export default function CheckoutCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar variant="authenticated" />

      <div
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/img/bg2.png)" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-lg px-4 pt-36 pb-16 sm:px-6">
          <div className="bg-gray-900/80 backdrop-blur-md border border-red-900/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center animate-fadeIn">
              {/* Animated X */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-red-600/20 border-2 border-red-500/60 flex items-center justify-center">
                  <XCircleIcon className="w-12 h-12 text-red-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Pago cancelado
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                El proceso de pago ha sido cancelado. No se ha realizado ningún cargo.
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-400 mb-8 text-left space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-400">ℹ</span> Tu carrito se ha mantenido intacto
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-yellow-400">ℹ</span> Puedes volver a intentar el pago cuando quieras
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-yellow-400">ℹ</span> Si tienes problemas, contacta con nuestro soporte
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/checkout")}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Reintentar pago
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:border-gray-400 transition-colors"
                >
                  Volver al catálogo
                </button>
              </div>
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
