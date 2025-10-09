// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vingo-food-delivery-3c1da.firebaseapp.com",
  projectId: "vingo-food-delivery-3c1da",
  storageBucket: "vingo-food-delivery-3c1da.firebasestorage.app",
  messagingSenderId: "945796843178",
  appId: "1:945796843178:web:5862af59444b41e9f872d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth} 
