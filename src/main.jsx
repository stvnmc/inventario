import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/RouteContext.jsx";
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { ReservartionsProvider } from "./context/ReservationContext.jsx";
import { AdminReservationProvider } from "./context/AdminReservationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <InventoryProvider>
        <ReservartionsProvider>
          <AdminReservationProvider>
            <App />
          </AdminReservationProvider>
        </ReservartionsProvider>
      </InventoryProvider>
    </UserProvider>
  </StrictMode>
);
