import React from "react";

function Reservas() {
  const generarOpciones = () => {
    const opciones = [];
    for (let i = 1; i <= 12; i++) {
      opciones.push(<option key={i}>{i} personas</option>);
    }
    return opciones;
  };

  return (
    <div>
      <div>
        <h1>Haz tu reservación</h1>
        <form>
          <select>{generarOpciones()}</select>
          <div>
            <label>
              <input type="date" />
            </label>
            <select>
              <option> 12:30 pm</option>
              <option> 1:00 pm</option>
              <option> 1:30 pm</option>
              <option> 2:00 pm</option>
              <option> 2:30 pm</option>
              <option> 3:00 pm</option>
              <option> 3:30 pm</option>
              <option> 4:00 pm</option>
              <option> 4:30 pm</option>
              <option> 5:00 pm</option>
              <option> 5:30 pm</option>
              <option> 6:00 pm</option>
              <option> 6:30 pm</option>
              <option> 7:00 pm</option>
              <option> 7:30 pm</option>
              <option> 8:00 pm</option>
              <option> 8:30 pm</option>
              <option> 9:00 pm</option>
              <option> 9:30 pm</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Reservas;
