import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/router/Home";
import Reservas from "./components/router/Reservas";
import Menu from "./components/router/Menu";
import Header from "./components/page/Header";
import Footer from "./components/Page/Footer";
import Login from "./components/router/Login";
import Dashboard from "./components/admin/Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/inventario" element={<Home />} />
          <Route path="/inventario/menu" element={<Menu />} />
          <Route path="/inventario/reservas" element={<Reservas />} />
          <Route path="/inventario/login" element={<Login />} />
          <Route path="/inventario/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
