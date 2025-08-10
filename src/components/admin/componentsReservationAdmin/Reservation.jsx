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
  const [indexShow, setindexShow] = useState(null);

  const openEditReservation = (index) => {
    setindexShow(index);
    setShowEditform(!showEditform);
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
            <div className="edit-reservation">
              <button>
                <BiUserCheck />
              </button>
              <button onClick={() => openEditReservation(index)}>
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
            {showEditform && index === indexShow ? (
              <form>
                <h2>name</h2>
                <input value={item.personalInformation.nameClient}></input>
                <div>
                  <h3>phone</h3>
                  <input value={item.personalInformation.phoneClient}></input>
                </div>
                <div>
                  <div>time</div>
                  <input value={item.placeAndPeople.time}></input>
                  <div>people</div>
                  <input value={item.placeAndPeople.people}></input>
                  <div>place</div>
                  <input value={item.placeAndPeople.place}></input>
                  {item.personalInformation.mailClient ? (
                    <>
                      <div>gmail</div>
                      <input
                        value={item.personalInformation.mailClient}
                      ></input>
                    </>
                  ) : null}
                </div>
              </form>
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
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default Reservation;
