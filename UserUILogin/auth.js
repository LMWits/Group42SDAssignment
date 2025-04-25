import { auth, provider } from './firebaseAuth.js';
import { signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Import showMessage function from firebaseAuth
import { showMessage } from './firebaseAuth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('MSlogin');

  // ✅ Only attach event if the button exists
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("✅ Signed in:", result.user);
          // Optional: Redirect to user home
          window.location.href = 'userHome.html';
        })
        .catch((error) => {
          console.error("❌ Popup Error:", error.code, error.message);
          // Use showMessage instead of alert
          showMessage("Microsoft login failed. Try again.", 'signInMessage');
        });
    });
  }
});
