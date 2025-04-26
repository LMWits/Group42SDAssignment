console.log("✅ AdminLoginLogic.js script loaded.");

import { auth, db } from './firebaseAuth.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc,setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { showMessage } from './auth.js';

// Admin login logic
document.addEventListener("DOMContentLoaded", () => {
  const signUpBtn = document.getElementById("signUpBtn");
  const signInBtn = document.getElementById("signInBtn");

  // Sign-In Logic
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value;

    console.log("📩 Admin logging in with:", email);

    if (!email || !password) {
      showMessage("Please fill in both fields.","loginMessage");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        showMessage("No admin record found. Contact support.","loginMessage");
        return;
      }

      const role = userDoc.data().role;
      if (role === "admin") {
        window.location.href = "adminDashboard.html";
      } else if (role === "user") {
        showMessage("This is a user account. Please use the user login page.","loginMessage");
      } else {
        showMessage("Unknown role. Please contact support.","loginMessage");
      }

    } catch (error) {
      console.error("❌ Admin login failed:", error.code, error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        showMessage("Incorrect email or password.","loginMessage");
      } else {
        showMessage("Login failed: " + error.message,"loginMessage");
      }
    }
  });

  // New Sign-Up Logic
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("Name").value.trim();
    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value;

    console.log("📝 New user signing up with:", email);

    if (!name || !email || !password) {
      showMessage("Please fill in all fields.","loginMessage");
      return;
    }

    try {
      // 1. Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Save additional user data to Firestore
      await setDoc(doc(db, "users", uid), {
        name: name,
        email: email,
        role: "user", // Default role (change to "admin" if needed)
        createdAt: new Date()
      });

      showMessage("Account created successfully! You can now sign in.","loginMessage");

      // Optional: Switch to sign-in form automatically
      document.getElementById("signUpLink").click();

    } catch (error) {
      console.error("❌ Sign-up failed:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        showMessage("Email already in use.","loginMessage");
      } else if (error.code === "auth/weak-password") {
        showMessage("Password should be at least 6 characters.","loginMessage");
      } else {
        showMessage("Sign-up failed: " + error.message,"loginMessage");
      }
    }
  });
});
