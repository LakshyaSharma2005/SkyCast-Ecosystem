// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmI6pZbdU_OrDXBVp3axPTQT9yFv4roLA",
  authDomain: "skycast-a5bd0.firebaseapp.com",
  databaseURL: "https://skycast-a5bd0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skycast-a5bd0",
  storageBucket: "skycast-a5bd0.firebasestorage.app",
  messagingSenderId: "653625979173",
  appId: "1:653625979173:web:ce2e10d730b50e8a23eacc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);