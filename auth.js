// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYDkbaLCBddsVwdKhgSyR0DtY-i4wSw8k",
  authDomain: "auth-advocaciaaws.firebaseapp.com",
  projectId: "auth-advocaciaaws",
  storageBucket: "auth-advocaciaaws.firebasestorage.app",
  messagingSenderId: "1027780834429",
  appId: "1:1027780834429:web:071483b0af40c6e95cad14",
  measurementId: "G-L8YXS362WQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
