import React, { useState } from "react";
import Inventory from "./Inventory";
import Missing from "./Missing";

const Dashboard = () => {
  const [site, setSite] = useState("dashboard");

  const dashboard = () => {
    return (
      <div className="dashboard-main">
        <div
          className="dashboard-containers"
          onClick={() => setSite("inventory")}
        >
          <h1>Inventory</h1>
        </div>
        <div
          className="dashboard-containers"
          onClick={() => setSite("missing")}
        >
          <h1>Faltantes</h1>
        </div>

        <div
          className="dashboard-containers"
          onClick={() => setSite("missing")}
        >
          <h1>reservas</h1>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-main">
      {/* <nav>
        {site !== "dashboard" && (
          <button onClick={() => setSite("dashboard")}>
            <IoMdClose />
          </button>
        )}
      </nav> */}

      <main>
        {site === "dashboard" && dashboard()}
        {site === "inventory" && <Inventory setSite={setSite} site={site} />}
        {site === "missing" && <Missing />}
      </main>
    </div>
  );
};

export default Dashboard;
