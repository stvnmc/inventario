import React, { useEffect, useState } from "react";

import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import {
  dayNames,
  dayOfMonth,
  getInfoCalendar,
  month,
  monthsNames,
  year,
} from "../../infoPage/GetCalendar.js";
import { useAdminReservation } from "../../context/AdminReservationContext.jsx";

const AdminReservation = () => {
  //context
  const { getAllReservationsOfMonth, reservations } = useAdminReservation();
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
    if (calendarStateId && reservations[calendarStateId]) {
      console.log(reservations[calendarStateId][0]);
      Object.values(reservations[calendarStateId][0]).map((item, index) => {
        console.log(item);
        console.log(index);
      });
    }
  }, [calendarStateId, reservations]);

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

  // funtion

  const openNextPart = (e) => {
    setCalendarState("second");
    setCalendarStateId(e);
  };

  return (
    <div>
      <div className="adminReservation">
        <div
          className={`calendar ${calendarState === "second" ? "close" : ""}`}
        >
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
                dayOfMonth === dayNumber && month === monthChance
                  ? "to-day"
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={index}
                  onClick={isNotAllowed ? null : handleClick}
                  className={classNames}
                >
                  {dayNumber}

                  {reservations && reservations[dayNumber] && !isNotAllowed && (
                    <div>existe</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="">
          <h2>show time reservationF</h2>
          {reservations &&
            calendarStateId &&
            reservations[calendarStateId] &&
            Object.values(reservations[calendarStateId][0]).map(
              (item, index) => (
                <div className={index} key={index}>
                  <div>{item.placeAndPeople.people}</div>
                  <div>{item.placeAndPeople.place}</div>
                  <div>{item.placeAndPeople.time}</div>
                  <div>{item.personalInformation.nameClient}</div>
                  <div>{item.personalInformation.phoneClient}</div>
                  <div>{item.personalInformation.mailClient}</div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminReservation;
