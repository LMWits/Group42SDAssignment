import { auth, provider } from './firebaseAuth.js';
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
          console.log("✅ Signed in:", result.user);
        })
        .catch((error) => {
          console.error("❌ Popup Error:", error.code, error.message);
        });
    });
  });
  
  
