import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC4VJmjLxJseJ8Q3qYYQT2RW5D9XFnXVJE",
    authDomain: "myapp-cds.firebaseapp.com",
    projectId: "myapp-cds",
    storageBucket: "myapp-cds.firebasestorage.app",
    messagingSenderId: "22184616053",
    appId: "1:22184616053:web:fc0b342736c96974dfd83c",
    measurementId: "G-TBLBK2MV54"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


//Direct from firebase

/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4VJmjLxJseJ8Q3qYYQT2RW5D9XFnXVJE",
  authDomain: "myapp-cds.firebaseapp.com",
  projectId: "myapp-cds",
  storageBucket: "myapp-cds.firebasestorage.app",
  messagingSenderId: "22184616053",
  appId: "1:22184616053:web:fc0b342736c96974dfd83c",
  measurementId: "G-TBLBK2MV54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/