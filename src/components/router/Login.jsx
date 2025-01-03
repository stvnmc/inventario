import React, { useState, useEffect } from "react";
import { restaurant } from "../../infoPage/ImgRestautant";
import { useNavigate } from "react-router-dom";

function Login() {
  const [currentImage, setCurrentImage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const imgItem = restaurant.length;
        return prevImage === imgItem - 1 ? 0 : prevImage + 1;
      });
    }, 6000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login enviado");
  };

  const submit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <div className="img-cont">
          <img
            src={`/img/${restaurant[currentImage].nombre}.png`}
            alt={restaurant[currentImage].nombre}
          />
        </div>
        <div className="form-wrapper">
          <h1 className="welcome-title">Bienvenido</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">User Address</label>
              <input
                type="user"
                id="user"
                name="user"
                placeholder="Enter your user"
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                className="input-field"
              />
            </div>

            <button type="submit" className="login-button" onClick={submit}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
