import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBfTyF0s-5Ijyj0eUOMNPGpHM04UI_U2bg",
  authDomain: "group42sdproject.firebaseapp.com",
  projectId: "group42sdproject",
  storageBucket: "group42sdproject.appspot.com",
  messagingSenderId: "741179377608",
  appId: "1:741179377608:web:194b7f53db28312824e2fd",
  measurementId: "G-P1C8Y3H2LJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Show feedback
function showMessage(message) {
  const messageBox = document.getElementById("signupMessage");
  messageBox.textContent = message;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 4000);
}

// Sign up logic
document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");

  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("Name").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    if (!name || !email || !password) {
      showMessage("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store user info in Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role: "user"
      });

      showMessage("Account created successfully!");
      setTimeout(() => {
        window.location.href = "userDashboard.html";
      }, 1000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showMessage("Email already in use.");
      } else if (error.code === "auth/weak-password") {
        showMessage("Password should be at least 6 characters.");
      } else {
        showMessage("Error: " + error.message);
      }
    }
  });
});
