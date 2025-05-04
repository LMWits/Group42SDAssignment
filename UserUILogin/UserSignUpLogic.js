import { auth, db } from './firebaseAuth.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Show feedback
function showMessage(message) {
  const messageBox = document.getElementById("signupMessage");
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