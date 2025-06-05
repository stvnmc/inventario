import { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
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
    // setPlaceAndPeople({
    //   place: date.place,
    //   people: date.people,
    //   time: date.time,
    // });

    const collectionRef = collection(db, "reservationDate");

    console.log(allInfoCalendar.day);
    console.log(allInfoCalendar.month);
    console.log(allInfoCalendar.year);

    try {
      const newReservation = {
        placeAndPeople: date,
        createdAt: new Date(),
      };

      // const docRef = doc(collectionRef, newReservation);

      // const getRef = await getDoc(docRef);

      // console.log(getRef)

      const id = `${allInfoCalendar.month}-${allInfoCalendar.year}`;
      const docRef = doc(db, "reservationDate", id);
      await setDoc(docRef, newReservation);
      console.log("Documento creado con ID personalizado:", id);

      // const reservations = querySnapshot.docs.map((doc) => {
      //   console.log(doc.id, doc.data().placeAndPeople ); // mostrar en consola
      //   return {
      //     id: doc.id,
      //     ...doc.data(), // devolver los datos
      //   };
      // });

      // const docRef = await addDoc(collectionRef, newReservation);

      // console.log("Reservas encontradas:", docRef);

      return true;
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
