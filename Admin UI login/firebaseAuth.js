// Import the functions you need from the SDKs you need

import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {getAuth, OAuthProvider, indexedDBLocalPersistence, initializeAuth} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { browserPopupRedirectResolver } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBfTyF0s-5Ijyj0eUOMNPGpHM04UI_U2bg",
    authDomain: "group42sdproject.firebaseapp.com",
    projectId: "group42sdproject",
    storageBucket: "group42sdproject.firebasestorage.app",
    messagingSenderId: "741179377608",
    appId: "1:741179377608:web:194b7f53db28312824e2fd",
    measurementId: "G-P1C8Y3H2LJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {persistence: indexedDBLocalPersistence, popupRedirectResolver: browserPopupRedirectResolver}); 
  const provider = new OAuthProvider('microsoft.com');

  provider.addScope('email');  // Add email scope
  provider.addScope('profile');  // Add profile scope
  provider.setCustomParameters({
    prompt: 'login' // forces user to re-select or sign in
  });
  
  export { auth, provider };
  const analytics = getAnalytics(app);
  console.log(auth); // should be an initialized auth instance
  console.log(provider); // should be an OAuthProvider with 'microsoft.com'
  
  function showMessage(message, pId){
    
    var errorMessage = document.getElementById(pId);
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
    errorMessage.style.opacity = 1;
    setTimeout(function(){
        errorMessage.style.opacity = 0;
    },4000)
  }

  const signUp = document.getElementById('signUpbtn');
  
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
  
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const name = document.getElementById('Name').value;

    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('createUserWithEmailAndPassword');
    
        const user = userCredential.user;
        const userData = {
            email: email,
            name: name,
        };
        showMessage('Acount Created Successfully', 'signInMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Error Occurred When Writing Document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if(errorCode == 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists!', 'signInMessage');
        } else {
            showMessage('Unable to Create User', 'signInMessage');
        }
    })
  });

  const signIn = document.getElementById('signInbtn');
  signIn.addEventListener('click', (event) => {
    event.preventDefault();
      const email = document.getElementById('Email').value;
      const password = document.getElementById('Password').value;

      

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage("Login Is Successful",'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homePage.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-credential'){
          showMessage('Incorrect Email or Password', 'signInMessage');
        } else if(email == null || password == null){
          showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
          showMessage('Account Does Not Exist', 'signInMessage');
        }
      })
  });