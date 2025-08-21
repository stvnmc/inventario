import React, { useState } from "react";
import { BiUserMinus } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";
import { BiUserCheck } from "react-icons/bi";

const Reservation = ({
  calendarState,
  reservations,
  calendarStateId,
  deletedAdminReservations,
}) => {
  const editReservation = (index, item) => {
    console.log(index, item);
  };

  const [showEditform, setShowEditform] = useState(true);
  const [confirmSaveReservation, setConfirmSaveReservation] = useState(true);
  const [indexShow, setindexShow] = useState(null);
  const [formData, setFormData] = useState({
    nameClient: "",
    phoneClient: "",
    time: "",
    people: "",
    place: "",
    mailClient: "",
  });

  const openEditReservation = async (index, item) => {
    if (null !== indexShow)
      if (index !== indexShow) {
        console.log("no enrra");
        closeFormReservation();
        return;
      }

    console.log(index);
    console.log(indexShow);

    setFormData({
      nameClient: item.personalInformation.nameClient || "",
      phoneClient: item.personalInformation.phoneClient || "",
      time: item.placeAndPeople.time || "",
      people: item.placeAndPeople.people || "",
      place: item.placeAndPeople.place || "",
      mailClient: item.personalInformation.mailClient || "",
    });
    setindexShow(index);
    setShowEditform(true);
  };

  //

  const closeFormReservation = async () => {
    setindexShow(null);
    setConfirmSaveReservation(false);
  };

  const saveEdictReservation = () => {
    console.log("save");
    setConfirmSaveReservation(false);
    closeFormReservation(false);
  };

  return (
    <div
      className={`reservations ${calendarState === "second" ? "" : "close"}`}
    >
      {reservations &&
        calendarStateId &&
        reservations[calendarStateId] &&
        Object.values(reservations[calendarStateId][0]).map((item, index) => (
          <div className="reservation" key={index}>
            {showEditform && index === indexShow ? (
              confirmSaveReservation ? (
                <>
                  <div className="edit-reservation">
                    <button>
                      <BiUserCheck onClick={saveEdictReservation} />
                    </button>
                  </div>
                  <form>
                    <h2>name</h2>
                    <input
                      name="nameClient"
                      placeholder="Nombre Completo"
                      value={formData.nameClient}
                      onChange={(e) =>
                        setFormData({ ...formData, nameClient: e.target.value })
                      }
                    />
                    <div>
                      <h3>phone</h3>
                      <input
                        name="phoneClient"
                        value={formData.phoneClient}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneClient: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <div>time</div>
                      <input
                        name="time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                      />
                      <div>people</div>
                      <input
                        name="people"
                        value={formData.people}
                        onChange={(e) =>
                          setFormData({ ...formData, people: e.target.value })
                        }
                      />
                      <div>place</div>
                      <input
                        name="phoneClient"
                        value={formData.place}
                        onChange={(e) =>
                          setFormData({ ...formData, place: e.target.value })
                        }
                      />
                      {item.personalInformation.mailClient ? (
                        <>
                          <div>gmail</div>
                          <input
                            name="phoneClient"
                            value={formData.mailClient}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mailClient: e.target.value,
                              })
                            }
                          />
                        </>
                      ) : null}
                    </div>
                  </form>
                </>
              ) : (
                <div>
                  <h2>guardar la reserva?</h2>
                  <button onClick={saveEdictReservation}>Si</button>
                  <button onClick={closeFormReservation}>No</button>
                </div>
              )
            ) : (
              <>
                <h2>{item.personalInformation.nameClient}</h2>
                <div>
                  <h3>{item.personalInformation.phoneClient}</h3>
                </div>
                <div>
                  <div>{item.placeAndPeople.time}</div>
                  <div>{item.placeAndPeople.people}</div>
                  <div>{item.placeAndPeople.place}</div>
                  <div>{item.personalInformation.mailClient}</div>
                </div>
                <div className="edit-reservation">
                  <button>
                    <BiUserCheck />
                  </button>
                  <button onClick={() => openEditReservation(index, item)}>
                    <BiUserPlus />
                  </button>

                  <button
                    onClick={() =>
                      deletedAdminReservations(index, item.placeAndPeople.time)
                    }
                  >
                    <BiUserMinus />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default Reservation;
