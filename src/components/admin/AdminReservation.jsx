import React, { useEffect, useState } from "react";

import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { BiUserMinus } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";
import { BiUserCheck } from "react-icons/bi";
import { MdArrowBackIosNew } from "react-icons/md";
import { SlSizeFullscreen } from "react-icons/sl";
import { FaRegStar } from "react-icons/fa";
import {
  dayNames,
  dayOfMonth,
  getInfoCalendar,
  month,
  monthsNames,
  year,
} from "../../infoPage/GetCalendar.js";
import { useAdminReservation } from "../../context/AdminReservationContext.jsx";

const AdminReservation = ({ setSite }) => {
  //context
  const { getAllReservationsOfMonth, reservations, deletedReservations } =
    useAdminReservation();
  // state
  const [infoCalendar, setInfoCalendar] = useState([]);
  const [monthChance, setMonthChance] = useState(new Date().getMonth() + 1);
  const [yearChance, setYearChance] = useState(new Date().getFullYear());

  //state page effects

  const [calendarState, setCalendarState] = useState("open");
  const [calendarStateId, setCalendarStateId] = useState(null);

  const getCalendar = async () => {
    const calendarInfo = await getInfoCalendar(monthChance, dayOfMonth);
    setInfoCalendar(calendarInfo);
  };

  //useEffect

  useEffect(() => {
    getCalendar(monthChance);
    getInfoAdminReservation();
  }, [monthChance]);

  useEffect(() => {
    console.log(calendarStateId);
    console.log(reservations);
  }, [reservations]);

  const chanceMonthCalendar = (e) => {
    setMonthChance((prev) => {
      if (prev === 11 && e === "next") {
        setYearChance(yearChance + 1);
        return 0;
      }
      if (prev === 0 && e === "former") {
        setYearChance(yearChance - 1);
        return 11;
      }
      return e === "former" ? prev - 1 : prev + 1;
    });
  };

  // context calendar

  const getInfoAdminReservation = async () => {
    await getAllReservationsOfMonth(monthChance, yearChance);
  };

  const deletedAdminReservations = async (index, hour) => {
    await deletedReservations(
      monthChance,
      yearChance,
      calendarStateId,
      index,
      hour
    );
  };

  // funtion

  const openNextPart = (e) => {
    setCalendarState("second");
    setCalendarStateId(e);
  };
  const openCalendar = () => {
    setCalendarState("open");
    setCalendarStateId(null);
  };

  return (
    <div className="adminReservation">
      <div>
        <MdArrowBackIosNew onClick={() => setSite("dashboard")} />
      </div>
      <div className={`calendar ${calendarState === "second" ? "close" : ""}`}>
        <div className="cont-icon-full-scrim">
          <SlSizeFullscreen onClick={openCalendar} />
        </div>
        <div className="calendar-month">
          <div
            className="calendar-month-button"
            onClick={() => chanceMonthCalendar("former")}
          >
            <SlArrowLeft />
          </div>
          <h2>{monthsNames[monthChance]}</h2>
          <div
            className="calendar-month-button"
            onClick={() => chanceMonthCalendar("next")}
          >
            <SlArrowRight />
          </div>
        </div>
        <div className="icons-days-name">
          {dayNames.map((dayName, index) => (
            <h2 key={index}>
              {calendarState === "second" ? dayName.slice(0, 2) : dayName}
            </h2>
          ))}
        </div>
        <div className="calendar-days">
          {infoCalendar?.map(({ dayNumber, type }, index) => {
            const isNotAllowed =
              yearChance !== year ||
              month > monthChance ||
              (month === monthChance &&
                dayOfMonth > dayNumber &&
                type !== "next") ||
              (month === monthChance && type === "former");

            const handleClick = () => {
              if (isNotAllowed) return;

              if (type === "former" || type === "next") {
                chanceMonthCalendar(type);
              } else {
                reservations &&
                  reservations[dayNumber] &&
                  !isNotAllowed &&
                  openNextPart(dayNumber);
              }
            };

            const classNames = [
              isNotAllowed ? "not-allowed" : type,
              dayOfMonth === dayNumber && month === monthChance ? "to-day" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={index}
                onClick={isNotAllowed ? null : handleClick}
                className={classNames}
              >
                <h2>{dayNumber}</h2>

                {reservations &&
                  reservations[dayNumber] &&
                  !isNotAllowed &&
                  type === "current" && <FaRegStar />}
              </div>
            );
          })}
        </div>
      </div>
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
                <button>
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
              <h2>{item.personalInformation.nameClient}</h2>
              <div>
                <h3>{item.personalInformation.phoneClient}</h3>
              </div>
              <div>
                <div>{item.placeAndPeople.time}</div>
                <div>{item.placeAndPeople.people}</div>
                <div>{item.placeAndPeople.place}</div>
              </div>
              <div>{item.personalInformation.mailClient}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminReservation;
