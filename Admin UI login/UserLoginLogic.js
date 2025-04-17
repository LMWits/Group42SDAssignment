import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
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

// Utility to show messages
function showMessage(message) {
  const messageBox = document.getElementById("loginMessage");
  messageBox.textContent = message;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 4000);
}

// Login logic
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value;

    if (!email || !password) {
      showMessage("Please fill in both fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        showMessage("No user record found. Contact support.");
        return;
      }

      const role = userDoc.data().role;
      if (role === "admin") {
        showMessage("This is an admin account. Please use the admin login page.");
      } else if (role === "user") {
        window.location.href = "userDashboard.html";
      } else {
        showMessage("Unknown role. Please contact support.");
      }

    } catch (error) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        showMessage("Incorrect email or password.");
      } else {
        showMessage("Login failed: " + error.message);
      }
    }
  });
});
