import { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);

  if (!context) {
    console.warn(
      "userContext not found. Make sure you are using UserProvider."
    );
  }

  return context;
};

export const ReservartionsProvider = ({ children }) => {
  const [placeAndPeople, setPlaceAndPeople] = useState({
    place: null,
    people: null,
    time: null,
  });

  const [personalInformation, setPersonalInformation] = useState({
    nameClient: null,
    phoneClient: null,
    mailClient: null,
  });

  async function dateOfReservation(date, allInfoCalendar) {
    setPlaceAndPeople({
      place: date.place,
      people: date.people,
      time: date.time,
    });

    try {
      const newReservation = {
        people: date.people,
        plase: date.place,
      };

      const id = `${allInfoCalendar.month}-${allInfoCalendar.year}`;
      const day = `${allInfoCalendar.day}`;
      const hour = date.time;

      console.log(day);

      const dayCollectionRef = collection(doc(db, "reservation", id), day);

      // Obtener todos los documentos de ese día
      const querySnapshot = await getDocs(dayCollectionRef);

      const reservas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalReservas = reservas.length;

      console.log(totalReservas);

      if (totalReservas < 5) {
        // const docRef = doc(db, "reservation", id);

        // const timeCollectionRef = collection(docRef, day);

        // await addDoc(timeCollectionRef, newReservation, date.time);
        // return true;

        const timeDocRef = doc(db, "reservation", id, day, hour);

        await setDoc(timeDocRef, { user: newReservation }, { merge: true });
        return true;
      }

      return `cupo limitado a las ${date.time}`;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  function personalInformationOfReservation(date) {
    setPersonalInformation({
      nameClient: date.nameClient,
      phoneClient: date.phoneClient,
      mailClient: date.mailClient,
    });
    return;
  }

  async function finalizeReservation() {
    const collectionRef = collection(db, "reservation");

    try {
      const newReservation = {
        personalInformation: personalInformation,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collectionRef, newReservation);
      console.log("Document written with ID: ", docRef.id);

      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  return (
    <ReservationContext.Provider
      value={{
        personalInformationOfReservation,
        dateOfReservation,
        finalizeReservation,
        placeAndPeople,
        personalInformation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
