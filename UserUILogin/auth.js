import { auth, provider, db } from './firebaseAuth.js';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Utility to show message
function showMessage(message, pId = "loginMessage") {
  const messageBox = document.getElementById(pId);
  if (!messageBox) return;

  messageBox.style.display = "block";
  messageBox.innerText = message;
  messageBox.style.opacity = 1;
  messageBox.style.pointerEvents = "auto";

  setTimeout(() => {
    messageBox.style.opacity = 0;
    messageBox.style.pointerEvents = "none";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 500);
  }, 4000);
}

// Microsoft login (for users only)
document.addEventListener('DOMContentLoaded', () => {
  const msLoginBtn = document.getElementById('MSlogin');
  if (!msLoginBtn) return;

  msLoginBtn.addEventListener('click', async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: "user"
        });
        console.log("✅ Microsoft user added to Firestore");
      }

      // Check role
      const role = (await getDoc(userRef)).data().role;
      if (role !== "user") {
        showMessage("This account is not a user account.", "loginMessage");
        return;
      }

      window.location.href = "userDashboard.html";

    } catch (error) {
      console.error("❌ Microsoft Sign-In failed:", error.code, error.message);
      showMessage("Microsoft Sign-In failed. Try again.", "loginMessage");
    }
  });
});

