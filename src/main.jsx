// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Products from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import CheckoutCancel from "./pages/CheckoutCancel.jsx";
import Historia from "./pages/Historia.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/historia" element={<Historia />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);