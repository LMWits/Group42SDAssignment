import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  OAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  browserPopupRedirectResolver
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBfTyF0s-5Ijyj0eUOMNPGpHM04UI_U2bg",
  authDomain: "group42sdproject.firebaseapp.com",
  projectId: "group42sdproject",
  storageBucket: "group42sdproject.appspot.com",
  messagingSenderId: "741179377608",
  appId: "1:741179377608:web:194b7f53db28312824e2fd",
  measurementId: "G-P1C8Y3H2LJ"
};

// ✅ Avoid duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});

const db = getFirestore(app);
const analytics = getAnalytics(app);

// ✅ Setup Microsoft login
const provider = new OAuthProvider('microsoft.com');
provider.addScope('email');
provider.addScope('profile');
provider.setCustomParameters({ prompt: 'login' });

// ✅ Export shared Firebase instances
export { app, auth, db, provider };

