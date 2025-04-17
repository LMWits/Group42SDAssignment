// Firebase SDK Imports
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  OAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { browserPopupRedirectResolver } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfTyF0s-5Ijyj0eUOMNPGpHM04UI_U2bg",
  authDomain: "group42sdproject.firebaseapp.com",
  projectId: "group42sdproject",
  storageBucket: "group42sdproject.firebasestorage.app",
  messagingSenderId: "741179377608",
  appId: "1:741179377608:web:86c2409951d770f224e2fd",
  measurementId: "G-6MGSMSMPZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});
const db = getFirestore();
const analytics = getAnalytics(app);

// Microsoft OAuth Provider Setup
const provider = new OAuthProvider('microsoft.com');
provider.addScope('email');
provider.addScope('profile');
provider.setCustomParameters({ prompt: 'login' });

export { auth, provider };

// Utility Function
function showMessage(message, pId) {
  const errorMessage = document.getElementById(pId);
  if (errorMessage) {
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
    errorMessage.style.opacity = 1;
    setTimeout(() => {
      errorMessage.style.opacity = 0;
    }, 4000);
  }
}

// ==========================
// ✅ Sign Up Logic
// ==========================
const signUp = document.getElementById('signUpbtn');

if (signUp) {
  signUp.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('Email').value.trim();
    const password = document.getElementById('Password').value;
    const name = document.getElementById('Name')?.value || "";

    if (!email || !password || !name) {
      showMessage('Please fill in all fields', 'signInMessage');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
          email: email,
          name: name,
          role: "user"
        };

        showMessage('Account Created Successfully', 'signInMessage');

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            window.location.href = 'UserUILogin/userlogin.html';
          })
          .catch((error) => {
            console.error("Error Occurred When Writing Document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists!', 'signInMessage');
        } else {
          showMessage('Unable to Create User', 'signInMessage');
        }
      });
  });
}

// ==========================
// ✅ Sign In Logic
// ==========================
const signIn = document.getElementById('signInbtn');

if (signIn) {
  signIn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('Email').value.trim();
    const password = document.getElementById('Password').value;

    if (!email || !password) {
      showMessage('Please enter both Email and Password', 'signInMessage');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage("Login Is Successful", 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homePage.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
          showMessage('Account Does Not Exist', 'signInMessage');
        }
      });
  });
}
