// src/pages/Historia.jsx
import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

export default function Historia() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar variant="public" />

      {/* Hero Section */}
      <div
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/img/bg2.png)', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6 italic">
            Nuestra Historia
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto italic">
            Desde la pasión por el motor hasta la excelencia en cada entrega. Conoce cómo DTL Premium Car se convirtió en tu concesionario de confianza.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 items-center">

              {/* Text side */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tight text-green-500 mb-6 italic">El Origen del Lujo</h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    DTL Premium Car nació de la simple pero poderosa visión de un grupo de entusiastas del motor. Lo que comenzó como un pequeño y exclusivo garaje de importación, pronto se transformó en un referente de la automoción de alta gama en nuestro país.
                  </p>
                  <p>
                    Nuestra filosofía siempre ha permanecido intacta: no vendemos únicamente vehículos, entregamos experiencias inigualables. Cada coche que entra en nuestras instalaciones es cuidadosamente seleccionado y sometido a rigurosas pruebas de calidad para que, cuando tomes el volante, sientas la verdadera emoción del lujo.
                  </p>
                  <div className="bg-gray-800/50 border border-green-700/30 p-6 rounded-2xl mt-8 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-3 italic">Nuestra Misión</h3>
                    <p className="text-sm">
                      Conectar a nuestros clientes con la excelencia automotriz mediante un servicio personalizado, cercano, totalmente transparente y, sobre todo, premium.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image side */}
              <div className="relative flex justify-center items-center">
                <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"></div>
                <div className="relative rounded-2xl overflow-hidden border border-green-700/40 shadow-2xl w-full h-[500px]">
                  <img
                    src="/img/cyberpunk_car.png"
                    alt="Showroom DTL Premium Car"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-32 text-center pb-12">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6 italic">
              El prestigio no va en el asiento del copiloto… va contigo.
            </h2>
            <a href="/home" className="inline-block mt-4 rounded-md bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors">
              Descubrir el Catálogo
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
