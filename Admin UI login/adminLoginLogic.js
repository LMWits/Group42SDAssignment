console.log("✅ AdminLoginLogic.js script loaded.");

import { auth, db } from './firebaseAuth.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { showMessage } from './auth.js';

// Admin login logic
document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signInBtn");

  // Sign-In Logic
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value;

    console.log("📩 Admin logging in with:", email);

    if (!email || !password) {
      showMessage("Please fill in both fields.", "loginMessage");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        showMessage("No admin record found. Contact support.", "loginMessage");
        return;
      }

      const role = userDoc.data().role;
      if (role === "admin") {
        window.location.href = "adminDashboard.html";
      } else {
        showMessage("Access denied. This is not an admin account.", "loginMessage");
      }

    } catch (error) {
      console.error("❌ Admin login failed:", error.code, error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        showMessage("Incorrect email or password.", "loginMessage");
      } else {
        showMessage("Login failed: " + error.message, "loginMessage");
      }
    }
  });
});
