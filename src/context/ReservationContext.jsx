import { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";

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

  function dateOfReservation(type, date) {
    if (type === "placeAndPeople") {
      setPlaceAndPeople({
        place: date.place,
        people: date.people,
        time: date.time,
      });

      return;
    }
    if (type === "personalInformation") {
      setPersonalInformation({
        nameClient: date.nameClient,
        phoneClient: date.phoneClient,
        mailClient: date.mailClient,
      });

      return;
    }
    return;
  }

  async function finalizeReservation() {
    const collectionRef = collection(db, "reservation");

    try {
      const newReservation = {
        personalInformation: personalInformation,
        placeAndPeople: placeAndPeople,
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
