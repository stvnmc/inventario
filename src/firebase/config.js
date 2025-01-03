import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4tvqSLRMybG7sITT2Xl-A9Zul_GkyhXM",
  authDomain: "rosso-di-roma.firebaseapp.com",
  projectId: "rosso-di-roma",
  storageBucket: "rosso-di-roma.firebasestorage.app",
  messagingSenderId: "915475809411",
  appId: "1:915475809411:web:ee67c1dc84a9a9896407b6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const dbAuth = getAuth(app);
