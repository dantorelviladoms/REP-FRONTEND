import React, { useState, useEffect } from "react";

export default function FilterModal({ isOpen, onClose, onApply, currentFilters }) {
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [filters, setFilters] = useState({
        marcas: [],
        precioMin: "",
        precioMax: "",
        potenciaMin: "",
        potenciaMax: "",
        colores: []
    });

    // Cargar marcas y colores únicos
    useEffect(() => {
        fetchBrandsAndColors();
    }, []);

    // Inicializar con filtros actuales
    useEffect(() => {
        if (currentFilters) {
            setFilters({
                marcas: currentFilters.marcas || [],
                precioMin: currentFilters.precioMin || "",
                precioMax: currentFilters.precioMax || "",
                potenciaMin: currentFilters.potenciaMin || "",
                potenciaMax: currentFilters.potenciaMax || "",
                colores: currentFilters.colores || []
            });
        }
    }, [currentFilters, isOpen]);

    const fetchBrandsAndColors = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/vehiculos");
            const data = await response.json();
            if (data.status === "success") {
                const uniqueBrands = [...new Set(data.data.map(v => v.marca))].sort();
                
                // Colores base que siempre queremos mostrar
                const baseColors = ["Blanco", "Negro", "Gris", "Plata", "Rojo", "Azul", "Verde", "Amarillo"];
                
                // Colores presentes en la base de datos
                const dbColors = data.data.map(v => v.color).filter(c => c);
                
                // Combinar y eliminar duplicados (ignorando mayúsculas/minúsculas)
                const combinedColors = [...new Set([...baseColors, ...dbColors])].sort((a, b) => a.localeCompare(b));
                
                setBrands(uniqueBrands);
                setColors(combinedColors);
            }
        } catch (error) {
            console.error("Error fetching brands and colors:", error);
        }
    };

    const handleBrandToggle = (brand) => {
        setFilters(prev => ({
            ...prev,
            marcas: prev.marcas.includes(brand)
                ? prev.marcas.filter(m => m !== brand)
                : [...prev.marcas, brand]
        }));
    };

    const handleColorToggle = (color) => {
        setFilters(prev => ({
            ...prev,
            colores: prev.colores.includes(color)
                ? prev.colores.filter(c => c !== color)
                : [...prev.colores, color]
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        const clearedFilters = {
            marcas: [],
            precioMin: "",
            precioMax: "",
            potenciaMin: "",
            potenciaMax: "",
            colores: []
        };
        setFilters(clearedFilters);
        onApply(clearedFilters);
    };

    if (!isOpen) return null;

    // Mapeo de marcas a logos
    const brandLogos = {
        "BMW": "/img/brands/bmw.png",
        "Mercedes": "/img/brands/mercedes.png",
        "Mercedes-Benz": "/img/brands/mercedes.png",
        "Audi": "/img/brands/audi.png",
        "Volkswagen": "/img/brands/volkswagen.png",
        "Ford": "/img/brands/ford.png",
        "Toyota": "/img/brands/toyota.png",
        "Honda": "/img/brands/honda.png",
        "Nissan": "/img/brands/nissan.png",
        "Hyundai": "/img/brands/hyundai.png",
        "Kia": "/img/brands/kia.png",
        "Mazda": "/img/brands/mazda.png",
        "Renault": "/img/brands/renault.png",
        "Peugeot": "/img/brands/peugeot.png",
        "Citroën": "/img/brands/citroen.png",
        "Seat": "/img/brands/seat.png",
        "Fiat": "/img/brands/fiat.png",
        "Opel": "/img/brands/opel.png",
        "Volvo": "/img/brands/volvo.png",
        "Porsche": "/img/brands/porsche.png",
        "Tesla": "/img/brands/tesla.png"
    };

    // Mapeo de nombres de colores en español a códigos hex
    const colorMap = {
        "negro": "#000000",
        "blanco": "#FFFFFF",
        "gris": "#808080",
        "plata": "#C0C0C0",
        "rojo": "#DC2626",
        "azul": "#2563EB",
        "azul oscuro": "#1E3A8A",
        "azul claro": "#60A5FA",
        "verde": "#16A34A",
        "amarillo": "#EAB308",
        "naranja": "#EA580C",
        "marrón": "#92400E",
        "marron": "#92400E",
        "beige": "#D4A574",
        "dorado": "#FFD700",
        "plateado": "#C0C0C0",
        "morado": "#9333EA",
        "rosa": "#EC4899",
        "crema": "#FFFACD"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/10 p-4">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-green-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-green-700/50">
                    <h2 className="text-2xl font-bold text-white">Filtros</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Marca */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Marca</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => handleBrandToggle(brand)}
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${filters.marcas.includes(brand)
                                        ? "bg-green-700 border-green-500 text-white"
                                        : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-green-700"
                                        }`}
                                >
                                    {brandLogos[brand] && (
                                        <img
                                            src={brandLogos[brand]}
                                            alt={brand}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    <span className="text-sm font-medium">{brand}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Precio */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Precio (€)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Mínimo</label>
                                <input
                                    type="number"
                                    value={filters.precioMin}
                                    onChange={(e) => setFilters({ ...filters, precioMin: e.target.value })}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Máximo</label>
                                <input
                                    type="number"
                                    value={filters.precioMax}
                                    onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
                                    placeholder="100000"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Potencia */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Potencia (CV)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Mínimo</label>
                                <input
                                    type="number"
                                    value={filters.potenciaMin}
                                    onChange={(e) => setFilters({ ...filters, potenciaMin: e.target.value })}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Máximo</label>
                                <input
                                    type="number"
                                    value={filters.potenciaMax}
                                    onChange={(e) => setFilters({ ...filters, potenciaMax: e.target.value })}
                                    placeholder="500"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color) => {
                                const hexColor = colorMap[color.toLowerCase()] || "#6B7280";
                                const isLightColor = ["blanco", "amarillo", "crema", "beige", "plata", "plateado"].includes(color.toLowerCase());

                                return (
                                    <button
                                        key={color}
                                        onClick={() => handleColorToggle(color)}
                                        className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-full border-2 transition-all ${filters.colores.includes(color)
                                                ? "border-green-500 ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900"
                                                : "border-gray-700 hover:border-green-700"
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full ${isLightColor ? 'border border-gray-600' : ''}`}
                                            style={{ backgroundColor: hexColor }}
                                            title={color}
                                        />
                                        <span className="text-sm font-medium text-white capitalize">{color}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between gap-3 p-6 border-t border-green-700/50">
                    <button
                        onClick={handleClear}
                        className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-600 transition-colors font-medium"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
