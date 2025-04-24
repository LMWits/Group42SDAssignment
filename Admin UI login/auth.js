import { auth, provider } from './firebaseAuth.js';
import {
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

const signUp = document.getElementById('signUpbtn');

  signUp.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const name = document.getElementById('Name').value;

    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('createUserWithEmailAndPassword');

        const user = userCredential.user;
        const userData = {
            email: email,
            name: name,
        };
        showMessage('Acount Created Successfully', 'signInMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'adminLogin.html';
        })
        .catch((error) => {
            console.error("Error Occurred When Writing Document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if(errorCode == 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists!', 'signInMessage');
        } else {
            showMessage('Unable to Create User', 'signInMessage');
        }
    })
  });


const signIn = document.getElementById('signInbtn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login Is Successful",'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = "https://group42backend-cxdxgmhrduhye8b3.uksouth-01.azurewebsites.net/adminHP.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if(errorCode === 'auth/invalid-credential'){
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else if(email == null || password == null){
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage('Account Does Not Exist', 'signInMessage');
      }
    })
});

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

      window.location.href = "https://group42backend-cxdxgmhrduhye8b3.uksouth-01.azurewebsites.net/adminHP.html";

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

const sum = (a, b) => a + b;

module.exports = { sum };



