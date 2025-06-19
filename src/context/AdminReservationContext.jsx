import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
  async function getAllReservationsOfMonth(month, year) {
    const monthYear = `${month}-${year}`;
    const allReservations = {};

    for (let day = 1; day <= 31; day++) {
      const dayStr = day.toString();

      // 1. Referencia al documento del mes-año
      const monthDocRef = doc(db, "reservation", monthYear);

      // 2. Obtener la subcolección del día correctamente
      const dayCollectionRef = collection(monthDocRef, dayStr);

      try {
        const snapshot = await getDocs(dayCollectionRef);
        console.log(allReservations);

        if (!snapshot.empty) {
          allReservations[dayStr] = {};

          snapshot.forEach((docSnap) => {
            allReservations[dayStr][docSnap.id] = docSnap.data();
          });
        }
      } catch (error) {
        console.error(
          `Error obteniendo reservas para el día ${dayStr}:`,
          error
        );
      }
    }

    return allReservations;
  }

  return (
    <AdminReservationContext.Provider value={{ getAllReservationsOfMonth }}>
      {children}
    </AdminReservationContext.Provider>
  );
};
