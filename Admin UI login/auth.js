import { auth, db } from './firebaseAuth.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function showMessage(message, pId) {
  var errorMessage = document.getElementById(pId);
  if (!errorMessage) {
    errorMessage = document.getElementById("loginMessage");
  }

  if (errorMessage) {
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
    errorMessage.style.opacity = 1;
    errorMessage.style.pointerEvents = "auto";

    setTimeout(function () {
      errorMessage.style.opacity = 0;
      errorMessage.style.pointerEvents = "none";
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 500);
    }, 4000);
  }
}

/* // Admin Sign-Up
const signUp = document.getElementById('signUpBtn');

signUp.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('Email').value;
  const password = document.getElementById('Password').value;
  const name = document.getElementById('Name').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        name: name,
        role: "admin"
      };

      showMessage('Admin account created successfully.', 'loginMessage');

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'adminLogin.html';
        })
        .catch((error) => {
          console.error("Error writing admin document:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email already exists!', 'loginMessage');
      } else {
        showMessage('Failed to create admin account.', 'loginMessage');
      }
    });
});
*/

// Admin Sign-In
const signIn = document.getElementById('signInBtn');

signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('Email').value;
  const password = document.getElementById('Password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(docRef);

      if (!userDoc.exists()) {
        showMessage("No admin record found.", "loginMessage");
        return;
      }

      const role = userDoc.data().role;
      if (role !== "admin") {
        showMessage("Access denied: not an admin account.", "loginMessage");
        return;
      }

      // Get the Firebase ID token (different from accessToken)
user.getIdToken(true) // Force refresh to ensure token is current
  .then(idToken => {
    // Store the token in localStorage for future requests
    localStorage.setItem('authToken', idToken);
    
    fetch("https://group42backendv2-hyckethpe4fwfjga.uksouth-01.azurewebsites.net/authorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}` // Use the ID token
      },
      credentials: "include", // Required for cookies
      body: JSON.stringify({
        userId: user.uid,
        email: email,
        role: role
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Authorization failed with status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Authorization successful:", data);
      
      // Verify we have the token/session before redirecting
      if (data.success || data.token || data.authorized) {
        // If server provides a token, store it
        if (data.token) {
          localStorage.setItem('serverToken', data.token);
        }
        window.location.href = `https://group42backendv2-hyckethpe4fwfjga.uksouth-01.azurewebsites.net/adminHP.html`;
      } else {
        throw new Error("Authorization response missing expected confirmation");
      }
    })
    .catch(error => {
      showMessage(`Authentication error: ${error.message}`, 'loginMessage');
      console.error("Authorization error:", error);
    });
  })
  .catch(error => {
    showMessage(`Token generation failed: ${error.message}`, 'loginMessage');
    console.error("Token error:", error);
  });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential' || !email || !password) {
        showMessage('Incorrect email or password.', 'loginMessage');
      } else {
        showMessage('Login failed: ' + error.message, 'loginMessage');
      }
    });
});
