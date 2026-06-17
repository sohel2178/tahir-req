import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  off,
  get,
  onChildChanged,
} from "firebase/database";

// 🔥 Your Firebase project configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAsM3X9NrOF97Hk6fyqtmGlObT93HjnBeA",
//   authDomain: "tiktiki-97da4.firebaseapp.com",
//   databaseURL:
//     "https://tiktiki-97da4-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "tiktiki-97da4",
//   storageBucket: "tiktiki-97da4.firebasestorage.app",
//   messagingSenderId: "118654296430",
//   appId: "1:118654296430:web:450899d6deae5efd99e17f",
//   measurementId: "G-X3LV18YHVL",
// };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL:
    "https://tiktiki-97da4-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// ✅ Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Database (Realtime Database)
const database = getDatabase(firebaseApp);

export { firebaseApp, database, ref, onValue, off, get, onChildChanged };
