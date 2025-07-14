import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
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
      setReservations(); // Podrías pasar null o {} si es necesario
      return;
    }

    const days = monthDocSnap.data().days;
    const allReservations = {};

    // Creamos un array de promesas
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
    console.log(allReservations);
  }

  async function deletedReservations(month, year, day, user, hour) {
    const monthYear = `${month}-${year}`;

    console.log(monthYear, day, hour);
    const hourDocRef = doc(db, "reservation", monthYear, day.toString(), hour);

    const updatedData = {};

    console.log(reservations[day]);

    // updatedData[index] = item;
    reservations[day].forEach((item, index) => {
      console.log(index, item[user]);
    });

    // await setDoc(hourDocRef, updatedData);

    // console.log(updatedData);
    // console.log(reservations);

    // setReservations((prev) => ({
    //   ...prev,
    //   day: prev[day].filter((_, index) => index !== user),
    // }));

    // const monthYear = `${month}-${year}`;

    // const allReservations = {};

    // if (user === 0) {
    //   return setReservations();
    // }

    // const ref = collection(db, "reservation", monthYear, dayy.toString());
    // const snapshot = await getDocs(ref);

    // const reservations = [];

    // snapshot.forEach((doc) => {
    //   console.log(doc.data()[user]);

    //   if (doc.data()[user]) {
    //     reservations.push({ ...doc.data() });
    //   }
    // });

    // console.log(reservations);

    // allReservations[day] = reservations;

    // const reservations = [];

    // snapshot.forEach((doc) => {
    //   reservations.push({ ...doc.data() });
    // });

    // allReservations[day] = reservations;

    return;
  }

  return (
    <AdminReservationContext.Provider
      value={{ getAllReservationsOfMonth, reservations, deletedReservations }}
    >
      {children}
    </AdminReservationContext.Provider>
  );
};
