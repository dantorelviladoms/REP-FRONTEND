// src/App.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "./components/Footer";
import "./App.css";

const navigation = [
  { name: "Catálogo", href: "/home" },
  { name: "Características", href: "#caracteristicas" },
  { name: "Nuestra Historia", href: "/historia" },
  { name: "Financiamiento", href: "#" },
  { name: "Contacto", href: "#" },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-black">
      {/* Hero Section con imagen de fondo parallax */}
      <div
        className="relative bg-cover bg-center bg-no-repeat h-screen"
        style={{
          backgroundImage: 'url(/img/interior3.png)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* overlay oscuro suave para que se lea mejor la img*/}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Contenido real (encima del fondo) */}
        <div className="relative z-10">

          {/* Header */}
          <header className="absolute inset-x-2 top-0 z-50">
            <nav
              aria-label="Global"
              className="flex items-center justify-between pt-4 pb-7 px-7 lg:px-8"
            >
              <div className="flex lg:flex-1">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">DTL PREMIUM CAR</span>

                  <img
                    src="/img/logoDTLPC3.png"
                    alt="DTL PREMIUM CAR"
                    className="h-35 w-auto"
                  />
                </a>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-green-400"
                >
                  <span className="sr-only">Abrir menú principal</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold text-white hover:text-green-200 transition"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="/login" className="text-sm font-semibold text-white flex items-center gap-1 hover:text-green-200">
                  Iniciar sesión
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </a>
              </div>
            </nav>

            {/* Menú móvil */}
            <Dialog
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
              className="lg:hidden"
            >
              <div className="fixed inset-0 z-50" />
              <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-green-100/10">
                <div className="flex items-center justify-between">
                  <div></div>
                  <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">DTL PREMIUM CAR</span>
                    <img
                      src="/img/logoDTLPC3.png"
                      alt="DTL PREMIUM CAR"
                      className="h-50 w-auto"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-gray-200"
                  >
                    <span className="sr-only">Cerrar Menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-white/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-green-700"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="py-6">
                      <a
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-green-500"
                      >
                        Iniciar sesión
                      </a>
                      <a
                        href="/register"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-green-500"
                      >
                        Registrarse
                      </a>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </Dialog>
          </header>

          {/* Hero */}
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="text-center">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
                  DTL PREMIUM CAR
                </h1>
                <p className="mt-6 text-lg text-gray-300 sm:text-xl">
                  Donde el lujo toma el volante, el prestigio no va en el asiento del copiloto… va contigo.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/home"
                    className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    Encuentra tu nuevo pasión!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - ¿Por Qué Elegirnos? con fondo oscuro sólido */}
      <div id="caracteristicas" className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-6 py-24 lg:px-8 flex items-center">
        <div className="mx-auto max-w-7xl">
          {/* Título de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-5xl pt-2 font-bold tracking-tight text-white italic">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="mt-4 text-lg text-gray-300 italic">
              Experiencia premium en cada detalle
            </p>
          </div>

          {/* Grid de características */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1: Alta Gama con Garantía */}
            <div className="feature-card bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 hover:border-green-500/60 shadow-xl">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="w-20 h-20 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v7h-2V7zm0 8h2v2h-2v-2z" />
                    <path d="M12 3.19l7 3.11V11c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11z" opacity="0.3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3 italic">
                Vehículos de Alta Gama
              </h3>
              <p className="text-gray-300 text-center italic text-sm leading-relaxed">
                Garantía respaldada por las compañías más reconocidas a nivel internacional. Calidad certificada en cada vehículo.
              </p>
            </div>

            {/* Feature 2: Colaboración Premium */}
            <div className="feature-card bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 hover:border-green-500/60 shadow-xl">
              <div className="feature-icon flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="w-20 h-20 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3 italic">
                Marcas Premium
              </h3>
              <p className="text-gray-300 text-center italic text-sm leading-relaxed">
                Alianzas estratégicas con las mejores marcas del sector. Trabajamos colaborativamente con los líderes del mercado.
              </p>
            </div>

            {/* Feature 3: Entregas Rápidas */}
            <div className="feature-card bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 hover:border-green-500/60 shadow-xl">
              <div className="feature-icon flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="w-20 h-20 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm1.5-9H17V12h4.46L19.5 9.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3zM3 6v9h.76c.55-.61 1.35-1 2.24-1s1.69.39 2.24 1H15V6H3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3 italic">
                Entregas Rápidas
              </h3>
              <p className="text-gray-300 text-center italic text-sm leading-relaxed">
                Sistema de logística avanzado que garantiza entregas eficaces en tiempo récord. Tu vehículo, cuando lo necesites.
              </p>
            </div>

            {/* Feature 4: Financiación Flexible */}
            <div className="feature-card bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 hover:border-green-500/60 shadow-xl">
              <div className="feature-icon flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="w-20 h-20 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                    <path d="M4 12h16v6H4z" opacity="0.3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3 italic">
                Financiación Flexible
              </h3>
              <p className="text-gray-300 text-center italic text-sm leading-relaxed">
                Planes de financiamiento personalizados adaptados a tus necesidades. Hacemos realidad tu sueño con facilidades de pago.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Outlet (renderiza rutas hijas si las hubiera) */}
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;