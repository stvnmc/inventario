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

  const getCalendar = async () => {
    const calendarInfo = await getInfoCalendar(monthChance, dayOfMonth);
    setInfoCalendar(calendarInfo);
  };

  //useEffect

  useEffect(() => {
    getCalendar(monthChance);
    getInfoAdminReservation();
  }, [monthChance]);

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

  return (
    <div>
      adminReservation
      <div className="adminReservation">
        <div className="calendar">
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
              <h2 key={index}>{dayName}</h2>
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
                  pushInfoCalendar(dayNumber);
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

                  {reservations ? (
                    <div>{reservations[dayNumber] ? "existe" : null}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservation;
