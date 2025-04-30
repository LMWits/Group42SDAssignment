console.log("✅ UserLoginLogic.js script loaded.");

import { auth, db } from './firebaseAuth.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Utility to show messages
function showMessage(message) {
  const messageBox = document.getElementById("loginMessage");
  if (!messageBox) return;

  messageBox.textContent = message;
  messageBox.style.display = "block";
  messageBox.style.opacity = "1";
  messageBox.style.pointerEvents = "auto";

  setTimeout(() => {
    messageBox.style.opacity = "0";
    messageBox.style.pointerEvents = "none";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 500);
  }, 4000);
}

// Login logic
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value;

    console.log("📩 Logging in with:", email);

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
      console.error("❌ Login failed:", error.code, error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        showMessage("Incorrect email or password.");
      } else {
        showMessage("Login failed: " + error.message);
      }
    }
  });
});
