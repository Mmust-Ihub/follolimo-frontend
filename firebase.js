// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDplWakOccuIjE-kdkF5R12P5TnpiJTRNw",
  authDomain: "application-91b1d.firebaseapp.com",
  projectId: "application-91b1d",
  storageBucket: "application-91b1d.appspot.com",
  messagingSenderId: "251116318497",
  appId: "1:251116318497:web:ee51186aa32c12efdd1860",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
export { db, app };
