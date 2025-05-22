import { useEffect, useRef, useState } from "react";
import { FiAlignRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoMoon } from "react-icons/io5";

function Header() {
  const [more, setMore] = useState(true);

  const divRef = useRef(null);

  const chanceSetMore = () => {
    setMore(!more);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setMore(true);
    }
  };

  return (
    <header>
      <div className="title">
        <h1>Rosso di Roma</h1>
      </div>

      <ul>
        <Link to="/inventario/Menu">
          <li>Menu</li>
        </Link>
        <Link to="/inventario/Reservas">
          <li>Reservas</li>
        </Link>
      </ul>

      <div className="more">
        <FiAlignRight onClick={chanceSetMore} />
        <div className={`more-contet ${more ? "" : "disguise"}`} ref={divRef}>
          <div className="moon-sun">
            <h2>Cambiar tema</h2>
            <IoMoon />
          </div>
          <div className="linea"></div>
          <div className="contet-login-register">
            <Link to="/inventario/Login">
              <h2 onClick={chanceSetMore}>Login</h2>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
