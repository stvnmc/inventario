import React, { useEffect, useState } from "react";

import { restaurant } from "../../infoPage/ImgRestautant";
import { BsPersonFill } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import Calendario from "../componentsReservation/calendario";
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import { useReservations } from "../../context/ReservationContext";

function Reservas() {
  const [place, setPlace] = useState("rosodiroma1");
  const [animate, setAnimate] = useState(true);

  const [calendar, setCalendar] = useState(false);

  const [sections, setSections] = useState("placeAndPeople");

  const [allInfoCalendar, setAllInfoCalendar] = useState(null);

  const [error, setError] = useState({
    name: null,
    isValid: true,
    textError: "null",
  });
  //useState of form personal

  const [nameOfStateForm, setNameOfStateForm] = useState(null);
  const [phoneOfStateForm, setPhoneOfStateForm] = useState(null);
  const [mailOfStateForm, setMailOfStateForm] = useState(null);

  // contexts

  const {
    personalInformationOfReservation,
    finalizeReservation,
    placeAndPeople,
    personalInformation,
    dateOfReservation,
  } = useReservations();

  // useEffect

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError({ name: null, isValid: true, textError: "null" });
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  // statement

  const generarOpciones = () => {
    const opciones = [];
    for (let i = 1; i <= 12; i++) {
      if (i === 1) {
        opciones.push(<option key={i}>{`${i} persona`}</option>);
      } else {
        opciones.push(
          <option key={i} value={i}>
            {i} personas
          </option>
        );
      }
    }
    return opciones;
  };

  const times = [
    "12:30 pm",
    "1:00 pm",
    "1:30 pm",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm",
    "4:00 pm",
    "4:30 pm",
    "5:00 pm",
    "5:30 pm",
    "6:00 pm",
    "6:30 pm",
    "7:00 pm",
    "7:30 pm",
    "8:00 pm",
    "8:30 pm",
    "9:00 pm",
    "9:30 pm",
  ];

  // funtion

  const goBackForm = () => {
    if (sections === "personalInformation")
      return setSections("placeAndPeople");
    if (sections === "confirmInformation")
      return setSections("personalInformation");
    if (sections === "finish") return setSections("confirmInformation");
    return;
  };

  const chanceImg = (e) => {
    setPlace(e);
  };

  const chanceStateCalendar = () => {
    setCalendar(!calendar);
  };

  // create new reservation again

  const createNewReservation = () => {
    setNameOfStateForm(null);
    setPhoneOfStateForm(null);
    setMailOfStateForm(null);

    setSections("placeAndPeople");
  };

  // form funticion

  const handleSubmit = async (e) => {
    e.preventDefault();

    const people = e.target.people.value;
    const time = e.target.time.value;

    const date = { people, time, place };

    //save reservation
    const responseReservation = await dateOfReservation(date, allInfoCalendar);
    if (!responseReservation) {
      setError({
        name: "first",
        isValid: false,
        textError: "Cupo lleno cambia la hora de tu reserva",
      });
      return;
    }
    setSections("personalInformation");
  };

  const handleSubmitPersonalInfo = async (event) => {
    event.preventDefault();

    const { name, isValid, textError } = validateForm(event);

    if (!isValid) {
      setError({ name: name, isValid, textError: textError });
      return;
    }

    const nameClient = event.target.name.value.trim();
    const phoneClient = event.target.phone.value.replace(/\s+/g, "");

    const mailClient = event.target.mail.value.trim() || null;

    setNameOfStateForm(nameClient);
    setPhoneOfStateForm(phoneClient);

    const date = { nameClient, phoneClient, mailClient };
    const type = "personalInformation";

    //save reservation
    await personalInformationOfReservation(type, date);

    setSections("confirmInformation");
  };

  const validateForm = (event) => {
    const name = event.target.name.value.trim();
    const phone = event.target.phone.value.replace(/\s+/g, "");
    const mail = event.target.mail.value.trim();

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    const phoneRegex = /^[0-9]+$/;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name))
      return {
        name: "name",
        isValid: false,
        textError: "Nombre inválido",
      };

    if (!phoneRegex.test(phone))
      return {
        name: "phone",
        isValid: false,
        textError: "Teléfono inválido",
      };

    if (!mailRegex.test(mail))
      return {
        name: "mail",
        isValid: true,
        textError: "Correo inválido",
      };

    return { name: null, isValid: true, textError: "null" };
  };

  const confirmInformation = async () => {
    await finalizeReservation();

    setSections("finish");
  };

  // funtion chance state

  const stateSections = () => {
    if (sections === "placeAndPeople")
      return (
        <form className="form-reservation-main" onSubmit={handleSubmit}>
          <div className="form-reservations">
            <div className="cont-select-icon-persons">
              <BsPersonFill />
              <select name="people"> {generarOpciones()}</select>
            </div>
            <div className="cont-select-calendario">
              <Calendario
                chanceStateCalendar={chanceStateCalendar}
                calendar={calendar}
                setCalendar={setCalendar}
                allInfoCalendar={allInfoCalendar}
                setAllInfoCalendar={setAllInfoCalendar}
              />
            </div>
            <div className="cont-select-time">
              <div className="select-time-container">
                <IoTimeOutline className="time-icon" />
                <select className="select-time" name="time">
                  {times.map((item, i) => (
                    <option key={i}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="button-reservas-continue">
            <button>Reservar</button>
          </div>
          <h2>{error.name === "first" ? error.textError : null}</h2>
        </form>
      );
    if (sections === "personalInformation")
      return (
        <form
          className="form-rerservation-confirm"
          onSubmit={handleSubmitPersonalInfo}
        >
          <div className="cont-input-nombre-reserva">
            <label>Nombre y apellido</label>
            <input
              name="name"
              placeholder="Nombre Completo"
              value={nameOfStateForm || ""}
              onChange={(e) => setNameOfStateForm(e.target.value)}
              required
            ></input>
            {/* error */}
            <h2>{error.name === "name" ? error.textError : null}</h2>
          </div>
          <div className="form-cont-reservas-input-text">
            <div className="form-cont-reservas-inputs">
              <div className="cont-input-nombre-reserva-telefono">
                <label>Telefono</label>
                <input
                  style={{
                    MozAppearance: "textfield",
                  }}
                  name="phone"
                  placeholder="Telefono"
                  type="num"
                  value={phoneOfStateForm || ""}
                  onChange={(e) => setPhoneOfStateForm(e.target.value)}
                  required
                ></input>
                {/* error */}
                <h2>{error.name === "phone" ? error.textError : null}</h2>
              </div>
              <div className="cont-input-nombre-reserva-correo">
                <label>Corre</label>
                <input
                  name="mail"
                  placeholder="Correo"
                  type="text"
                  onChange={(e) => setMailOfStateForm(e.target.value)}
                  value={mailOfStateForm || ""}
                ></input>
                {/* error */}
                <h2>{error.name === "mail" ? error.textError : null}</h2>
              </div>
            </div>
            <div className="cont-text-reserva-telefono-correo">
              <h3 className="cont-text-reserva-telefono-correo-first-h3">
                Te haremos una llamada de confirmacion de reserva
              </h3>
              <h3>Te estaremos mandando infomacion sobre nuestros eventos</h3>
            </div>
          </div>
          <div className="cont-button-next-form">
            <button>Reservar</button>
          </div>
        </form>
      );
    if (sections === "confirmInformation")
      return (
        <div className="cont-confirm-information">
          <div className="cont-personal-info">
            <h2>Nombre : {personalInformation.nameClient}</h2>
            <h2>Numero : {personalInformation.phoneClient}</h2>
            {personalInformation.mailClient ? (
              <h2>Mail : {personalInformation.mailClient}</h2>
            ) : null}
          </div>
            <div className="cont-place-time-person-info">
            <h2>Lugar : {placeAndPeople.place}</h2>
            <h2>Personas : {placeAndPeople.people}</h2>
            <h2>Hora : {placeAndPeople.time}</h2>
          </div>

          <button onClick={confirmInformation}>confirmar reserva</button>
        </div>
      );
    if (sections === "finish")
      return (
        <div>
          <h2>mira el menu y busca tu mejor obtxcion</h2>

          <button onClick={createNewReservation}>crear otra reservacion</button>

          <Link to={"/inventario/Menu"}>
            <h1>Menu</h1>
          </Link>
        </div>
      );
  };

  return (
    <div className="main-reservations">
      <div className="icons-floating">
        <div className="flour">
          <img src={`${import.meta.env.BASE_URL}icons/flour.png`} alt={2} />
        </div>
        <div className="apple">
          <img
            src={`${import.meta.env.BASE_URL}icons/healthy-food.png`}
            alt={2}
          />
        </div>
        <div className="fungus">
          <img src={`${import.meta.env.BASE_URL}icons/mushroom.png`} alt={2} />
        </div>
        <div className="leaf">
          <img src={`${import.meta.env.BASE_URL}icons/leaf.png`} alt={2} />
        </div>
      </div>
      <div className="cont-make-reservation">
        <div className="cont-map-img-reservatons">
          {/* first part */}
          <div className="cont-map-restautan">
            <h1 className="h1-reservations">Escoge tu lugar de reservación</h1>
            <div className="map-restauran">
              <nav>
                {restaurant
                  ? restaurant.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => chanceImg(item.nombre)}
                        className={`${
                          place === item.nombre ? `focus` : `none`
                        }`}
                      >
                        <h2>
                          {item.nombre.charAt(0).toUpperCase() +
                            item.nombre.slice(1)}
                        </h2>
                      </div>
                    ))
                  : null}
              </nav>
              <div className="cont-div-img-reservartion">
                <div className="cont-img-reservartion">
                  {animate ? (
                    <img
                      src={`${import.meta.env.BASE_URL}img/${place}.png`}
                      alt={place}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* second part */}

          <div className="cont-form-more">
            <h1 className="h1-reservations">Personaliza tu reserva</h1>

            {stateSections()}

            {sections !== "placeAndPeople" && sections !== "finish" ? (
              <div onClick={goBackForm}>
                <MdArrowBackIosNew />
              </div>
            ) : null}

            <div className="information">
              <h2>Pedir comida a domicilio o para llevar</h2>
              <div>
                <FaPhone />
                <h2>2768 2338</h2>
              </div>
            </div>
            <div className="others">
              <div className="text">
                <h2>menu</h2>
              </div>
              <div className="linea-y"></div>
              <div className="text">
                <h2>photos</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reservas;
