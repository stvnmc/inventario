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

  const [timeReservation, SetTimeReservation] = useState({
    id: null,
    day: null,
    hour: null,
  });

  async function dateOfReservation(date, allInfoCalendar) {
    setPlaceAndPeople({
      place: date.place,
      people: date.people,
      time: date.time,
    });

    const id = `${allInfoCalendar.month}-${allInfoCalendar.year}`;
    const day = `${allInfoCalendar.day}`;
    const hour = date.time;

    SetTimeReservation({
      id: id,
      day: day,
      hour: hour,
    });

    const parentDoc = doc(db, "reservation", id);
    const dayCollection = collection(parentDoc, day);
    const hourDocRef = doc(dayCollection, hour);

    try {
      const docSnap = await getDoc(hourDocRef);

      if (!docSnap.exists()) {
        return true;
      } else {
        const data = docSnap.data();
        const firstKey = Object.keys(data).length;

        if (firstKey < 5) {
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  async function personalInformationOfReservation(type, date) {
    if (type === "personalInformation") {
      setPersonalInformation({
        nameClient: date.nameClient,
        phoneClient: date.phoneClient,
        mailClient: date.mailClient,
      });
    }

    return true;
  }

  async function finalizeReservation() {
    try {
      const { id, day, hour } = timeReservation;

      const hourDocRef = doc(db, "reservation", id, day, hour);

      await setDoc(
        hourDocRef,
        {
          [personalInformation.nameClient]: {
            personalInformation,
            placeAndPeople,
          },
        },
        { merge: true }
      );

      await addDayToReservation(id, day);

      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  }

  async function addDayToReservation(id, day) {
    const parentDoc = doc(db, "reservation", id);

    try {
      await updateDoc(parentDoc, {
        days: arrayUnion(day),
      });
    } catch (error) {
      if (error.code === "not-found") {
        await setDoc(parentDoc, {
          days: [day],
        });
      } else {
        console.error("Error al agregar día:", error);
      }
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
