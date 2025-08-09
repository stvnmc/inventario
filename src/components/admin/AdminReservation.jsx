import React, { useEffect, useState } from "react";

import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
import Reservation from "./componentsReservationAdmin/Reservation.jsx";
import { Await } from "react-router-dom";

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
  const [showCalendar, setShowCalendar] = useState(false);

  //useEffect

  useEffect(() => {
    getInfoCalendarAndgetCalendarDays();
  }, []);

  // funtion info page

  const getCalendar = async () => {
    const calendarInfo = await getInfoCalendar(monthChance, dayOfMonth);
    setInfoCalendar(calendarInfo);
  };

  const chanceMonthCalendar = async (e) => {
    await getInfoCalendarAndgetCalendarDays();

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

  // getcalendar

  const getInfoCalendarAndgetCalendarDays = async () => {
    setShowCalendar(false);
    await getInfoAdminReservation();
    await getCalendar(monthChance);

    setShowCalendar(true);
    return;
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

  // show day calendar

  const dayCalendarShow = () => {
    return infoCalendar?.map(({ dayNumber, type }, index) => {
      const isNotAllowed =
        yearChance !== year ||
        month > monthChance ||
        (month === monthChance && dayOfMonth > dayNumber && type !== "next") ||
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

      const isDayValid =
        !isNotAllowed &&
        type === "current" &&
        reservations &&
        reservations[dayNumber];

      return (
        <div
          key={index}
          onClick={isNotAllowed ? null : handleClick}
          className={showCalendar ? classNames : null}
        >
          {showCalendar ? (
            <>
              <h2>{dayNumber}</h2>
              {isDayValid ? <FaRegStar /> : null}
            </>
          ) : (
            <div className="icon-loading">
              <AiOutlineLoading3Quarters />
            </div>
          )}
        </div>
      );
    });
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

        {infoCalendar && infoCalendar.length > 0 ? (
          <div className="calendar-days">{dayCalendarShow()}</div>
        ) : (
          <div className="loading-message">
            <div className="icon-loading">
              <AiOutlineLoading3Quarters />
            </div>
          </div>
        )}
      </div>
      <Reservation
        calendarState={calendarState}
        reservations={reservations}
        calendarStateId={calendarStateId}
        deletedAdminReservations={deletedAdminReservations}
      />
    </div>
  );
};

export default AdminReservation;
