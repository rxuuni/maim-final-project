import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { SeatProvider } from "./context/SeatContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SeatProvider>
      <App />
    </SeatProvider>
  </BrowserRouter>
);
