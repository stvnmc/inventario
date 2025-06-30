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
  const [reservations, setReservations] = useState(null);

  async function getAllReservationsOfMonth(month, year) {
    const monthYear = `${month}-${year}`;

    const monthDocRef = doc(db, "reservation", monthYear);
    const monthDocSnap = await getDoc(monthDocRef);

    if (!monthDocSnap.exists()) {
      console.warn("No existe el documento del mes:", monthYear);
      return setReservations();
    }

    const days = monthDocSnap.data().days;

    const allReservations = {};

    for (const day of days) {
      const ref = collection(db, "reservation", monthYear, day);
      const snapshot = await getDocs(ref);

      const reservations = [];

      snapshot.forEach((doc) => {
        reservations.push({ ...doc.data() });
      });
      allReservations[day] = reservations;
    }

    setReservations(allReservations);
    return;
  }

  return (
    <AdminReservationContext.Provider
      value={{ getAllReservationsOfMonth, reservations }}
    >
      {children}
    </AdminReservationContext.Provider>
  );
};
