import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase"; // to connect to Firestore
import { doc, setDoc } from "firebase/firestore"; // for saving data
import { getDoc } from "firebase/firestore";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const printToken = async () => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      console.log("Firebase token:", token);
    } else {
      alert("User not logged in");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user role to Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user" // Default role
        });

        alert("Registered successfully!");

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the user's role from Firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
            const role = docSnap.data().role;
            console.log("User role:", role);

            if (role === "admin") {
                alert("Welcome, Admin!");
                // TODO: Show admin-only features
            } else {
                alert("Welcome, User!");
                // TODO: Show user-only features
            }
        } else {
            alert("No role found for this user.");
        }

      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          {isRegistering ? "Register" : "Login"}
        </button>
        <button onClick={printToken} style={{ marginTop: 10 }}>
        Get Firebase Token (for Postman)
        </button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: 10 }}>
        {isRegistering ? "Have an account? Login" : "Need an account? Register"}
      </button>
    </div>
  );
}

/*To make someone an admin
Step 1: Firebase Console → Firestore Database
Step 2: Open "users" collection
Step 3: Click on user document
Step 4: Change "role": "user" to "role" : "admin"*/