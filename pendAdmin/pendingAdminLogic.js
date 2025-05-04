import { auth, db } from './firebaseAuth.js';
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pendingAdminForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("Name").value.trim();
    const email = document.getElementById("Email").value.trim();
    const phone = document.getElementById("Phone").value.trim();
    const password = document.getElementById("Password").value.trim();
    const messageBox = document.getElementById("pendingMessage");

    if (!name || !email || !phone || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // ✅ Step 1: Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // ✅ Step 2: Save to Firestore under 'pending_admins' using UID
      const now = new Date();
      const reviewDate = new Date(now);
      reviewDate.setDate(now.getDate() + 7);

      const formattedDate = reviewDate.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await setDoc(doc(db, "pending_admins", uid), {
        uid,
        name,
        email,
        phone,
        role: "pending_admin",
        submittedAt: now
      });

      // ✅ Step 3: Show success and redirect
      messageBox.innerHTML = `✅ Request submitted successfully.<br>
        It will be reviewed by <strong>${formattedDate}</strong>.<br>
        In the meantime, feel free to log in as a user.<br><br>
        Redirecting to login...`;
      messageBox.style.display = "block";
      form.reset();

      setTimeout(() => {
        window.location.href = "../UserUILogin/userlogin.html";
      }, 6000);
    } catch (error) {
      console.error("❌ Error creating pending admin:", error);
      alert("Failed to create pending admin account. " + error.message);
    }
  });
});
