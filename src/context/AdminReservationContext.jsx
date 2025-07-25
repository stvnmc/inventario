import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";

export const AdminReservationContext = createContext();

export const useAdminReservation = () => {
  const context = useContext(AdminReservationContext);

  if (!context) {
    console.warn(
      "userContext not found. Make sure you are using UserProvider."
    );
  }

  return context;
};

export const AdminReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(null);

  async function getAllReservationsOfMonth(month, year) {
    const monthYear = `${month}-${year}`;

    const monthDocRef = doc(db, "reservation", monthYear);
    const monthDocSnap = await getDoc(monthDocRef);

    if (!monthDocSnap.exists()) {
      setReservations();
      return;
    }

    const days = monthDocSnap.data().days;
    const allReservations = {};

    const promises = days.map(async (day) => {
      const ref = collection(db, "reservation", monthYear, day);
      const snapshot = await getDocs(ref);
      const reservations = [];

      snapshot.forEach((doc) => {
        reservations.push({ ...doc.data() });
      });

      return { day, reservations };
    });

    // Ejecutamos todas las lecturas en paralelo
    const results = await Promise.all(promises);

    // Convertimos el array a un objeto
    results.forEach(({ day, reservations }) => {
      allReservations[day] = reservations;
    });
    setReservations(allReservations);
  }

  async function deletedReservations(month, year, day, user, hour) {
    const reservationsUpdate = [];

    const dayReservations = reservations[day][0];

    Object.entries(dayReservations).forEach(([index, item]) => {
      if (parseInt(index) !== user) {
        reservationsUpdate.push({ ...item });
      }
    });

    const reservationsUpdateObj = {};
    reservationsUpdate.forEach((item, index) => {
      reservationsUpdateObj[index] = item;
    });

    const dayDocRef = doc(
      db,
      "reservation",
      `${month}-${year}`,
      day.toString(),
      hour.toString()
    );
    await setDoc(dayDocRef, reservationsUpdateObj);

    console.log(reservationsUpdate.length);
    if (reservationsUpdate.length === 0) {
      await deletedDayCalendar(month, year, day);
    }

    await getAllReservationsOfMonth(month, year);

    return;
  }

  async function deletedDayCalendar(month, year, day) {
    const monthYear = `${month}-${year}`;

    const dayDocRef = doc(db, "reservation", monthYear);
    const dayDocSnap = await getDoc(dayDocRef);

    const data = dayDocSnap.data();
    const days = data.days;

    const reservationsDayUpdate = [];

    days.map((iteam) => {
      if (iteam !== day.toString()) {
        reservationsDayUpdate.push(iteam);
      }
    });
    await setDoc(dayDocRef, {
      days: reservationsDayUpdate,
    });
  }
  return (
    <AdminReservationContext.Provider
      value={{ getAllReservationsOfMonth, reservations, deletedReservations }}
    >
      {children}
    </AdminReservationContext.Provider>
  );
};
