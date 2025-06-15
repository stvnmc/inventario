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

      const parentDoc = doc(db, "reservation", id);
      const dayCollection = collection(parentDoc, day);
      const hourDocRef = doc(dayCollection, hour);

      const docSnap = await getDoc(hourDocRef);

      if (!docSnap.exists()) {
        return true;
        // await setDoc(hourDocRef, { 1: newReservation });
      } else {
        const data = docSnap.data();
        const firstKey = Object.keys(data).length;
        if (firstKey < 5) {
          // const newkey = Number(firstKey) + 1;

          // await setDoc(
          //   hourDocRef,
          //   { [newkey]: newReservation },
          //   { merge: true }
          // );
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
