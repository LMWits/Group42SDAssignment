/*import { auth, provider } from './firebaseAuth.js';
import { signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('MSlogin');
    if (!loginBtn) {
      console.error("Button with ID 'MSlogin' not found.");
      return;
    }
  
    loginBtn.addEventListener('click', () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          //const credential = OAuthProvider.credentialFromResult(result);
          //const accessToken = credential?.accessToken;
          //const idToken = credential?.idToken;
          window.location.href = 'homePage.html'; 
          console.log("✅ Signed in:", result.user);
        })
        .catch((error) => {
          console.error("❌ Popup Error:", error.code, error.message);
        });
    });
  });*/

import { auth, provider } from './firebaseAuth.js';
import {
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('MSlogin');
  if (!loginBtn) return;

  loginBtn.addEventListener('click', async () => {
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
        console.log("📝 Microsoft user added to Firestore");
      }

      // Check role for safety
      const role = (await getDoc(userRef)).data().role;
      if (role !== "user") {
        showMessage("This account is not a user account.");
        return;
      }

      window.location.href = "/ZSFileAccesUpload1/adminHP.html";

    } catch (error) {
      console.error("❌ Microsoft Sign-In failed:", error.code, error.message);
      showMessage("Microsoft Sign-In failed. Try again.");
    }
  });
});

// Optional helper (can be shared across scripts)
function showMessage(message) {
  const box = document.getElementById("signupMessage") || document.getElementById("loginMessage");
  if (!box) return;

  box.textContent = message;
  box.style.display = "block";
  box.style.opacity = "1";
  box.style.pointerEvents = "auto";

  setTimeout(() => {
    box.style.opacity = "0";
    box.style.pointerEvents = "none";
    setTimeout(() => {
      box.style.display = "none";
    }, 500);
  }, 4000);
}

  
  
