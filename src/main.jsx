import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/RouteContext.jsx";
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { ReservartionsProvider } from "./context/ReservationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <InventoryProvider>
        <ReservartionsProvider>
          <App />
        </ReservartionsProvider>
      </InventoryProvider>
    </UserProvider>
  </StrictMode>
);
